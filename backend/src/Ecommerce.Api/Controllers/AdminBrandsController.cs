using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/brands")]
[Authorize(Roles = "admin,manager")]
public class AdminBrandsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyList<AdminBrandDto>> GetBrands()
    {
        return Ok(AdminBrandStore.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<AdminBrandDto> GetBrandById(string id)
    {
        var brand = AdminBrandStore.GetById(id);
        return brand is null ? NotFound() : Ok(brand);
    }

    [HttpPost]
    public ActionResult<AdminBrandDto> CreateBrand([FromBody] AdminBrandUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code) || string.IsNullOrWhiteSpace(request.Name))
        {
            return ValidationProblem("El codigo y el nombre de la marca son obligatorios.");
        }

        var created = AdminBrandStore.Create(request);
        return CreatedAtAction(nameof(GetBrandById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public ActionResult<AdminBrandDto> UpdateBrand(string id, [FromBody] AdminBrandUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code) || string.IsNullOrWhiteSpace(request.Name))
        {
            return ValidationProblem("El codigo y el nombre de la marca son obligatorios.");
        }

        var updated = AdminBrandStore.Update(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteBrand(string id)
    {
        return AdminBrandStore.Delete(id) ? NoContent() : NotFound();
    }
}
