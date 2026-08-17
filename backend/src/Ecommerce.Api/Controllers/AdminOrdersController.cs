using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = "admin,manager")]
public class AdminOrdersController : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyList<AdminOrderDto>> GetOrders()
    {
        return Ok(AdminOrderStore.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<AdminOrderDto> GetOrderById(string id)
    {
        var order = AdminOrderStore.GetById(id);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpPost]
    public ActionResult<AdminOrderDto> CreateOrder([FromBody] AdminOrderUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.OrderNumber) || string.IsNullOrWhiteSpace(request.Customer))
        {
            return ValidationProblem("El numero de pedido y el cliente son obligatorios.");
        }

        var created = AdminOrderStore.Create(request);
        return CreatedAtAction(nameof(GetOrderById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public ActionResult<AdminOrderDto> UpdateOrder(string id, [FromBody] AdminOrderUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.OrderNumber) || string.IsNullOrWhiteSpace(request.Customer))
        {
            return ValidationProblem("El numero de pedido y el cliente son obligatorios.");
        }

        var updated = AdminOrderStore.Update(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteOrder(string id)
    {
        return AdminOrderStore.Delete(id) ? NoContent() : NotFound();
    }
}
