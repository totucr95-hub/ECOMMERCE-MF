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
var keycloakSpaClientId = builder.Configuration["Keycloak:SpaClientId"]
    ?? "shell-web";

builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    // En desarrollo permitimos localhost; en despliegue se usan las URLs publicadas por ambiente.
    options.AddPolicy("frontend", policy =>
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrWhiteSpace(origin))
            {
                return false;
            }

            if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri))
            {
                return false;
            }

            var normalizedOrigin = origin.TrimEnd('/');
            if (builder.Environment.IsDevelopment() && uri.IsLoopback)
            {
                return true;
            }

            return allowedOrigins.Contains(normalizedOrigin, StringComparer.OrdinalIgnoreCase);
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
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
            // Keycloak puede incluir roles/audiencia en distintos formatos segun el cliente/scopes.
            AudienceValidator = (audiences, securityToken, validationParameters) =>
            {
                if (audiences is not null)
                {
                    var validAudience = audiences.Any(audience =>
                        string.Equals(audience, keycloakAudience, StringComparison.OrdinalIgnoreCase)
                        || string.Equals(audience, keycloakSpaClientId, StringComparison.OrdinalIgnoreCase));

                    if (validAudience)
                    {
                        return true;
                    }
                }

                if (securityToken is JsonWebToken jsonWebToken)
                {
                    var authorizedParty = jsonWebToken.GetPayloadValue<string>("azp");
                    return string.Equals(authorizedParty, keycloakSpaClientId, StringComparison.OrdinalIgnoreCase)
                        || string.Equals(authorizedParty, keycloakAudience, StringComparison.OrdinalIgnoreCase);
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
                MapKeycloakRoles(context.Principal);
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

static void MapKeycloakRoles(ClaimsPrincipal? principal)
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
    if (!string.IsNullOrWhiteSpace(realmAccess))
    {
        AddRoleClaimsFromRealmAccess(identity, realmAccess);
    }

    var resourceAccess = principal.FindFirst("resource_access")?.Value;
    if (!string.IsNullOrWhiteSpace(resourceAccess))
    {
        AddRoleClaimsFromResourceAccess(identity, resourceAccess);
    }
}

static void AddRoleClaimsFromRealmAccess(ClaimsIdentity identity, string realmAccess)
{
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

static void AddRoleClaimsFromResourceAccess(ClaimsIdentity identity, string resourceAccess)
{
    using var document = JsonDocument.Parse(resourceAccess);
    if (document.RootElement.ValueKind != JsonValueKind.Object)
    {
        return;
    }

    foreach (var client in document.RootElement.EnumerateObject())
    {
        if (!client.Value.TryGetProperty("roles", out var rolesElement)
            || rolesElement.ValueKind != JsonValueKind.Array)
        {
            continue;
        }

        foreach (var roleElement in rolesElement.EnumerateArray())
        {
            if (roleElement.ValueKind != JsonValueKind.String)
            {
                continue;
            }

            var role = roleElement.GetString();
            if (string.IsNullOrWhiteSpace(role)
                || identity.HasClaim(ClaimTypes.Role, role))
            {
                continue;
            }

            identity.AddClaim(new Claim(ClaimTypes.Role, role));
        }
    }
}
