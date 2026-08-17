using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/categories")]
[Authorize(Roles = "admin,manager")]
public class AdminCategoriesController : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyList<AdminCategoryDto>> GetCategories()
    {
        return Ok(AdminCategoryStore.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<AdminCategoryDto> GetCategoryById(string id)
    {
        var category = AdminCategoryStore.GetById(id);
        return category is null ? NotFound() : Ok(category);
    }

    [HttpPost]
    public ActionResult<AdminCategoryDto> CreateCategory([FromBody] AdminCategoryUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Slug))
        {
            return ValidationProblem("El nombre y el slug de la categoria son obligatorios.");
        }

        var created = AdminCategoryStore.Create(request);
        return CreatedAtAction(nameof(GetCategoryById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public ActionResult<AdminCategoryDto> UpdateCategory(string id, [FromBody] AdminCategoryUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Slug))
        {
            return ValidationProblem("El nombre y el slug de la categoria son obligatorios.");
        }

        var updated = AdminCategoryStore.Update(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCategory(string id)
    {
        return AdminCategoryStore.Delete(id) ? NoContent() : NotFound();
    }
}
