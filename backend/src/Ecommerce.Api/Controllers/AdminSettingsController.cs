using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/settings")]
[Authorize(Roles = "admin,manager")]
public class AdminSettingsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyList<AdminSettingDto>> GetSettings()
    {
        return Ok(AdminSettingsStore.GetAll());
    }
}
