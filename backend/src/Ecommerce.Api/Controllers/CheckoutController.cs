using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/checkout")]
public class CheckoutController : ControllerBase
{
    [HttpPost("sessions")]
    public ActionResult<CheckoutSessionDto> CreateSession([FromBody] CheckoutSessionCreateRequest request)
    {
        if (!CheckoutValidation.TryValidateCreateRequest(request, out var validationError))
        {
            return ValidationProblem(validationError);
        }

        var created = CheckoutStore.CreateSession(request);
        return CreatedAtAction(nameof(GetSessionById), new { id = created.Id }, created);
    }

    [HttpGet("sessions/{id}")]
    public ActionResult<CheckoutSessionDto> GetSessionById(string id)
    {
        var session = CheckoutStore.GetSessionById(id);
        return session is null ? NotFound() : Ok(session);
    }

    [HttpPost("sessions/{id}/confirm")]
    public ActionResult<CheckoutConfirmResponse> ConfirmSession(string id)
    {
        var outcome = CheckoutStore.ConfirmSession(id);
        if (!outcome.Found)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(outcome.ValidationError))
        {
            return ValidationProblem(outcome.ValidationError);
        }

        return Ok(outcome.Response!);
    }
}

[ApiController]
[Route("api/payments")]
public class CheckoutPaymentsController : ControllerBase
{
    [HttpPost("intents")]
    public ActionResult<CheckoutPaymentIntentDto> CreateIntent([FromBody] CheckoutPaymentIntentCreateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.SessionId))
        {
            return ValidationProblem("El sessionId es obligatorio para crear el intento de pago.");
        }

        var intent = CheckoutStore.CreatePaymentIntent(request.SessionId.Trim());
        return intent is null ? NotFound() : Ok(intent);
    }

    [HttpPost("webhook")]
    public ActionResult<CheckoutPaymentWebhookResponse> ProcessWebhook([FromBody] CheckoutPaymentWebhookRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.TransactionReference))
        {
            return ValidationProblem("La referencia de transaccion es obligatoria.");
        }

        var result = CheckoutStore.ProcessPaymentWebhook(request);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("simulate-webhook")]
    public ActionResult<CheckoutPaymentWebhookResponse> SimulateWebhook([FromBody] CheckoutPaymentSimulationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.OrderNumber))
        {
            return ValidationProblem("El orderNumber es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(request.Status))
        {
            return ValidationProblem("El status es obligatorio (approved, rejected o pending).");
        }

        var result = CheckoutStore.SimulateWebhookByOrderNumber(
            request.OrderNumber.Trim(),
            request.Status.Trim(),
            request.EventName);

        return result is null ? NotFound() : Ok(result);
    }
}

[ApiController]
[Route("api/orders")]
public class ShopOrdersController : ControllerBase
{
    [HttpGet("{id}")]
    public ActionResult<CheckoutConfirmResponse> GetOrderById(string id)
    {
        var order = CheckoutStore.GetOrderByIdForCheckout(id);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpGet("by-reference/{reference}")]
    public ActionResult<CheckoutConfirmResponse> GetOrderByReference(string reference)
    {
        var order = CheckoutStore.GetOrderByReferenceForCheckout(reference);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpGet("{id}/summary")]
    public ActionResult<CheckoutOrderSummaryDto> GetOrderSummary(string id)
    {
        var summary = CheckoutStore.GetOrderSummaryById(id);
        return summary is null ? NotFound() : Ok(summary);
    }

    [HttpGet("by-reference/{reference}/summary")]
    public ActionResult<CheckoutOrderSummaryDto> GetOrderSummaryByReference(string reference)
    {
        var summary = CheckoutStore.GetOrderSummaryByReference(reference);
        return summary is null ? NotFound() : Ok(summary);
    }

    [HttpGet("{id}/items")]
    public ActionResult<IReadOnlyList<CheckoutOrderItemRecordDto>> GetOrderItems(string id)
    {
        if (CheckoutStore.GetOrderById(id) is null)
        {
            return NotFound();
        }

        return Ok(CheckoutStore.GetOrderItems(id));
    }

    [HttpGet("{id}/history")]
    public ActionResult<IReadOnlyList<CheckoutOrderStatusHistoryDto>> GetOrderHistory(string id)
    {
        if (CheckoutStore.GetOrderById(id) is null)
        {
            return NotFound();
        }

        return Ok(CheckoutStore.GetOrderHistory(id));
    }

    [HttpGet("{id}/inventory-movements")]
    public ActionResult<IReadOnlyList<InventoryMovementDto>> GetOrderInventoryMovements(string id)
    {
        if (CheckoutStore.GetOrderById(id) is null)
        {
            return NotFound();
        }

        return Ok(InventoryStore.GetMovementsByOrderId(id));
    }
}

public static class CheckoutValidation
{
    public static bool TryValidateCreateRequest(
        CheckoutSessionCreateRequest request,
        out string validationError)
    {
        if (string.IsNullOrWhiteSpace(request.ContactEmail))
        {
            validationError = "El correo de contacto es obligatorio.";
            return false;
        }

        if (!request.AcceptedTerms)
        {
            validationError = "Debes aceptar terminos y condiciones para continuar.";
            return false;
        }

        if (!IsValidDeliveryMethod(request.DeliveryMethod))
        {
            validationError = "Metodo de entrega invalido. Usa shipping o pickup.";
            return false;
        }

        if (!IsValidPaymentMethod(request.PaymentMethod))
        {
            validationError = "Metodo de pago invalido. Usa card, pse o cash.";
            return false;
        }

        if (request.Items is null || request.Items.Count == 0)
        {
            validationError = "Debes enviar al menos un item en el checkout.";
            return false;
        }

        foreach (var item in request.Items)
        {
            if (string.IsNullOrWhiteSpace(item.ProductId) || item.Quantity <= 0)
            {
                validationError = "Todos los items deben tener productId y cantidad mayor a cero.";
                return false;
            }

            var product = CatalogData.Products.FirstOrDefault(product =>
                string.Equals(product.Id, item.ProductId.Trim(), StringComparison.OrdinalIgnoreCase));

            if (product is null)
            {
                validationError = $"El producto {item.ProductId} no existe.";
                return false;
            }

            if (!InventoryStore.HasSufficientStock(product.Id, item.Quantity))
            {
                var available = InventoryStore.GetAvailableStock(product.Id);
                validationError = $"Stock insuficiente para {product.Name}. Disponible: {available}.";
                return false;
            }
        }

        validationError = string.Empty;
        return true;
    }

    public static bool IsValidDeliveryMethod(string deliveryMethod)
    {
        return deliveryMethod is "shipping" or "pickup";
    }

    public static bool IsValidPaymentMethod(string paymentMethod)
    {
        return paymentMethod is "card" or "pse" or "cash";
    }
}

public static class CheckoutStore
{
    private static readonly object SyncRoot = new();
    private static readonly List<CheckoutSessionDto> Sessions = new();
    private static readonly List<CheckoutOrderDto> Orders = new();
    private static readonly List<CheckoutOrderItemRecordDto> OrderItems = new();
    private static readonly List<CheckoutOrderStatusHistoryDto> OrderHistory = new();
    private static readonly List<CheckoutPaymentIntentDto> PaymentIntents = new();

    public static CheckoutSessionDto CreateSession(CheckoutSessionCreateRequest request)
    {
        lock (SyncRoot)
        {
            var items = BuildSessionItems(request.Items);
            var subtotal = items.Sum(item => item.UnitPrice * item.Quantity);
            var taxes = Math.Round(subtotal * 0.19m, 2, MidpointRounding.AwayFromZero);
            var shipping = request.DeliveryMethod == "shipping" ? 35000m : 0m;
            var total = subtotal + taxes + shipping;
            var now = DateTimeOffset.UtcNow;

            var session = new CheckoutSessionDto(
                Id: $"chk-{Guid.NewGuid():N}",
                Status: "draft",
                ContactEmail: request.ContactEmail.Trim(),
                DeliveryMethod: request.DeliveryMethod.Trim(),
                PaymentMethod: request.PaymentMethod.Trim(),
                CustomerFullName: BuildCustomerFullName(request.FirstName, request.LastName),
                BillingCountry: request.BillingCountry.Trim(),
                City: request.City.Trim(),
                State: request.State.Trim(),
                AddressLine: request.AddressLine.Trim(),
                PostalCode: request.PostalCode.Trim(),
                Phone: request.Phone.Trim(),
                OrderNote: request.OrderNote.Trim(),
                Subtotal: subtotal,
                Taxes: taxes,
                Shipping: shipping,
                Total: total,
                Items: items,
                CreatedAt: now,
                UpdatedAt: now,
                ConfirmedOrderId: null,
                ConfirmedOrderNumber: null,
                PaymentReference: null);

            Sessions.Insert(0, session);
            return session;
        }
    }

    public static CheckoutSessionDto? GetSessionById(string id)
    {
        lock (SyncRoot)
        {
            return Sessions.FirstOrDefault(session =>
                string.Equals(session.Id, id, StringComparison.Ordinal));
        }
    }

    public static CheckoutConfirmOutcome ConfirmSession(string id)
    {
        lock (SyncRoot)
        {
            var sessionIndex = Sessions.FindIndex(session =>
                string.Equals(session.Id, id, StringComparison.Ordinal));
            if (sessionIndex < 0)
            {
                return new CheckoutConfirmOutcome(false, null, null);
            }

            var session = Sessions[sessionIndex];
            var normalizedPaymentMethod = session.PaymentMethod.Trim().ToLowerInvariant();

            if (string.Equals(session.Status, "confirmed", StringComparison.OrdinalIgnoreCase)
                && !string.IsNullOrWhiteSpace(session.ConfirmedOrderId))
            {
                var existingOrder = Orders.FirstOrDefault(order =>
                    string.Equals(order.Id, session.ConfirmedOrderId, StringComparison.Ordinal));

                if (existingOrder is null)
                {
                    return new CheckoutConfirmOutcome(false, null, null);
                }

                return new CheckoutConfirmOutcome(true, BuildConfirmResponse(existingOrder), null);
            }

            var now = DateTimeOffset.UtcNow;
            var orderNumber = GenerateOrderNumber();
            var orderId = $"ord-{Guid.NewGuid():N}";

            if (!InventoryStore.TryDeduct(orderId, orderNumber, session.Items, out var inventoryError))
            {
                return new CheckoutConfirmOutcome(true, null, inventoryError);
            }

            var paymentIntent = CreatePaymentIntentInternal(session.Id, session.PaymentMethod, session.Total);
            var initialOrderStatus = normalizedPaymentMethod == "cash" ? "confirmed" : "payment_pending";
            var initialPaymentStatus = normalizedPaymentMethod == "cash" ? "approved" : "pending";

            var order = new CheckoutOrderDto(
                Id: orderId,
                OrderNumber: orderNumber,
                Status: initialOrderStatus,
                ContactEmail: session.ContactEmail,
                DeliveryMethod: session.DeliveryMethod,
                PaymentMethod: session.PaymentMethod,
                TransactionReference: paymentIntent.TransactionReference,
                Subtotal: session.Subtotal,
                Taxes: session.Taxes,
                Shipping: session.Shipping,
                Total: session.Total,
                Items: session.Items,
                CreatedAt: now,
                UpdatedAt: now);

            Orders.Insert(0, order);

            Sessions[sessionIndex] = session with
            {
                Status = normalizedPaymentMethod == "cash" ? "confirmed" : "payment_pending",
                UpdatedAt = now,
                ConfirmedOrderId = order.Id,
                ConfirmedOrderNumber = order.OrderNumber,
                PaymentReference = paymentIntent.TransactionReference,
            };

            RegisterOrderItems(order);
            AppendHistory(order.Id, "created", "Pedido creado desde checkout.");
            if (initialPaymentStatus == "approved")
            {
                AppendHistory(order.Id, "paid", "Pago confirmado automaticamente para contraentrega.");
            }

            RegisterAdminRecords(order, session, initialPaymentStatus);

            return new CheckoutConfirmOutcome(true, BuildConfirmResponse(order), null);
        }
    }

    public static CheckoutOrderDto? GetOrderById(string id)
    {
        lock (SyncRoot)
        {
            return Orders.FirstOrDefault(order =>
                string.Equals(order.Id, id, StringComparison.Ordinal));
        }
    }

    public static CheckoutOrderDto? GetOrderByReference(string reference)
    {
        lock (SyncRoot)
        {
            return Orders.FirstOrDefault(order =>
                string.Equals(order.OrderNumber, reference, StringComparison.OrdinalIgnoreCase));
        }
    }

    public static CheckoutConfirmResponse? GetOrderByIdForCheckout(string id)
    {
        lock (SyncRoot)
        {
            var order = GetOrderById(id);
            return order is null ? null : BuildConfirmResponse(order);
        }
    }

    public static CheckoutConfirmResponse? GetOrderByReferenceForCheckout(string reference)
    {
        lock (SyncRoot)
        {
            var order = GetOrderByReference(reference);
            return order is null ? null : BuildConfirmResponse(order);
        }
    }

    public static CheckoutOrderSummaryDto? GetOrderSummaryById(string id)
    {
        lock (SyncRoot)
        {
            var order = GetOrderById(id);
            return order is null ? null : BuildOrderSummary(order);
        }
    }

    public static CheckoutOrderSummaryDto? GetOrderSummaryByReference(string reference)
    {
        lock (SyncRoot)
        {
            var order = GetOrderByReference(reference);
            return order is null ? null : BuildOrderSummary(order);
        }
    }

    public static IReadOnlyList<CheckoutOrderItemRecordDto> GetOrderItems(string orderId)
    {
        lock (SyncRoot)
        {
            return OrderItems
                .Where(item => string.Equals(item.OrderId, orderId, StringComparison.Ordinal))
                .ToArray();
        }
    }

    public static IReadOnlyList<CheckoutOrderStatusHistoryDto> GetOrderHistory(string orderId)
    {
        lock (SyncRoot)
        {
            return OrderHistory
                .Where(item => string.Equals(item.OrderId, orderId, StringComparison.Ordinal))
                .OrderBy(item => item.ChangedAt)
                .ToArray();
        }
    }

    public static CheckoutPaymentIntentDto? CreatePaymentIntent(string sessionId)
    {
        lock (SyncRoot)
        {
            var session = Sessions.FirstOrDefault(item =>
                string.Equals(item.Id, sessionId, StringComparison.Ordinal));
            if (session is null)
            {
                return null;
            }

            return CreatePaymentIntentInternal(session.Id, session.PaymentMethod, session.Total);
        }
    }

    public static CheckoutPaymentWebhookResponse? ProcessPaymentWebhook(CheckoutPaymentWebhookRequest request)
    {
        lock (SyncRoot)
        {
            var paymentIntentIndex = PaymentIntents.FindIndex(item =>
                string.Equals(item.TransactionReference, request.TransactionReference.Trim(), StringComparison.OrdinalIgnoreCase));
            if (paymentIntentIndex < 0)
            {
                return null;
            }

            var paymentIntent = PaymentIntents[paymentIntentIndex];
            var order = Orders.FirstOrDefault(item =>
                string.Equals(item.TransactionReference, paymentIntent.TransactionReference, StringComparison.Ordinal));
            if (order is null)
            {
                return null;
            }

            var previousOrderStatus = order.Status;

            var normalizedStatus = NormalizePaymentStatus(request.Status);
            var now = DateTimeOffset.UtcNow;

            PaymentIntents[paymentIntentIndex] = paymentIntent with
            {
                Status = normalizedStatus,
                GatewayEvent = string.IsNullOrWhiteSpace(request.EventName)
                    ? paymentIntent.GatewayEvent
                    : request.EventName.Trim(),
                UpdatedAt = now,
            };

            var orderIndex = Orders.FindIndex(item => string.Equals(item.Id, order.Id, StringComparison.Ordinal));
            if (orderIndex >= 0)
            {
                var nextOrderStatus = normalizedStatus switch
                {
                    "approved" => "confirmed",
                    "rejected" => "payment_failed",
                    _ => order.Status,
                };

                Orders[orderIndex] = order with
                {
                    Status = nextOrderStatus,
                    UpdatedAt = now,
                };

                var sessionIndex = Sessions.FindIndex(item =>
                    string.Equals(item.ConfirmedOrderId, order.Id, StringComparison.Ordinal));
                if (sessionIndex >= 0)
                {
                    var checkoutSession = Sessions[sessionIndex];
                    Sessions[sessionIndex] = checkoutSession with
                    {
                        Status = nextOrderStatus,
                        UpdatedAt = now,
                    };
                }

                if (nextOrderStatus == "confirmed")
                {
                    AppendHistory(order.Id, "paid", "Pago confirmado por webhook simulado.");
                    AdminOrderStore.UpdateStatusByOrderNumber(order.OrderNumber, "Pagado", "Actualizado por webhook: pago aprobado.");
                    AdminPaymentStore.UpdateStatusByPaymentReference(paymentIntent.TransactionReference, "Aprobado", "Webhook simulado aprobado.");
                }
                else if (nextOrderStatus == "payment_failed")
                {
                    if (!string.Equals(previousOrderStatus, "payment_failed", StringComparison.OrdinalIgnoreCase))
                    {
                        InventoryStore.RestockFromOrder(order.Id, order.OrderNumber, order.Items, "Reingreso por pago rechazado.");
                    }

                    AppendHistory(order.Id, "payment_failed", "Pago rechazado por webhook simulado.");
                    AdminOrderStore.UpdateStatusByOrderNumber(order.OrderNumber, "Pago fallido", "Actualizado por webhook: pago rechazado.");
                    AdminPaymentStore.UpdateStatusByPaymentReference(paymentIntent.TransactionReference, "Rechazado", "Webhook simulado rechazado.");
                }
            }

            return new CheckoutPaymentWebhookResponse(
                TransactionReference: paymentIntent.TransactionReference,
                SessionId: paymentIntent.SessionId,
                OrderId: order.Id,
                OrderNumber: order.OrderNumber,
                PaymentStatus: normalizedStatus,
                OrderStatus: Orders.First(item => string.Equals(item.Id, order.Id, StringComparison.Ordinal)).Status,
                UpdatedAt: now);
        }
    }

    public static CheckoutPaymentWebhookResponse? SimulateWebhookByOrderNumber(
        string orderNumber,
        string status,
        string? eventName)
    {
        lock (SyncRoot)
        {
            var order = Orders.FirstOrDefault(item =>
                string.Equals(item.OrderNumber, orderNumber, StringComparison.OrdinalIgnoreCase));
            if (order is null)
            {
                return null;
            }

            return ProcessPaymentWebhook(new CheckoutPaymentWebhookRequest(
                TransactionReference: order.TransactionReference,
                Status: status,
                EventName: string.IsNullOrWhiteSpace(eventName)
                    ? "checkout.simulated-webhook"
                    : eventName.Trim()));
        }
    }

    private static IReadOnlyList<CheckoutSessionItemDto> BuildSessionItems(
        IReadOnlyList<CheckoutSessionItemRequest> itemRequests)
    {
        return itemRequests
            .Select(itemRequest =>
            {
                var product = CatalogData.Products.First(product =>
                    string.Equals(product.Id, itemRequest.ProductId.Trim(), StringComparison.OrdinalIgnoreCase));

                return new CheckoutSessionItemDto(
                    ProductId: product.Id,
                    ProductName: product.Name,
                    ProductImage: product.Image,
                    Quantity: itemRequest.Quantity,
                    UnitPrice: product.Price);
            })
            .ToArray();
    }

    private static CheckoutConfirmResponse BuildConfirmResponse(CheckoutOrderDto order)
    {
        var paymentIntentStatus = PaymentIntents
            .FirstOrDefault(item => string.Equals(item.TransactionReference, order.TransactionReference, StringComparison.Ordinal))
            ?.Status ?? "pending";

        return new CheckoutConfirmResponse(
            OrderId: order.Id,
            OrderNumber: order.OrderNumber,
            OrderStatus: order.Status,
            PaymentStatus: paymentIntentStatus,
            TransactionReference: order.TransactionReference,
            CreatedAt: order.CreatedAt,
            ContactEmail: order.ContactEmail,
            DeliveryMethod: order.DeliveryMethod,
            PaymentMethod: order.PaymentMethod,
            Subtotal: order.Subtotal,
            Taxes: order.Taxes,
            Shipping: order.Shipping,
            Total: order.Total,
            Items: order.Items);
    }

    private static CheckoutPaymentIntentDto CreatePaymentIntentInternal(string sessionId, string method, decimal amount)
    {
        var existing = PaymentIntents.FirstOrDefault(item =>
            string.Equals(item.SessionId, sessionId, StringComparison.Ordinal));
        if (existing is not null)
        {
            return existing;
        }

        var now = DateTimeOffset.UtcNow;
        var intent = new CheckoutPaymentIntentDto(
            Id: $"pi-{Guid.NewGuid():N}",
            SessionId: sessionId,
            Method: method.Trim().ToLowerInvariant(),
            Amount: amount,
            Status: method.Trim().Equals("cash", StringComparison.OrdinalIgnoreCase) ? "approved" : "pending",
            TransactionReference: GenerateTransactionReference(),
            GatewayEvent: "intent.created",
            CreatedAt: now,
            UpdatedAt: now);

        PaymentIntents.Insert(0, intent);
        return intent;
    }

    private static void RegisterOrderItems(CheckoutOrderDto order)
    {
        var now = DateTimeOffset.UtcNow;
        foreach (var item in order.Items)
        {
            OrderItems.Add(new CheckoutOrderItemRecordDto(
                Id: $"ori-{Guid.NewGuid():N}",
                OrderId: order.Id,
                OrderNumber: order.OrderNumber,
                ProductId: item.ProductId,
                ProductName: item.ProductName,
                Quantity: item.Quantity,
                UnitPrice: item.UnitPrice,
                LineTotal: item.UnitPrice * item.Quantity,
                CreatedAt: now));
        }
    }

    private static void AppendHistory(string orderId, string status, string note)
    {
        var order = Orders.FirstOrDefault(item => string.Equals(item.Id, orderId, StringComparison.Ordinal));
        if (order is null)
        {
            return;
        }

        OrderHistory.Add(new CheckoutOrderStatusHistoryDto(
            Id: $"hst-{Guid.NewGuid():N}",
            OrderId: order.Id,
            OrderNumber: order.OrderNumber,
            Status: status,
            Note: note,
            ChangedAt: DateTimeOffset.UtcNow));
    }

    private static string NormalizePaymentStatus(string rawStatus)
    {
        var normalized = rawStatus.Trim().ToLowerInvariant();
        return normalized switch
        {
            "approved" or "paid" or "succeeded" => "approved",
            "rejected" or "failed" or "declined" => "rejected",
            _ => "pending",
        };
    }

    private static CheckoutOrderSummaryDto BuildOrderSummary(CheckoutOrderDto order)
    {
        var payment = PaymentIntents
            .FirstOrDefault(item => string.Equals(item.TransactionReference, order.TransactionReference, StringComparison.Ordinal));

        return new CheckoutOrderSummaryDto(
            Order: BuildConfirmResponse(order),
            Items: GetOrderItems(order.Id),
            History: GetOrderHistory(order.Id),
            InventoryMovements: InventoryStore.GetMovementsByOrderId(order.Id),
            PaymentIntent: payment);
    }

    private static void RegisterAdminRecords(CheckoutOrderDto order, CheckoutSessionDto session, string paymentStatus)
    {
        var orderStatus = "Confirmado";
        var paymentStatusLabel = paymentStatus switch
        {
            "approved" => "Aprobado",
            "rejected" => "Rechazado",
            _ => "Pendiente",
        };
        var paymentMethodLabel = session.PaymentMethod switch
        {
            "card" => "Tarjeta",
            "pse" => "PSE",
            "cash" => "Contraentrega",
            _ => session.PaymentMethod,
        };

        AdminOrderStore.Create(new AdminOrderUpsertRequest(
            OrderNumber: order.OrderNumber,
            Customer: string.IsNullOrWhiteSpace(session.CustomerFullName)
                ? session.ContactEmail
                : session.CustomerFullName,
            Total: order.Total,
            Status: orderStatus,
            PaymentMethod: paymentMethodLabel,
            ShippingAddress: BuildShippingAddress(session),
            Notes: string.IsNullOrWhiteSpace(session.OrderNote)
                ? "Generado desde checkout web."
                : session.OrderNote,
            CreatedAt: order.CreatedAt.UtcDateTime.ToString("yyyy-MM-dd")));

        AdminPaymentStore.Create(new AdminPaymentUpsertRequest(
            PaymentRef: order.TransactionReference,
            OrderNumber: order.OrderNumber,
            Customer: string.IsNullOrWhiteSpace(session.CustomerFullName)
                ? session.ContactEmail
                : session.CustomerFullName,
            Method: paymentMethodLabel,
            Status: paymentStatusLabel,
            Amount: order.Total,
            Currency: "COP",
            Gateway: "Checkout Web (simulado)",
            LastAttemptAt: order.CreatedAt.UtcDateTime.ToString("yyyy-MM-dd"),
            Notes: "Registro de pago generado desde flujo de checkout."));
    }

    private static string BuildShippingAddress(CheckoutSessionDto session)
    {
        var chunks = new List<string>();

        if (!string.IsNullOrWhiteSpace(session.AddressLine))
        {
            chunks.Add(session.AddressLine.Trim());
        }

        if (!string.IsNullOrWhiteSpace(session.City))
        {
            chunks.Add(session.City.Trim());
        }

        if (!string.IsNullOrWhiteSpace(session.State))
        {
            chunks.Add(session.State.Trim());
        }

        if (!string.IsNullOrWhiteSpace(session.BillingCountry))
        {
            chunks.Add(session.BillingCountry.Trim());
        }

        return chunks.Count == 0 ? "Por definir" : string.Join(", ", chunks);
    }

    private static string BuildCustomerFullName(string firstName, string lastName)
    {
        var normalizedFirstName = firstName.Trim();
        var normalizedLastName = lastName.Trim();
        return $"{normalizedFirstName} {normalizedLastName}".Trim();
    }

    private static string GenerateOrderNumber()
    {
        return $"PED-{DateTime.UtcNow:yyMMdd}-{Random.Shared.Next(1000, 9999)}";
    }

    private static string GenerateTransactionReference()
    {
        return $"TRX-{Guid.NewGuid():N}"[..15].ToUpperInvariant();
    }
}

public sealed record CheckoutSessionCreateRequest(
    string ContactEmail,
    string DeliveryMethod,
    string PaymentMethod,
    string FirstName,
    string LastName,
    string BillingCountry,
    string City,
    string State,
    string AddressLine,
    string PostalCode,
    string Phone,
    string DocumentType,
    string DocumentNumber,
    string PersonType,
    string SelectedBank,
    string OrderNote,
    bool AcceptedTerms,
    IReadOnlyList<CheckoutSessionItemRequest> Items);

public sealed record CheckoutSessionItemRequest(
    string ProductId,
    int Quantity);

public sealed record CheckoutSessionItemDto(
    string ProductId,
    string ProductName,
    string ProductImage,
    int Quantity,
    decimal UnitPrice);

public sealed record CheckoutSessionDto(
    string Id,
    string Status,
    string ContactEmail,
    string DeliveryMethod,
    string PaymentMethod,
    string CustomerFullName,
    string BillingCountry,
    string City,
    string State,
    string AddressLine,
    string PostalCode,
    string Phone,
    string OrderNote,
    decimal Subtotal,
    decimal Taxes,
    decimal Shipping,
    decimal Total,
    IReadOnlyList<CheckoutSessionItemDto> Items,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    string? ConfirmedOrderId,
    string? ConfirmedOrderNumber,
    string? PaymentReference);

public sealed record CheckoutOrderDto(
    string Id,
    string OrderNumber,
    string Status,
    string ContactEmail,
    string DeliveryMethod,
    string PaymentMethod,
    string TransactionReference,
    decimal Subtotal,
    decimal Taxes,
    decimal Shipping,
    decimal Total,
    IReadOnlyList<CheckoutSessionItemDto> Items,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);

public sealed record CheckoutConfirmResponse(
    string OrderId,
    string OrderNumber,
    string OrderStatus,
    string PaymentStatus,
    string TransactionReference,
    DateTimeOffset CreatedAt,
    string ContactEmail,
    string DeliveryMethod,
    string PaymentMethod,
    decimal Subtotal,
    decimal Taxes,
    decimal Shipping,
    decimal Total,
    IReadOnlyList<CheckoutSessionItemDto> Items);

public sealed record CheckoutConfirmOutcome(
    bool Found,
    CheckoutConfirmResponse? Response,
    string? ValidationError);

public sealed record CheckoutPaymentIntentCreateRequest(
    string SessionId);

public sealed record CheckoutPaymentIntentDto(
    string Id,
    string SessionId,
    string Method,
    decimal Amount,
    string Status,
    string TransactionReference,
    string GatewayEvent,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);

public sealed record CheckoutPaymentWebhookRequest(
    string TransactionReference,
    string Status,
    string? EventName);

public sealed record CheckoutPaymentSimulationRequest(
    string OrderNumber,
    string Status,
    string? EventName);

public sealed record CheckoutPaymentWebhookResponse(
    string TransactionReference,
    string SessionId,
    string OrderId,
    string OrderNumber,
    string PaymentStatus,
    string OrderStatus,
    DateTimeOffset UpdatedAt);

public sealed record CheckoutOrderItemRecordDto(
    string Id,
    string OrderId,
    string OrderNumber,
    string ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice,
    decimal LineTotal,
    DateTimeOffset CreatedAt);

public sealed record CheckoutOrderStatusHistoryDto(
    string Id,
    string OrderId,
    string OrderNumber,
    string Status,
    string Note,
    DateTimeOffset ChangedAt);

public sealed record CheckoutOrderSummaryDto(
    CheckoutConfirmResponse Order,
    IReadOnlyList<CheckoutOrderItemRecordDto> Items,
    IReadOnlyList<CheckoutOrderStatusHistoryDto> History,
    IReadOnlyList<InventoryMovementDto> InventoryMovements,
    CheckoutPaymentIntentDto? PaymentIntent);

public static class InventoryStore
{
    private static readonly object SyncRoot = new();
    private static readonly Dictionary<string, int> AvailableStock = CatalogData.Products
        .ToDictionary(product => product.Id, product => product.Stock, StringComparer.OrdinalIgnoreCase);
    private static readonly List<InventoryMovementDto> Movements = new();

    public static bool HasSufficientStock(string productId, int quantity)
    {
        lock (SyncRoot)
        {
            return AvailableStock.TryGetValue(productId, out var available)
                && quantity <= available;
        }
    }

    public static int GetAvailableStock(string productId)
    {
        lock (SyncRoot)
        {
            return AvailableStock.TryGetValue(productId, out var available) ? available : 0;
        }
    }

    public static bool TryDeduct(
        string orderId,
        string orderNumber,
        IReadOnlyList<CheckoutSessionItemDto> items,
        out string error)
    {
        lock (SyncRoot)
        {
            foreach (var item in items)
            {
                if (!AvailableStock.TryGetValue(item.ProductId, out var available) || item.Quantity > available)
                {
                    error = $"Stock insuficiente para {item.ProductName}. Disponible: {available}.";
                    return false;
                }
            }

            foreach (var item in items)
            {
                AvailableStock[item.ProductId] -= item.Quantity;

                Movements.Insert(0, new InventoryMovementDto(
                    Id: $"inv-{Guid.NewGuid():N}",
                    OrderId: orderId,
                    OrderNumber: orderNumber,
                    ProductId: item.ProductId,
                    ProductName: item.ProductName,
                    MovementType: "out",
                    Quantity: item.Quantity,
                    StockBefore: AvailableStock[item.ProductId] + item.Quantity,
                    StockAfter: AvailableStock[item.ProductId],
                    Note: "Salida por confirmacion de checkout.",
                    CreatedAt: DateTimeOffset.UtcNow));
            }

            error = string.Empty;
            return true;
        }
    }

    public static IReadOnlyList<InventoryMovementDto> GetMovementsByOrderId(string orderId)
    {
        lock (SyncRoot)
        {
            return Movements
                .Where(item => string.Equals(item.OrderId, orderId, StringComparison.Ordinal))
                .ToArray();
        }
    }

    public static void RestockFromOrder(
        string orderId,
        string orderNumber,
        IReadOnlyList<CheckoutSessionItemDto> items,
        string note)
    {
        lock (SyncRoot)
        {
            foreach (var item in items)
            {
                var stockBefore = AvailableStock.TryGetValue(item.ProductId, out var value)
                    ? value
                    : 0;
                var stockAfter = stockBefore + item.Quantity;
                AvailableStock[item.ProductId] = stockAfter;

                Movements.Insert(0, new InventoryMovementDto(
                    Id: $"inv-{Guid.NewGuid():N}",
                    OrderId: orderId,
                    OrderNumber: orderNumber,
                    ProductId: item.ProductId,
                    ProductName: item.ProductName,
                    MovementType: "in",
                    Quantity: item.Quantity,
                    StockBefore: stockBefore,
                    StockAfter: stockAfter,
                    Note: note,
                    CreatedAt: DateTimeOffset.UtcNow));
            }
        }
    }
}

public sealed record InventoryMovementDto(
    string Id,
    string OrderId,
    string OrderNumber,
    string ProductId,
    string ProductName,
    string MovementType,
    int Quantity,
    int StockBefore,
    int StockAfter,
    string Note,
    DateTimeOffset CreatedAt);
