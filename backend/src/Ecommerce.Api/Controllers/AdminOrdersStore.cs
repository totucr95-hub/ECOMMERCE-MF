namespace Ecommerce.Api.Controllers;

public sealed record AdminOrderDto(
    string Id,
    string OrderNumber,
    string Customer,
    decimal Total,
    string Status,
    string PaymentMethod,
    string ShippingAddress,
    string Notes,
    string CreatedAt);

public sealed record AdminOrderUpsertRequest(
    string OrderNumber,
    string Customer,
    decimal Total,
    string Status,
    string PaymentMethod,
    string ShippingAddress,
    string Notes,
    string CreatedAt);

public static class AdminOrderStore
{
    private static readonly object SyncRoot = new();
    private static readonly List<AdminOrderDto> Orders = BuildInitialOrders();

    public static IReadOnlyList<AdminOrderDto> GetAll()
    {
        lock (SyncRoot)
        {
            return Orders.ToArray();
        }
    }

    public static AdminOrderDto? GetById(string id)
    {
        lock (SyncRoot)
        {
            return Orders.FirstOrDefault(order => order.Id == id);
        }
    }

    public static AdminOrderDto Create(AdminOrderUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var created = BuildOrder(CreateOrderId(request), request);
            Orders.Insert(0, created);
            return created;
        }
    }

    public static AdminOrderDto? Update(string id, AdminOrderUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var index = Orders.FindIndex(order => order.Id == id);
            if (index < 0)
            {
                return null;
            }

            var updated = BuildOrder(id, request);
            Orders[index] = updated;
            return updated;
        }
    }

    public static bool Delete(string id)
    {
        lock (SyncRoot)
        {
            return Orders.RemoveAll(order => order.Id == id) > 0;
        }
    }

    private static AdminOrderDto BuildOrder(string id, AdminOrderUpsertRequest request)
    {
        return new AdminOrderDto(
            id,
            request.OrderNumber.Trim(),
            request.Customer.Trim(),
            request.Total,
            request.Status.Trim(),
            request.PaymentMethod.Trim(),
            request.ShippingAddress.Trim(),
            request.Notes.Trim(),
            string.IsNullOrWhiteSpace(request.CreatedAt)
                ? DateOnly.FromDateTime(DateTime.UtcNow).ToString("yyyy-MM-dd")
                : request.CreatedAt.Trim());
    }

    private static string CreateOrderId(AdminOrderUpsertRequest request)
    {
        var normalized = request.OrderNumber
            .Trim()
            .ToLowerInvariant()
            .Replace("/", "-")
            .Replace(' ', '-');

        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "[^a-z0-9-]", string.Empty);
        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "-+", "-").Trim('-');

        return string.IsNullOrWhiteSpace(normalized)
            ? $"ord-{Guid.NewGuid():N}"
            : $"ord-{normalized}";
    }

    private static List<AdminOrderDto> BuildInitialOrders()
    {
        return new List<AdminOrderDto>
        {
            new(
                "ord-1001",
                "ORD-1001",
                "Camilo Rojas",
                325000,
                "Pendiente",
                "Tarjeta",
                "Calle 45 #12-31, Bogota",
                "Entrega prioritaria en la tarde.",
                "2026-08-12"),
            new(
                "ord-1002",
                "ORD-1002",
                "Laura Perez",
                840000,
                "Pagado",
                "PSE",
                "Carrera 18 #96-22, Medellin",
                "Cliente frecuente con compra recurrente.",
                "2026-08-11"),
            new(
                "ord-1003",
                "ORD-1003",
                "Pablo Cruz",
                1290000,
                "Despachado",
                "Transferencia",
                "Av 68 #24-90, Cali",
                "Despacho consolidado con bodega central.",
                "2026-08-10"),
            new(
                "ord-1004",
                "ORD-1004",
                "Ana Torres",
                215000,
                "Entregado",
                "Contraentrega",
                "Calle 80 #32-11, Barranquilla",
                "Entrega confirmada por recepcion.",
                "2026-08-09")
        };
    }
}
