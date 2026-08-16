using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/products")]
[Authorize(Roles = "admin,manager")]
public class AdminProductsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyList<AdminProductDto>> GetProducts()
    {
        return Ok(AdminProductStore.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<AdminProductDto> GetProductById(string id)
    {
        var product = AdminProductStore.GetById(id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public ActionResult<AdminProductDto> CreateProduct(
        [FromBody] AdminProductUpsertRequest request)
    {
        var created = AdminProductStore.Create(request);
        return CreatedAtAction(nameof(GetProductById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public ActionResult<AdminProductDto> UpdateProduct(
        string id,
        [FromBody] AdminProductUpsertRequest request)
    {
        var updated = AdminProductStore.Update(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteProduct(string id)
    {
        return AdminProductStore.Delete(id) ? NoContent() : NotFound();
    }
}