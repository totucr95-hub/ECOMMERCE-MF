using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/customers")]
[Authorize(Roles = "admin,manager")]
public class AdminCustomersController : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyList<AdminCustomerDto>> GetCustomers()
    {
        return Ok(AdminCustomerStore.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<AdminCustomerDto> GetCustomerById(string id)
    {
        var customer = AdminCustomerStore.GetById(id);
        return customer is null ? NotFound() : Ok(customer);
    }

    [HttpPost]
    public ActionResult<AdminCustomerDto> CreateCustomer([FromBody] AdminCustomerUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Email))
        {
            return ValidationProblem("El nombre completo y el correo son obligatorios.");
        }

        var created = AdminCustomerStore.Create(request);
        return CreatedAtAction(nameof(GetCustomerById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public ActionResult<AdminCustomerDto> UpdateCustomer(string id, [FromBody] AdminCustomerUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Email))
        {
            return ValidationProblem("El nombre completo y el correo son obligatorios.");
        }

        var updated = AdminCustomerStore.Update(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCustomer(string id)
    {
        return AdminCustomerStore.Delete(id) ? NoContent() : NotFound();
    }
}
