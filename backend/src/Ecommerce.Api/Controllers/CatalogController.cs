using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api")]
[AllowAnonymous]
public class CatalogController : ControllerBase
{
    [HttpGet("health")]
    public ActionResult<HealthDto> Health()
    {
        return Ok(new HealthDto("ok", "Ecommerce.Api", DateTimeOffset.UtcNow));
    }

    [HttpGet("categories")]
    public ActionResult<IReadOnlyList<CategoryDto>> GetCategories()
    {
        return Ok(CatalogData.Categories);
    }

    [HttpGet("products")]
    public ActionResult<IReadOnlyList<ProductDto>> GetProducts(
        [FromQuery] string? q,
        [FromQuery] string? categoryId,
        [FromQuery] bool? featured)
    {
        // Shop y admin leen el mismo store para mantener el catalogo sincronizado.
        IEnumerable<ProductDto> products = AdminProductStore.GetAll()
            .Select(ToPublicProduct);

        if (!string.IsNullOrWhiteSpace(q))
        {
            products = products.Where(product =>
                product.Name.Contains(q, StringComparison.OrdinalIgnoreCase)
                || product.Description.Contains(q, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(categoryId))
        {
            products = products.Where(product => product.CategoryId == categoryId);
        }

        if (featured.HasValue)
        {
            products = products.Where(product => product.Featured == featured.Value);
        }

        return Ok(products.ToArray());
    }

    [HttpGet("products/featured")]
    public ActionResult<IReadOnlyList<ProductDto>> GetFeaturedProducts()
    {
        var products = AdminProductStore.GetAll()
            .Where(product => product.Featured)
            .Select(ToPublicProduct)
            .ToArray();

        return Ok(products);
    }

    [HttpGet("products/{id}")]
    public ActionResult<ProductDto> GetProductById(string id)
    {
        var product = AdminProductStore.GetById(id);

        return product is null ? NotFound() : Ok(ToPublicProduct(product));
    }

    private static ProductDto ToPublicProduct(AdminProductDto product)
    {
        return new ProductDto(
            product.Id,
            product.Name,
            product.Slug,
            product.Description,
            product.Image,
            product.Price,
            null,
            product.Stock,
            product.Featured,
            product.CategoryId,
            product.Rating);
    }
}