namespace Ecommerce.Api.Controllers;

public sealed record AdminPaymentDto(
    string Id,
    string PaymentRef,
    string OrderNumber,
    string Customer,
    string Method,
    string Status,
    decimal Amount,
    string Currency,
    string Gateway,
    string LastAttemptAt,
    string Notes);

public sealed record AdminPaymentUpsertRequest(
    string PaymentRef,
    string OrderNumber,
    string Customer,
    string Method,
    string Status,
    decimal Amount,
    string Currency,
    string Gateway,
    string LastAttemptAt,
    string Notes);

public static class AdminPaymentStore
{
    private static readonly object SyncRoot = new();
    private static readonly List<AdminPaymentDto> Payments = BuildInitialPayments();

    public static IReadOnlyList<AdminPaymentDto> GetAll()
    {
        lock (SyncRoot)
        {
            return Payments.ToArray();
        }
    }

    public static AdminPaymentDto? GetById(string id)
    {
        lock (SyncRoot)
        {
            return Payments.FirstOrDefault(payment => payment.Id == id);
        }
    }

    public static AdminPaymentDto Create(AdminPaymentUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var created = BuildPayment(CreatePaymentId(request), request);
            Payments.Insert(0, created);
            return created;
        }
    }

    public static AdminPaymentDto? Update(string id, AdminPaymentUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var index = Payments.FindIndex(payment => payment.Id == id);
            if (index < 0)
            {
                return null;
            }

            var updated = BuildPayment(id, request);
            Payments[index] = updated;
            return updated;
        }
    }

    public static bool Delete(string id)
    {
        lock (SyncRoot)
        {
            return Payments.RemoveAll(payment => payment.Id == id) > 0;
        }
    }

    private static AdminPaymentDto BuildPayment(string id, AdminPaymentUpsertRequest request)
    {
        return new AdminPaymentDto(
            id,
            request.PaymentRef.Trim(),
            request.OrderNumber.Trim(),
            request.Customer.Trim(),
            request.Method.Trim(),
            request.Status.Trim(),
            request.Amount,
            request.Currency.Trim(),
            request.Gateway.Trim(),
            string.IsNullOrWhiteSpace(request.LastAttemptAt)
                ? DateOnly.FromDateTime(DateTime.UtcNow).ToString("yyyy-MM-dd")
                : request.LastAttemptAt.Trim(),
            request.Notes.Trim());
    }

    private static string CreatePaymentId(AdminPaymentUpsertRequest request)
    {
        var normalized = request.PaymentRef
            .Trim()
            .ToLowerInvariant()
            .Replace("/", "-")
            .Replace(' ', '-');

        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "[^a-z0-9-]", string.Empty);
        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "-+", "-").Trim('-');

        return string.IsNullOrWhiteSpace(normalized)
            ? $"pay-{Guid.NewGuid():N}"
            : $"pay-{normalized}";
    }

    private static List<AdminPaymentDto> BuildInitialPayments()
    {
        return new List<AdminPaymentDto>
        {
            new(
                "pay-2001",
                "TXN-770001",
                "ORD-1001",
                "Camilo Rojas",
                "Tarjeta",
                "Pendiente",
                325000,
                "COP",
                "Wompi",
                "2026-08-12",
                "Esperando confirmacion del gateway."),
            new(
                "pay-2002",
                "TXN-770002",
                "ORD-1002",
                "Laura Perez",
                "PSE",
                "Aprobado",
                840000,
                "COP",
                "PayU",
                "2026-08-11",
                "Pago aprobado y conciliado manualmente."),
            new(
                "pay-2003",
                "TXN-770003",
                "ORD-1003",
                "Pablo Cruz",
                "Transferencia",
                "Conciliado",
                1290000,
                "COP",
                "Bancolombia",
                "2026-08-10",
                "Transferencia validada por tesoreria."),
            new(
                "pay-2004",
                "TXN-770004",
                "ORD-1004",
                "Ana Torres",
                "Contraentrega",
                "Reembolsado",
                215000,
                "COP",
                "MercadoPago",
                "2026-08-09",
                "Reembolso parcial por devolucion de un item.")
        };
    }
}
