namespace Ecommerce.Api.Controllers;

public sealed record AdminCustomerDto(
    string Id,
    string FullName,
    string Email,
    string Phone,
    string City,
    int TotalOrders,
    decimal TotalSpent,
    string Status,
    string Segment,
    string Notes,
    string LastOrderAt);

public sealed record AdminCustomerUpsertRequest(
    string FullName,
    string Email,
    string Phone,
    string City,
    int TotalOrders,
    decimal TotalSpent,
    string Status,
    string Segment,
    string Notes,
    string LastOrderAt);

public static class AdminCustomerStore
{
    private static readonly object SyncRoot = new();
    private static readonly List<AdminCustomerDto> Customers = BuildInitialCustomers();

    public static IReadOnlyList<AdminCustomerDto> GetAll()
    {
        lock (SyncRoot)
        {
            return Customers.ToArray();
        }
    }

    public static AdminCustomerDto? GetById(string id)
    {
        lock (SyncRoot)
        {
            return Customers.FirstOrDefault(customer => customer.Id == id);
        }
    }

    public static AdminCustomerDto Create(AdminCustomerUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var created = BuildCustomer(CreateCustomerId(request), request);
            Customers.Insert(0, created);
            return created;
        }
    }

    public static AdminCustomerDto? Update(string id, AdminCustomerUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var index = Customers.FindIndex(customer => customer.Id == id);
            if (index < 0)
            {
                return null;
            }

            var updated = BuildCustomer(id, request);
            Customers[index] = updated;
            return updated;
        }
    }

    public static bool Delete(string id)
    {
        lock (SyncRoot)
        {
            return Customers.RemoveAll(customer => customer.Id == id) > 0;
        }
    }

    private static AdminCustomerDto BuildCustomer(string id, AdminCustomerUpsertRequest request)
    {
        return new AdminCustomerDto(
            id,
            request.FullName.Trim(),
            request.Email.Trim(),
            request.Phone.Trim(),
            request.City.Trim(),
            request.TotalOrders,
            request.TotalSpent,
            request.Status.Trim(),
            request.Segment.Trim(),
            request.Notes.Trim(),
            string.IsNullOrWhiteSpace(request.LastOrderAt)
                ? DateOnly.FromDateTime(DateTime.UtcNow).ToString("yyyy-MM-dd")
                : request.LastOrderAt.Trim());
    }

    private static string CreateCustomerId(AdminCustomerUpsertRequest request)
    {
        var normalized = request.FullName
            .Trim()
            .ToLowerInvariant()
            .Replace("/", "-")
            .Replace(' ', '-');

        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "[^a-z0-9-]", string.Empty);
        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "-+", "-").Trim('-');

        return string.IsNullOrWhiteSpace(normalized)
            ? $"cus-{Guid.NewGuid():N}"
            : $"cus-{normalized}";
    }

    private static List<AdminCustomerDto> BuildInitialCustomers()
    {
        return new List<AdminCustomerDto>
        {
            new(
                "cus-1001",
                "Camilo Rojas",
                "camilo.rojas@correo.com",
                "+57 310 555 0111",
                "Bogota",
                12,
                4580000,
                "Activo",
                "Frecuente",
                "Cliente empresarial con recompra mensual.",
                "2026-08-12"),
            new(
                "cus-1002",
                "Laura Perez",
                "laura.perez@correo.com",
                "+57 315 555 0122",
                "Medellin",
                8,
                2790000,
                "Activo",
                "VIP",
                "Cuenta prioritaria para proyectos B2B.",
                "2026-08-10"),
            new(
                "cus-1003",
                "Pablo Cruz",
                "pablo.cruz@correo.com",
                "+57 320 555 0133",
                "Cali",
                3,
                860000,
                "Inactivo",
                "Nuevo",
                "Sin compras en los ultimos 45 dias.",
                "2026-07-02"),
            new(
                "cus-1004",
                "Ana Torres",
                "ana.torres@correo.com",
                "+57 312 555 0144",
                "Barranquilla",
                6,
                1995000,
                "Activo",
                "Frecuente",
                "Interes en lineas de mobiliario exterior.",
                "2026-08-08")
        };
    }
}
