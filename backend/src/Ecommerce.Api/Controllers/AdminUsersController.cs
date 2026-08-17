using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "admin")]
public class AdminUsersController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public AdminUsersController(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<KeycloakUserSummaryDto>>> GetUsers()
    {
        var users = await GetUsersFromKeycloakAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<ActionResult<KeycloakUserDetailDto>> CreateUser(
        [FromBody] CreateKeycloakUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return ValidationProblem("El email es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return ValidationProblem("La contraseña es obligatoria.");
        }

        var createResult = await CreateUserInKeycloakAsync(request);
        if (string.IsNullOrWhiteSpace(createResult.UserId))
        {
            if (createResult.StatusCode == HttpStatusCode.Conflict)
            {
                return Conflict(createResult.ErrorMessage ?? "Ya existe un usuario con el mismo username o email.");
            }

            if (createResult.StatusCode == HttpStatusCode.BadRequest)
            {
                return BadRequest(createResult.ErrorMessage ?? "Solicitud invalida para crear el usuario.");
            }

            return StatusCode(
                (int)(createResult.StatusCode == 0 ? HttpStatusCode.BadRequest : createResult.StatusCode),
                createResult.ErrorMessage ?? "No se pudo crear el usuario en Keycloak.");
        }

        var created = await GetUserByIdFromKeycloakAsync(createResult.UserId);
        return created is null ? NotFound() : Ok(created);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<KeycloakUserDetailDto>> GetUserById(string id)
    {
        var user = await GetUserByIdFromKeycloakAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<KeycloakUserDetailDto>> UpdateUser(
        string id,
        [FromBody] UpdateKeycloakUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return ValidationProblem("El email es obligatorio.");
        }

        await UpdateUserInKeycloakAsync(id, request);
        var updated = await GetUserByIdFromKeycloakAsync(id);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var deleted = await DeleteUserInKeycloakAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    private async Task<IReadOnlyList<KeycloakUserSummaryDto>> GetUsersFromKeycloakAsync()
    {
        var baseUrl = GetKeycloakServerUrl();
        var realm = GetRealm();
        var users = await SendToKeycloakAsync<List<KeycloakUserRepresentation>>(
            $"{baseUrl}/admin/realms/{realm}/users?briefRepresentation=false&max=1000",
            HttpMethod.Get);

        var mapped = new List<KeycloakUserSummaryDto>();
        foreach (var user in users ?? new List<KeycloakUserRepresentation>())
        {
            var detail = await GetUserByIdFromKeycloakAsync(user.Id);
            if (detail is not null)
            {
                mapped.Add(detail.ToSummary());
            }
        }

        return mapped;
    }

    private async Task<KeycloakUserDetailDto?> GetUserByIdFromKeycloakAsync(string id)
    {
        var realm = GetRealm();
        var user = await SendToKeycloakAsync<KeycloakUserRepresentation>(
            $"{GetKeycloakServerUrl()}/admin/realms/{realm}/users/{id}",
            HttpMethod.Get);

        if (user is null)
        {
            return null;
        }

        var roles = await SendToKeycloakAsync<List<KeycloakRoleRepresentation>>(
            $"{GetKeycloakServerUrl()}/admin/realms/{realm}/users/{id}/role-mappings/realm",
            HttpMethod.Get);

        var mappedRoles = (roles ?? new List<KeycloakRoleRepresentation>())
            .Select(role => role.Name ?? string.Empty)
            .Where(name => !string.IsNullOrWhiteSpace(name) && !KeycloakRoleHelpers.IsDefaultRealmRole(name))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        return new KeycloakUserDetailDto
        {
            Id = user.Id,
            Username = user.Username ?? string.Empty,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName ?? string.Empty,
            LastName = user.LastName ?? string.Empty,
            Enabled = user.Enabled ?? true,
            EmailVerified = user.EmailVerified ?? false,
            Roles = mappedRoles,
            CreatedTimestamp = user.CreatedTimestamp,
            Status = (user.Enabled ?? true) ? "Activo" : "Inactivo",
            Name = string.Join(' ', new[] { user.FirstName, user.LastName }.Where(value => !string.IsNullOrWhiteSpace(value)))
                .Trim() == string.Empty ? user.Username ?? user.Email ?? "Sin nombre" : string.Join(' ', new[] { user.FirstName, user.LastName }.Where(value => !string.IsNullOrWhiteSpace(value))).Trim(),
        };
    }

    private async Task<CreateUserResult> CreateUserInKeycloakAsync(CreateKeycloakUserRequest request)
    {
        var realm = GetRealm();
        var roleNames = (request.Roles ?? new List<string>())
            .Where(role => !string.IsNullOrWhiteSpace(role))
            .Select(role => role.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        var normalizedUsername = string.IsNullOrWhiteSpace(request.Username)
            ? request.Email.Trim()
            : request.Username.Trim();

        var payload = new
        {
            username = normalizedUsername,
            firstName = request.FirstName.Trim(),
            lastName = request.LastName.Trim(),
            email = request.Email.Trim(),
            enabled = request.Enabled,
            emailVerified = request.EmailVerified,
            credentials = new[]
            {
                new
                {
                    type = "password",
                    value = request.Password.Trim(),
                    temporary = false,
                },
            },
        };

        using var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            await GetAdminAccessTokenAsync());

        using var httpRequest = new HttpRequestMessage(
            HttpMethod.Post,
            $"{GetKeycloakServerUrl()}/admin/realms/{realm}/users");

        httpRequest.Content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json");

        using var response = await client.SendAsync(httpRequest);
        if (response.StatusCode == System.Net.HttpStatusCode.Created)
        {
            var location = response.Headers.Location?.ToString();
            if (!string.IsNullOrWhiteSpace(location))
            {
                var userId = location.Split('/').LastOrDefault();
                if (!string.IsNullOrWhiteSpace(userId))
                {
                    if (roleNames.Length > 0)
                    {
                        await AssignRolesToUserAsync(realm, userId, roleNames.ToList());
                    }

                    return new CreateUserResult(userId, null, response.StatusCode);
                }
            }

            return new CreateUserResult(null, "Keycloak no devolvio el identificador del usuario creado.", response.StatusCode);
        }

        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            var error = ExtractKeycloakErrorMessage(responseBody)
                ?? $"Keycloak devolvio {(int)response.StatusCode} ({response.StatusCode}).";

            return new CreateUserResult(null, error, response.StatusCode);
        }

        if (string.IsNullOrWhiteSpace(responseBody))
        {
            return new CreateUserResult(null, "Keycloak no devolvio respuesta con el id del usuario.", response.StatusCode);
        }

        using var payloadDocument = JsonDocument.Parse(responseBody);
        var createdId = payloadDocument.RootElement.TryGetProperty("id", out var idElement)
            ? idElement.GetString()
            : null;

        if (!string.IsNullOrWhiteSpace(createdId) && roleNames.Length > 0)
        {
            await AssignRolesToUserAsync(realm, createdId, roleNames.ToList());
        }

        return new CreateUserResult(createdId, null, response.StatusCode);
    }

    private static string? ExtractKeycloakErrorMessage(string? responseBody)
    {
        if (string.IsNullOrWhiteSpace(responseBody))
        {
            return null;
        }

        try
        {
            using var json = JsonDocument.Parse(responseBody);
            if (json.RootElement.TryGetProperty("errorMessage", out var errorMessage))
            {
                return errorMessage.GetString();
            }

            if (json.RootElement.TryGetProperty("error", out var error))
            {
                return error.GetString();
            }
        }
        catch (JsonException)
        {
            // If Keycloak returns plain text, preserve it as-is.
        }

        return responseBody.Trim();
    }

    private async Task AssignRolesToUserAsync(string realm, string userId, List<string> roles)
    {
        var availableRoles = await SendToKeycloakAsync<List<KeycloakRoleRepresentation>>(
            $"{GetKeycloakServerUrl()}/admin/realms/{realm}/roles",
            HttpMethod.Get);

        var selectedRoles = (availableRoles ?? new List<KeycloakRoleRepresentation>())
            .Where(role => roles.Contains(role.Name ?? string.Empty, StringComparer.OrdinalIgnoreCase))
            .Select(role => new
            {
                id = role.Id,
                name = role.Name,
                scopeParamRequired = false,
            })
            .ToList();

        if (selectedRoles.Count == 0)
        {
            return;
        }

        await SendToKeycloakAsync<object>(
            $"{GetKeycloakServerUrl()}/admin/realms/{realm}/users/{userId}/role-mappings/realm",
            HttpMethod.Post,
            selectedRoles);
    }

    private async Task UpdateUserInKeycloakAsync(string id, UpdateKeycloakUserRequest request)
    {
        var realm = GetRealm();
        var payload = new
        {
            username = request.Username,
            firstName = request.FirstName,
            lastName = request.LastName,
            email = request.Email,
            enabled = request.Enabled,
            emailVerified = request.EmailVerified,
        };

        await SendToKeycloakAsync<object>(
            $"{GetKeycloakServerUrl()}/admin/realms/{realm}/users/{id}",
            HttpMethod.Put,
            payload);

        if (request.Roles is not null && request.Roles.Count > 0)
        {
            var availableRoles = await SendToKeycloakAsync<List<KeycloakRoleRepresentation>>(
                $"{GetKeycloakServerUrl()}/admin/realms/{realm}/roles",
                HttpMethod.Get);

            var selected = (availableRoles ?? new List<KeycloakRoleRepresentation>())
                .Where(role => request.Roles.Contains(role.Name ?? string.Empty, StringComparer.OrdinalIgnoreCase))
                .Select(role => new { id = role.Id, name = role.Name })
                .ToList();

            if (selected.Count > 0)
            {
                var currentRoles = await SendToKeycloakAsync<List<KeycloakRoleRepresentation>>(
                    $"{GetKeycloakServerUrl()}/admin/realms/{realm}/users/{id}/role-mappings/realm",
                    HttpMethod.Get);

                var currentRoleNames = (currentRoles ?? new List<KeycloakRoleRepresentation>())
                    .Select(role => role.Name ?? string.Empty)
                    .Where(name => !string.IsNullOrWhiteSpace(name))
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                var rolesToAdd = selected
                    .Where(role => !string.IsNullOrWhiteSpace(role.name) && !currentRoleNames.Contains(role.name!))
                    .Select(role => new { id = role.id, name = role.name })
                    .ToList();

                foreach (var role in rolesToAdd)
                {
                    var roleUri = $"{GetKeycloakServerUrl()}/admin/realms/{realm}/users/{id}/role-mappings/realm";
                    var roleBody = new[]
                    {
                        new
                        {
                            id = role.id,
                            name = role.name,
                            scopeParamRequired = false,
                        }
                    };

                    await SendToKeycloakAsync<object>(roleUri, HttpMethod.Post, roleBody);
                }
            }
        }
    }

    private async Task<bool> DeleteUserInKeycloakAsync(string id)
    {
        var realm = GetRealm();
        var response = await SendToKeycloakAsync<object>(
            $"{GetKeycloakServerUrl()}/admin/realms/{realm}/users/{id}",
            HttpMethod.Delete,
            null);

        return response is not null || true;
    }

    private async Task<T?> SendToKeycloakAsync<T>(string url, HttpMethod method, object? payload = null)
    {
        using var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            await GetAdminAccessTokenAsync());

        using var request = new HttpRequestMessage(method, url);

        if (payload is not null)
        {
            request.Content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");
        }

        using var response = await client.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return default;
        }

        response.EnsureSuccessStatusCode();

        if (response.Content is null || response.Content.Headers.ContentLength == 0)
        {
            return default;
        }

        var json = await response.Content.ReadAsStringAsync();
        if (string.IsNullOrWhiteSpace(json))
        {
            return default;
        }

        return JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        });
    }

    private async Task<string> GetAdminAccessTokenAsync()
    {
        var serverUrl = GetKeycloakServerUrl();
        var realm = GetRealm();
        var adminClientId = _configuration["Keycloak:AdminClientId"] ?? "ecommerce-api";
        var adminClientSecret = _configuration["Keycloak:AdminClientSecret"] ?? "ecommerce-api-secret-2026";

        using var client = _httpClientFactory.CreateClient();
        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"{serverUrl}/realms/{realm}/protocol/openid-connect/token");

        request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["grant_type"] = "client_credentials",
            ["client_id"] = adminClientId,
            ["client_secret"] = adminClientSecret,
        });

        using var response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        using var payload = JsonDocument.Parse(content);
        var token = payload.RootElement.GetProperty("access_token").GetString();

        if (string.IsNullOrWhiteSpace(token))
        {
            throw new InvalidOperationException("Keycloak no devolvio un access token administrativo.");
        }

        return token;
    }

    private static bool IsDefaultRealmRole(string roleName)
    {
        return roleName.StartsWith("default-roles-", StringComparison.OrdinalIgnoreCase)
            || roleName.Equals("default-roles-ecommerce-mf", StringComparison.OrdinalIgnoreCase);
    }

    private string GetKeycloakServerUrl()
    {
        var authority = _configuration["Keycloak:Authority"] ?? "http://localhost:8080/realms/ecommerce-mf";
        return authority.Replace("/realms/ecommerce-mf", string.Empty, StringComparison.OrdinalIgnoreCase);
    }

    private string GetRealm()
    {
        var authority = _configuration["Keycloak:Authority"] ?? "http://localhost:8080/realms/ecommerce-mf";
        var realmMatch = System.Text.RegularExpressions.Regex.Match(
            authority,
            "/realms/([^/?]+)",
            System.Text.RegularExpressions.RegexOptions.IgnoreCase);

        return realmMatch.Success ? realmMatch.Groups[1].Value : _configuration["Keycloak:Realm"] ?? "ecommerce-mf";
    }
}

public class KeycloakUserSummaryDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "customer";
    public string Status { get; set; } = "Activo";
    public bool Enabled { get; set; } = true;
    public long? CreatedTimestamp { get; set; }

    public KeycloakUserSummaryDto ToSummary() => this;
}

public static class KeycloakRoleHelpers
{
    public static bool IsDefaultRealmRole(string roleName)
    {
        return roleName.StartsWith("default-roles-", StringComparison.OrdinalIgnoreCase)
            || roleName.Equals("default-roles-ecommerce-mf", StringComparison.OrdinalIgnoreCase);
    }
}

public class KeycloakUserDetailDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
    public bool EmailVerified { get; set; }
    public string[] Roles { get; set; } = Array.Empty<string>();
    public long? CreatedTimestamp { get; set; }
    public string Status { get; set; } = "Activo";

    public KeycloakUserSummaryDto ToSummary() => new()
    {
        Id = Id,
        Username = Username,
        Name = Name,
        Email = Email,
        Role = GetDisplayRole(Roles),
        Status = Status,
        Enabled = Enabled,
        CreatedTimestamp = CreatedTimestamp,
    };

    private static string GetDisplayRole(IEnumerable<string> roles)
    {
        var firstRealRole = roles
            .Where(role => !string.IsNullOrWhiteSpace(role) && !KeycloakRoleHelpers.IsDefaultRealmRole(role))
            .FirstOrDefault();

        return string.IsNullOrWhiteSpace(firstRealRole) ? "customer" : firstRealRole;
    }
}

public class CreateKeycloakUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
    public bool EmailVerified { get; set; } = true;
    public List<string>? Roles { get; set; }
}

public class UpdateKeycloakUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
    public bool EmailVerified { get; set; }
    public List<string>? Roles { get; set; }
}

public class KeycloakUserRepresentation
{
    public string Id { get; set; } = string.Empty;
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool? Enabled { get; set; }
    public bool? EmailVerified { get; set; }
    public long? CreatedTimestamp { get; set; }
}

public class KeycloakRoleRepresentation
{
    public string? Id { get; set; }
    public string? Name { get; set; }
}

public readonly record struct CreateUserResult(
    string? UserId,
    string? ErrorMessage,
    HttpStatusCode StatusCode);
