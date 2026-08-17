using System.Globalization;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactLeadsController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ContactLeadsController> _logger;

    public ContactLeadsController(
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        IWebHostEnvironment environment,
        ILogger<ContactLeadsController> logger)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _environment = environment;
        _logger = logger;
    }

    [HttpPost("lead")]
    [AllowAnonymous]
    public async Task<ActionResult<ContactLeadSubmitResponse>> SubmitLead([FromBody] ContactLeadSubmitRequest request)
    {
        if (!IsValidLeadRequest(request, out var validationError))
        {
            return BadRequest(new ContactLeadSubmitResponse(false, validationError));
        }

        // Honeypot to reduce bot submissions.
        if (!string.IsNullOrWhiteSpace(request.Website))
        {
            return BadRequest(new ContactLeadSubmitResponse(false, "Solicitud rechazada por validacion anti-spam."));
        }

        var captchaVerification = await RecaptchaVerifier.VerifyAsync(
            request.CaptchaToken,
            _configuration,
            _httpClientFactory,
            _environment);
        if (!captchaVerification.Success)
        {
            return BadRequest(new ContactLeadSubmitResponse(false, captchaVerification.Message));
        }

        var created = ContactLeadStore.Create(request);
        await LeadEmailNotifier.TryNotifyLeadCreatedAsync(created, _configuration, _logger);
        return Ok(new ContactLeadSubmitResponse(
            true,
            "Mensaje enviado con exito. Te contactaremos pronto.",
            created.Id));
    }

    [HttpGet("leads")]
    [Authorize(Roles = "admin,manager")]
    public ActionResult<IReadOnlyList<ContactLeadDto>> GetLeads(
        [FromQuery] string? status,
        [FromQuery] string? from,
        [FromQuery] string? to)
    {
        var leads = ContactLeadStore.GetAll(status, ParseDateOnly(from), ParseDateOnly(to));
        return Ok(leads);
    }

    [HttpGet("leads/export/csv")]
    [Authorize(Roles = "admin,manager")]
    public ActionResult ExportLeadsCsv(
        [FromQuery] string? status,
        [FromQuery] string? from,
        [FromQuery] string? to)
    {
        var leads = ContactLeadStore.GetAll(status, ParseDateOnly(from), ParseDateOnly(to));
        var csv = ContactLeadCsvExporter.Export(leads);
        var fileName = $"contact-leads-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv";
        return File(Encoding.UTF8.GetBytes(csv), "text/csv; charset=utf-8", fileName);
    }

    [HttpGet("leads/{id}")]
    [Authorize(Roles = "admin,manager")]
    public ActionResult<ContactLeadDto> GetLeadById(string id)
    {
        var lead = ContactLeadStore.GetById(id);
        return lead is null ? NotFound() : Ok(lead);
    }

    [HttpPost("leads")]
    [Authorize(Roles = "admin,manager")]
    public async Task<ActionResult<ContactLeadDto>> CreateLead([FromBody] ContactLeadUpsertRequest request)
    {
        if (!IsValidLeadUpsertRequest(request, out var validationError))
        {
            return ValidationProblem(validationError);
        }

        var created = ContactLeadStore.CreateFromAdmin(request);
        await LeadEmailNotifier.TryNotifyLeadCreatedAsync(created, _configuration, _logger);
        return CreatedAtAction(nameof(GetLeadById), new { id = created.Id }, created);
    }

    [HttpPut("leads/{id}")]
    [Authorize(Roles = "admin,manager")]
    public ActionResult<ContactLeadDto> UpdateLead(string id, [FromBody] ContactLeadUpsertRequest request)
    {
        if (!IsValidLeadUpsertRequest(request, out var validationError))
        {
            return ValidationProblem(validationError);
        }

        var updated = ContactLeadStore.Update(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("leads/{id}")]
    [Authorize(Roles = "admin,manager")]
    public IActionResult DeleteLead(string id)
    {
        return ContactLeadStore.Delete(id) ? NoContent() : NotFound();
    }

    [HttpPatch("leads/{id}/status")]
    [Authorize(Roles = "admin,manager")]
    public ActionResult<ContactLeadDto> UpdateLeadStatus(string id, [FromBody] UpdateContactLeadStatusRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Status))
        {
            return ValidationProblem("El estado del lead es obligatorio.");
        }

        var normalizedStatus = request.Status.Trim().ToLowerInvariant();
        if (!ContactLeadStatus.Allowed.Contains(normalizedStatus))
        {
            return ValidationProblem("Estado invalido. Usa: nuevo, contactado o cerrado.");
        }

        var updated = ContactLeadStore.UpdateStatus(id, normalizedStatus);
        return updated is null ? NotFound() : Ok(updated);
    }

    private static bool IsValidLeadRequest(ContactLeadSubmitRequest request, out string error)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            error = "El nombre completo es obligatorio.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            error = "El email es obligatorio.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(request.Phone))
        {
            error = "El telefono es obligatorio.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(request.Message) || request.Message.Trim().Length < 20)
        {
            error = "El mensaje debe tener al menos 20 caracteres.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(request.CaptchaToken))
        {
            error = "Debes validar el captcha antes de enviar.";
            return false;
        }

        error = string.Empty;
        return true;
    }

    private static bool IsValidLeadUpsertRequest(ContactLeadUpsertRequest request, out string error)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            error = "El nombre completo es obligatorio.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            error = "El email es obligatorio.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(request.Phone))
        {
            error = "El telefono es obligatorio.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(request.Message) || request.Message.Trim().Length < 20)
        {
            error = "El mensaje debe tener al menos 20 caracteres.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(request.Status))
        {
            error = "El estado del lead es obligatorio.";
            return false;
        }

        var normalizedStatus = request.Status.Trim().ToLowerInvariant();
        if (!ContactLeadStatus.Allowed.Contains(normalizedStatus))
        {
            error = "Estado invalido. Usa: nuevo, contactado o cerrado.";
            return false;
        }

        error = string.Empty;
        return true;
    }

    private static DateOnly? ParseDateOnly(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return DateOnly.TryParseExact(value.Trim(), "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed)
            ? parsed
            : null;
    }
}

[ApiController]
[Route("api/integrations/recaptcha")]
public class RecaptchaIntegrationController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IWebHostEnvironment _environment;

    public RecaptchaIntegrationController(
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        IWebHostEnvironment environment)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _environment = environment;
    }

    [HttpPost("verify")]
    [AllowAnonymous]
    public async Task<ActionResult<RecaptchaVerifyResponse>> Verify([FromBody] RecaptchaVerifyRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
        {
            return BadRequest(new RecaptchaVerifyResponse(false, "Token de captcha requerido."));
        }

        var result = await RecaptchaVerifier.VerifyAsync(
            request.Token,
            _configuration,
            _httpClientFactory,
            _environment);

        return Ok(new RecaptchaVerifyResponse(result.Success, result.Message));
    }
}

public static class RecaptchaVerifier
{
    public static async Task<RecaptchaVerificationResult> VerifyAsync(
        string token,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        IWebHostEnvironment environment)
    {
        var skipInDevelopment = configuration.GetValue<bool?>("Recaptcha:SkipValidationInDevelopment") ?? true;
        if (environment.IsDevelopment() && skipInDevelopment)
        {
            return new RecaptchaVerificationResult(true, "Captcha validado en modo desarrollo.");
        }

        var secret = configuration["Recaptcha:SecretKey"];
        if (string.IsNullOrWhiteSpace(secret))
        {
            return new RecaptchaVerificationResult(false, "No hay configuracion de captcha en el servidor.");
        }

        var verifyUrl = configuration["Recaptcha:VerifyUrl"]
            ?? "https://www.google.com/recaptcha/api/siteverify";

        using var client = httpClientFactory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Post, verifyUrl)
        {
            Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["secret"] = secret,
                ["response"] = token,
            })
        };
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        using var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            return new RecaptchaVerificationResult(false, "No se pudo validar el captcha.");
        }

        var payload = await response.Content.ReadAsStringAsync();
        if (string.IsNullOrWhiteSpace(payload))
        {
            return new RecaptchaVerificationResult(false, "Respuesta invalida del captcha.");
        }

        using var document = JsonDocument.Parse(payload);
        var success = document.RootElement.TryGetProperty("success", out var successNode)
            && successNode.ValueKind == JsonValueKind.True;

        return success
            ? new RecaptchaVerificationResult(true, "Captcha validado correctamente.")
            : new RecaptchaVerificationResult(false, "No se pudo validar el captcha. Intenta nuevamente.");
    }
}

public static class ContactLeadStatus
{
    public static readonly HashSet<string> Allowed = new(StringComparer.OrdinalIgnoreCase)
    {
        "nuevo",
        "contactado",
        "cerrado",
    };
}

public static class ContactLeadStore
{
    private static readonly object SyncRoot = new();
    private static readonly List<ContactLeadDto> Leads = new();

    public static ContactLeadDto Create(ContactLeadSubmitRequest request)
    {
        lock (SyncRoot)
        {
            var now = DateTimeOffset.UtcNow;
            var lead = new ContactLeadDto(
                Id: $"lead-{Guid.NewGuid():N}",
                FullName: request.FullName.Trim(),
                Email: request.Email.Trim(),
                Phone: request.Phone.Trim(),
                Message: request.Message.Trim(),
                Status: "nuevo",
                Source: "landing",
                CreatedAt: now,
                UpdatedAt: now);

            Leads.Insert(0, lead);
            return lead;
        }
    }

    public static ContactLeadDto CreateFromAdmin(ContactLeadUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var now = DateTimeOffset.UtcNow;
            var lead = new ContactLeadDto(
                Id: $"lead-{Guid.NewGuid():N}",
                FullName: request.FullName.Trim(),
                Email: request.Email.Trim(),
                Phone: request.Phone.Trim(),
                Message: request.Message.Trim(),
                Status: request.Status.Trim().ToLowerInvariant(),
                Source: string.IsNullOrWhiteSpace(request.Source) ? "admin" : request.Source.Trim().ToLowerInvariant(),
                CreatedAt: now,
                UpdatedAt: now);

            Leads.Insert(0, lead);
            return lead;
        }
    }

    public static ContactLeadDto? GetById(string id)
    {
        lock (SyncRoot)
        {
            return Leads.FirstOrDefault(lead => string.Equals(lead.Id, id, StringComparison.Ordinal));
        }
    }

    public static IReadOnlyList<ContactLeadDto> GetAll(string? status, DateOnly? from, DateOnly? to)
    {
        lock (SyncRoot)
        {
            IEnumerable<ContactLeadDto> query = Leads;

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(lead => string.Equals(lead.Status, status.Trim(), StringComparison.OrdinalIgnoreCase));
            }

            if (from.HasValue)
            {
                query = query.Where(lead => DateOnly.FromDateTime(lead.CreatedAt.UtcDateTime) >= from.Value);
            }

            if (to.HasValue)
            {
                query = query.Where(lead => DateOnly.FromDateTime(lead.CreatedAt.UtcDateTime) <= to.Value);
            }

            return query.ToArray();
        }
    }

    public static ContactLeadDto? UpdateStatus(string id, string status)
    {
        lock (SyncRoot)
        {
            var index = Leads.FindIndex(lead => string.Equals(lead.Id, id, StringComparison.Ordinal));
            if (index < 0)
            {
                return null;
            }

            var current = Leads[index];
            var updated = current with
            {
                Status = status,
                UpdatedAt = DateTimeOffset.UtcNow,
            };

            Leads[index] = updated;
            return updated;
        }
    }

    public static ContactLeadDto? Update(string id, ContactLeadUpsertRequest request)
    {
        lock (SyncRoot)
        {
            var index = Leads.FindIndex(lead => string.Equals(lead.Id, id, StringComparison.Ordinal));
            if (index < 0)
            {
                return null;
            }

            var current = Leads[index];
            var updated = current with
            {
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim(),
                Phone = request.Phone.Trim(),
                Message = request.Message.Trim(),
                Status = request.Status.Trim().ToLowerInvariant(),
                Source = string.IsNullOrWhiteSpace(request.Source)
                    ? current.Source
                    : request.Source.Trim().ToLowerInvariant(),
                UpdatedAt = DateTimeOffset.UtcNow,
            };

            Leads[index] = updated;
            return updated;
        }
    }

    public static bool Delete(string id)
    {
        lock (SyncRoot)
        {
            return Leads.RemoveAll(lead => string.Equals(lead.Id, id, StringComparison.Ordinal)) > 0;
        }
    }
}

public static class ContactLeadCsvExporter
{
    public static string Export(IEnumerable<ContactLeadDto> leads)
    {
        var builder = new StringBuilder();
        builder.AppendLine("id,fullName,email,phone,status,source,createdAt,updatedAt,message");

        foreach (var lead in leads)
        {
            builder.AppendLine(string.Join(",", new[]
            {
                Escape(lead.Id),
                Escape(lead.FullName),
                Escape(lead.Email),
                Escape(lead.Phone),
                Escape(lead.Status),
                Escape(lead.Source),
                Escape(lead.CreatedAt.UtcDateTime.ToString("O", CultureInfo.InvariantCulture)),
                Escape(lead.UpdatedAt.UtcDateTime.ToString("O", CultureInfo.InvariantCulture)),
                Escape(lead.Message),
            }));
        }

        return builder.ToString();
    }

    private static string Escape(string value)
    {
        var safe = value.Replace("\"", "\"\"");
        return $"\"{safe}\"";
    }
}

public static class LeadEmailNotifier
{
    public static async Task TryNotifyLeadCreatedAsync(
        ContactLeadDto lead,
        IConfiguration configuration,
        ILogger logger)
    {
        var options = LeadNotificationOptions.FromConfiguration(configuration);
        if (!options.Enabled)
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(options.SmtpHost)
            || options.SmtpPort <= 0
            || string.IsNullOrWhiteSpace(options.ToEmail)
            || string.IsNullOrWhiteSpace(options.FromEmail))
        {
            logger.LogWarning("LeadNotifications esta habilitado pero incompleto. Revisa configuracion SMTP.");
            return;
        }

        try
        {
            using var message = new MailMessage(options.FromEmail, options.ToEmail)
            {
                Subject = $"[Lead] Nuevo contacto de {lead.FullName}",
                Body = BuildBody(lead),
                IsBodyHtml = false,
            };

            using var client = new SmtpClient(options.SmtpHost, options.SmtpPort)
            {
                EnableSsl = options.EnableSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network,
            };

            if (!string.IsNullOrWhiteSpace(options.SmtpUser))
            {
                client.Credentials = new NetworkCredential(options.SmtpUser, options.SmtpPassword);
            }
            else
            {
                client.UseDefaultCredentials = true;
            }

            await client.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "No se pudo enviar correo de notificacion para lead {LeadId}.", lead.Id);
        }
    }

    private static string BuildBody(ContactLeadDto lead)
    {
        return string.Join(Environment.NewLine, new[]
        {
            "Se recibio un nuevo lead de contacto.",
            string.Empty,
            $"Id: {lead.Id}",
            $"Nombre: {lead.FullName}",
            $"Email: {lead.Email}",
            $"Telefono: {lead.Phone}",
            $"Estado: {lead.Status}",
            $"Origen: {lead.Source}",
            $"Fecha: {lead.CreatedAt:O}",
            string.Empty,
            "Mensaje:",
            lead.Message,
        });
    }
}

public sealed record LeadNotificationOptions(
    bool Enabled,
    string SmtpHost,
    int SmtpPort,
    bool EnableSsl,
    string SmtpUser,
    string SmtpPassword,
    string FromEmail,
    string ToEmail)
{
    public static LeadNotificationOptions FromConfiguration(IConfiguration configuration)
    {
        return new LeadNotificationOptions(
            Enabled: configuration.GetValue<bool?>("LeadNotifications:Enabled") ?? false,
            SmtpHost: configuration["LeadNotifications:Smtp:Host"] ?? string.Empty,
            SmtpPort: configuration.GetValue<int?>("LeadNotifications:Smtp:Port") ?? 0,
            EnableSsl: configuration.GetValue<bool?>("LeadNotifications:Smtp:EnableSsl") ?? true,
            SmtpUser: configuration["LeadNotifications:Smtp:User"] ?? string.Empty,
            SmtpPassword: configuration["LeadNotifications:Smtp:Password"] ?? string.Empty,
            FromEmail: configuration["LeadNotifications:FromEmail"] ?? string.Empty,
            ToEmail: configuration["LeadNotifications:ToEmail"] ?? string.Empty);
    }
}

public sealed record ContactLeadSubmitRequest(
    string FullName,
    string Email,
    string Phone,
    string Message,
    string CaptchaToken,
    string Website);

public sealed record ContactLeadSubmitResponse(
    bool Ok,
    string Message,
    string? LeadId = null);

public sealed record UpdateContactLeadStatusRequest(
    string Status);

public sealed record ContactLeadUpsertRequest(
    string FullName,
    string Email,
    string Phone,
    string Message,
    string Status,
    string Source);

public sealed record ContactLeadDto(
    string Id,
    string FullName,
    string Email,
    string Phone,
    string Message,
    string Status,
    string Source,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);

public sealed record RecaptchaVerifyRequest(
    string Token);

public sealed record RecaptchaVerifyResponse(
    bool Success,
    string Message);

public sealed record RecaptchaVerificationResult(
    bool Success,
    string Message);
