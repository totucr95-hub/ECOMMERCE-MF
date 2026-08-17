namespace Ecommerce.Api.Controllers;

public sealed record AdminBrandDto(
    string Id,
    string Code,
    string Name,
    string CategoryFocus,
    string Country,
    int ActiveProducts,
    string Status,
    string Manager,
    string UpdatedAt,
    string Notes);

public sealed record AdminBrandUpsertRequest(
    string Code,
    string Name,
    string CategoryFocus,
    string Country,
    int ActiveProducts,
    string Status,
    string Manager,
    string UpdatedAt,
    string Notes);

public static class AdminBrandStore
{
    private static readonly object SyncRoot = new();
    private static readonly List<AdminBrandDto> Brands = BuildInitialBrands();

    public static IReadOnlyList<AdminBrandDto> GetAll()
    {
        lock (SyncRoot)
        {
            return Brands.ToArray();
        }
    }

    public static AdminBrandDto? GetById(string id)
    {
        lock (SyncRoot)
        {
            return Brands.FirstOrDefault(brand => brand.Id == id);
        }
    }

    public static AdminBrandDto Create(AdminBrandUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var created = BuildBrand(CreateBrandId(request), request);
            Brands.Insert(0, created);
            return created;
        }
    }

    public static AdminBrandDto? Update(string id, AdminBrandUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var index = Brands.FindIndex(brand => brand.Id == id);
            if (index < 0)
            {
                return null;
            }

            var updated = BuildBrand(id, request);
            Brands[index] = updated;
            return updated;
        }
    }

    public static bool Delete(string id)
    {
        lock (SyncRoot)
        {
            return Brands.RemoveAll(brand => brand.Id == id) > 0;
        }
    }

    private static AdminBrandDto BuildBrand(string id, AdminBrandUpsertRequest request)
    {
        return new AdminBrandDto(
            id,
            request.Code.Trim(),
            request.Name.Trim(),
            request.CategoryFocus.Trim(),
            request.Country.Trim(),
            request.ActiveProducts,
            request.Status.Trim(),
            request.Manager.Trim(),
            string.IsNullOrWhiteSpace(request.UpdatedAt) ? DateOnly.FromDateTime(DateTime.UtcNow).ToString("yyyy-MM-dd") : request.UpdatedAt.Trim(),
            request.Notes.Trim());
    }

    private static string CreateBrandId(AdminBrandUpsertRequest request)
    {
        var normalized = request.Name
            .Trim()
            .ToLowerInvariant()
            .Replace("/", "-")
            .Replace(' ', '-');

        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "[^a-z0-9-]", string.Empty);
        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "-+", "-").Trim('-');

        return string.IsNullOrWhiteSpace(normalized)
            ? $"br-{Guid.NewGuid():N}"
            : $"br-{normalized}";
    }

    private static List<AdminBrandDto> BuildInitialBrands()
    {
        return new List<AdminBrandDto>
        {
            new(
                "br-1001",
                "BRD-001",
                "NovaTech",
                "Decks y pisos",
                "Colombia",
                18,
                "Activa",
                "Laura Perez",
                "2026-08-10",
                "Portafolio premium para proyectos residenciales."),
            new(
                "br-1002",
                "BRD-002",
                "EcoHome",
                "Mobiliario exterior",
                "Colombia",
                24,
                "Activa",
                "David Ruiz",
                "2026-08-05",
                "Linea de mobiliario para zonas comunes."),
            new(
                "br-1003",
                "BRD-003",
                "UrbanPeak",
                "Fachadas y cerramientos",
                "Colombia",
                11,
                "En revision",
                "Ana Torres",
                "2026-08-01",
                "Evaluacion de expansion en proyectos corporativos."),
            new(
                "br-1004",
                "BRD-004",
                "GreenWave",
                "Perfiles estructurales",
                "Colombia",
                9,
                "Pausada",
                "Camilo Rojas",
                "2026-07-27",
                "Pendiente ajuste de inventario para Q4.")
        };
    }
}
