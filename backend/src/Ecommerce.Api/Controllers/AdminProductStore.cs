namespace Ecommerce.Api.Controllers;

public sealed record AdminProductDto(
    string Id,
    string Name,
    string Slug,
    string Description,
    string Image,
    decimal Price,
    int Stock,
    string CategoryId,
    bool Featured,
    decimal Rating);

public sealed record AdminProductUpsertRequest(
    string Name,
    string Slug,
    string Description,
    string Image,
    decimal Price,
    int Stock,
    string CategoryId,
    bool Featured,
    decimal Rating);

public static class AdminProductStore
{
    private static readonly object SyncRoot = new();
    private static readonly List<AdminProductDto> Products = CatalogData.Products
        .Select(product => new AdminProductDto(
            product.Id,
            product.Name,
            product.Slug,
            product.Description,
            product.Image,
            product.Price,
            product.Stock,
            product.CategoryId,
            product.Featured,
            product.Rating))
        .ToList();

    public static IReadOnlyList<AdminProductDto> GetAll()
    {
        lock (SyncRoot)
        {
            return Products.ToArray();
        }
    }

    public static AdminProductDto? GetById(string id)
    {
        lock (SyncRoot)
        {
            return Products.FirstOrDefault(product => product.Id == id);
        }
    }

    public static AdminProductDto Create(AdminProductUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var product = BuildProduct(CreateProductId(request), request);
            Products.Insert(0, product);
            return product;
        }
    }

    public static AdminProductDto? Update(string id, AdminProductUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var index = Products.FindIndex(product => product.Id == id);
            if (index < 0)
            {
                return null;
            }

            var product = BuildProduct(id, request);
            Products[index] = product;
            return product;
        }
    }

    public static bool Delete(string id)
    {
        lock (SyncRoot)
        {
            return Products.RemoveAll(product => product.Id == id) > 0;
        }
    }

    private static AdminProductDto BuildProduct(
        string id,
        AdminProductUpsertRequest request)
    {
        return new AdminProductDto(
            id,
            request.Name,
            request.Slug,
            request.Description,
            request.Image,
            request.Price,
            request.Stock,
            request.CategoryId,
            request.Featured,
            request.Rating);
    }

    private static string CreateProductId(AdminProductUpsertRequest request)
    {
        var normalizedSlug = request.Slug
            .ToLowerInvariant()
            .Replace("/", "-")
            .Replace(' ', '-');

        return string.IsNullOrWhiteSpace(normalizedSlug)
            ? $"prd-{Guid.NewGuid():N}"
            : $"prd-{normalizedSlug}";
    }
}