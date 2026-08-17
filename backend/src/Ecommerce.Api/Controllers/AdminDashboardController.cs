using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "admin,manager")]
public class AdminDashboardController : ControllerBase
{
    [HttpGet("kpis")]
    public ActionResult<IReadOnlyList<AdminDashboardKpiDto>> GetKpis()
    {
        return Ok(AdminDashboardStore.GetAll());
    }
}
