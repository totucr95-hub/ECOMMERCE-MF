using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];
var keycloakAuthority = builder.Configuration["Keycloak:Authority"]
    ?? "http://localhost:8080/realms/ecommerce-mf";
var keycloakAudience = builder.Configuration["Keycloak:Audience"]
    ?? "ecommerce-api";

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    // En desarrollo permitimos localhost; en despliegue se usan las URLs publicadas por ambiente.
    options.AddPolicy("frontend", policy =>
        policy.SetIsOriginAllowed(origin =>
            Uri.TryCreate(origin, UriKind.Absolute, out var uri)
            && ((builder.Environment.IsDevelopment()
                    && (uri.Host == "localhost" || uri.Host == "127.0.0.1"))
                || allowedOrigins.Contains(
                    origin.TrimEnd('/'),
                    StringComparer.OrdinalIgnoreCase)))
            .AllowAnyHeader()
            .AllowAnyMethod());
});
// El API valida JWT emitidos por Keycloak y luego traduce roles del realm a claims de ASP.NET.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = keycloakAuthority;
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            // La SPA emite tokens con azp=shell-web y sin aud en este setup local.
            AudienceValidator = (audiences, securityToken, validationParameters) =>
            {
                if (audiences is not null && audiences.Any())
                {
                    return audiences.Any(audience =>
                        string.Equals(audience, keycloakAudience, StringComparison.OrdinalIgnoreCase)
                        || string.Equals(audience, "shell-web", StringComparison.OrdinalIgnoreCase));
                }

                if (securityToken is JsonWebToken jsonWebToken)
                {
                    var authorizedParty = jsonWebToken.GetPayloadValue<string>("azp");
                    return string.Equals(authorizedParty, "shell-web", StringComparison.OrdinalIgnoreCase);
                }

                return false;
            },
            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role,
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                MapRealmRoles(context.Principal);
                return Task.CompletedTask;
            },
        };
    });
builder.Services.AddAuthorization(options =>
{
    // Solo admins y managers pueden usar el CRUD administrativo de productos.
    options.AddPolicy("AdminProducts", policy =>
        policy.RequireRole("admin", "manager"));
});

var app = builder.Build();

app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

static void MapRealmRoles(ClaimsPrincipal? principal)
{
    if (principal?.Identity is not ClaimsIdentity identity)
    {
        return;
    }

    if (identity.HasClaim(claim => claim.Type == ClaimTypes.Role))
    {
        return;
    }

    var realmAccess = principal.FindFirst("realm_access")?.Value;
    if (string.IsNullOrWhiteSpace(realmAccess))
    {
        return;
    }

    using var document = JsonDocument.Parse(realmAccess);
    if (!document.RootElement.TryGetProperty("roles", out var rolesElement)
        || rolesElement.ValueKind != JsonValueKind.Array)
    {
        return;
    }

    foreach (var roleElement in rolesElement.EnumerateArray())
    {
        if (roleElement.ValueKind == JsonValueKind.String)
        {
            var role = roleElement.GetString();
            if (!string.IsNullOrWhiteSpace(role))
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, role));
            }
        }
    }
}
