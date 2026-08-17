namespace Ecommerce.Api.Controllers;

public sealed record AdminCartDto(
    string Id,
    string CartCode,
    string Customer,
    int ItemsCount,
    decimal Subtotal,
    decimal Taxes,
    decimal Total,
    string Status,
    string UpdatedAt,
    string Notes);

public sealed record AdminCartUpsertRequest(
    string CartCode,
    string Customer,
    int ItemsCount,
    decimal Subtotal,
    decimal Taxes,
    decimal Total,
    string Status,
    string UpdatedAt,
    string Notes);

public static class AdminCartStore
{
    private static readonly object SyncRoot = new();
    private static readonly List<AdminCartDto> Carts = BuildInitialCarts();

    public static IReadOnlyList<AdminCartDto> GetAll()
    {
        lock (SyncRoot)
        {
            return Carts.ToArray();
        }
    }

    public static AdminCartDto? GetById(string id)
    {
        lock (SyncRoot)
        {
            return Carts.FirstOrDefault(cart => cart.Id == id);
        }
    }

    public static AdminCartDto Create(AdminCartUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var created = BuildCart(CreateCartId(request), request);
            Carts.Insert(0, created);
            return created;
        }
    }

    public static AdminCartDto? Update(string id, AdminCartUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var index = Carts.FindIndex(cart => cart.Id == id);
            if (index < 0)
            {
                return null;
            }

            var updated = BuildCart(id, request);
            Carts[index] = updated;
            return updated;
        }
    }

    public static bool Delete(string id)
    {
        lock (SyncRoot)
        {
            return Carts.RemoveAll(cart => cart.Id == id) > 0;
        }
    }

    private static AdminCartDto BuildCart(string id, AdminCartUpsertRequest request)
    {
        return new AdminCartDto(
            id,
            request.CartCode.Trim(),
            request.Customer.Trim(),
            request.ItemsCount,
            request.Subtotal,
            request.Taxes,
            request.Total,
            request.Status.Trim(),
            string.IsNullOrWhiteSpace(request.UpdatedAt)
                ? DateOnly.FromDateTime(DateTime.UtcNow).ToString("yyyy-MM-dd")
                : request.UpdatedAt.Trim(),
            request.Notes.Trim());
    }

    private static string CreateCartId(AdminCartUpsertRequest request)
    {
        var normalized = request.CartCode
            .Trim()
            .ToLowerInvariant()
            .Replace("/", "-")
            .Replace(' ', '-');

        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "[^a-z0-9-]", string.Empty);
        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "-+", "-").Trim('-');

        return string.IsNullOrWhiteSpace(normalized)
            ? $"cart-{Guid.NewGuid():N}"
            : $"cart-{normalized}";
    }

    private static List<AdminCartDto> BuildInitialCarts()
    {
        return new List<AdminCartDto>
        {
            new(
                "cart-3001",
                "CRT-1001",
                "Camilo Rojas",
                3,
                285000,
                54150,
                339150,
                "Activo",
                "2026-08-12",
                "Carrito activo con cupo aplicado."),
            new(
                "cart-3002",
                "CRT-1002",
                "Laura Perez",
                5,
                720000,
                136800,
                856800,
                "Convertido",
                "2026-08-11",
                "Convertido a pedido ORD-1002."),
            new(
                "cart-3003",
                "CRT-1003",
                "Pablo Cruz",
                2,
                146000,
                27740,
                173740,
                "Abandonado",
                "2026-08-03",
                "Sin actividad desde hace 9 dias."),
            new(
                "cart-3004",
                "CRT-1004",
                "Ana Torres",
                1,
                95000,
                18050,
                113050,
                "Expirado",
                "2026-07-30",
                "Sesion expirada por tiempo de inactividad.")
        };
    }
}
