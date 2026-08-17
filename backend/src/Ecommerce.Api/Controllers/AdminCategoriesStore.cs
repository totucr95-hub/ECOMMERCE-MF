namespace Ecommerce.Api.Controllers;

public sealed record AdminCategoryDto(
    string Id,
    string Name,
    string Slug,
    string Description,
    int Products,
    bool Featured);

public sealed record AdminCategoryUpsertRequest(
    string Name,
    string Slug,
    string Description,
    int Products,
    bool Featured);

public static class AdminCategoryStore
{
    private static readonly object SyncRoot = new();
    private static readonly List<AdminCategoryDto> Categories = CatalogData.Categories
        .Select(category => new AdminCategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            CountProducts(category.Id),
            IsFeaturedCategory(category.Id)))
        .ToList();

    public static IReadOnlyList<AdminCategoryDto> GetAll()
    {
        lock (SyncRoot)
        {
            return Categories.ToArray();
        }
    }

    public static AdminCategoryDto? GetById(string id)
    {
        lock (SyncRoot)
        {
            return Categories.FirstOrDefault(category => category.Id == id);
        }
    }

    public static AdminCategoryDto Create(AdminCategoryUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var created = BuildCategory(CreateCategoryId(request), request);
            Categories.Insert(0, created);
            return created;
        }
    }

    public static AdminCategoryDto? Update(string id, AdminCategoryUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var index = Categories.FindIndex(category => category.Id == id);
            if (index < 0)
            {
                return null;
            }

            var updated = BuildCategory(id, request);
            Categories[index] = updated;
            return updated;
        }
    }

    public static bool Delete(string id)
    {
        lock (SyncRoot)
        {
            return Categories.RemoveAll(category => category.Id == id) > 0;
        }
    }

    private static AdminCategoryDto BuildCategory(string id, AdminCategoryUpsertRequest request)
    {
        return new AdminCategoryDto(
            id,
            request.Name.Trim(),
            request.Slug.Trim(),
            request.Description.Trim(),
            request.Products,
            request.Featured);
    }

    private static string CreateCategoryId(AdminCategoryUpsertRequest request)
    {
        var source = string.IsNullOrWhiteSpace(request.Slug) ? request.Name : request.Slug;
        var normalized = source
            .Trim()
            .ToLowerInvariant()
            .Replace("/", "-")
            .Replace(' ', '-');

        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "[^a-z0-9-]", string.Empty);
        normalized = System.Text.RegularExpressions.Regex.Replace(normalized, "-+", "-").Trim('-');

        return string.IsNullOrWhiteSpace(normalized)
            ? $"cat-{Guid.NewGuid():N}"
            : $"cat-{normalized}";
    }

    private static int CountProducts(string categoryId)
    {
        return AdminProductStore.GetAll().Count(product => product.CategoryId == categoryId);
    }

    private static bool IsFeaturedCategory(string categoryId)
    {
        return AdminProductStore.GetAll().Any(product => product.CategoryId == categoryId && product.Featured);
    }
}
