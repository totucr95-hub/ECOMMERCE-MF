using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/carts")]
[Authorize(Roles = "admin,manager")]
public class AdminCartsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyList<AdminCartDto>> GetCarts()
    {
        return Ok(AdminCartStore.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<AdminCartDto> GetCartById(string id)
    {
        var cart = AdminCartStore.GetById(id);
        return cart is null ? NotFound() : Ok(cart);
    }

    [HttpPost]
    public ActionResult<AdminCartDto> CreateCart([FromBody] AdminCartUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CartCode) || string.IsNullOrWhiteSpace(request.Customer))
        {
            return ValidationProblem("El codigo del carrito y el cliente son obligatorios.");
        }

        var created = AdminCartStore.Create(request);
        return CreatedAtAction(nameof(GetCartById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public ActionResult<AdminCartDto> UpdateCart(string id, [FromBody] AdminCartUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CartCode) || string.IsNullOrWhiteSpace(request.Customer))
        {
            return ValidationProblem("El codigo del carrito y el cliente son obligatorios.");
        }

        var updated = AdminCartStore.Update(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCart(string id)
    {
        return AdminCartStore.Delete(id) ? NoContent() : NotFound();
    }
}
