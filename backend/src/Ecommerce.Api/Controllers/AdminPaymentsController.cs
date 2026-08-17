using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/payments")]
[Authorize(Roles = "admin,manager")]
public class AdminPaymentsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyList<AdminPaymentDto>> GetPayments()
    {
        return Ok(AdminPaymentStore.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<AdminPaymentDto> GetPaymentById(string id)
    {
        var payment = AdminPaymentStore.GetById(id);
        return payment is null ? NotFound() : Ok(payment);
    }

    [HttpPost]
    public ActionResult<AdminPaymentDto> CreatePayment([FromBody] AdminPaymentUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PaymentRef) || string.IsNullOrWhiteSpace(request.OrderNumber))
        {
            return ValidationProblem("La referencia y el numero de pedido son obligatorios.");
        }

        var created = AdminPaymentStore.Create(request);
        return CreatedAtAction(nameof(GetPaymentById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public ActionResult<AdminPaymentDto> UpdatePayment(string id, [FromBody] AdminPaymentUpsertRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PaymentRef) || string.IsNullOrWhiteSpace(request.OrderNumber))
        {
            return ValidationProblem("La referencia y el numero de pedido son obligatorios.");
        }

        var updated = AdminPaymentStore.Update(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult DeletePayment(string id)
    {
        return AdminPaymentStore.Delete(id) ? NoContent() : NotFound();
    }
}
