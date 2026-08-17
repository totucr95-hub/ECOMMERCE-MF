namespace Ecommerce.Api.Controllers;

public sealed record AdminSettingDto(
    string Group,
    string Setting,
    string Value,
    string Updated);

public static class AdminSettingsStore
{
    private static readonly IReadOnlyList<AdminSettingDto> Settings = BuildInitialSettings();

    public static IReadOnlyList<AdminSettingDto> GetAll() => Settings;

    private static IReadOnlyList<AdminSettingDto> BuildInitialSettings()
    {
        var groups = new[]
        {
            "Seguridad",
            "Pedidos",
            "Inventario",
            "Notificaciones",
            "Pagos",
            "Integraciones"
        };
        var settings = new[]
        {
            "2FA obligatorio",
            "Autoconfirmacion",
            "Alerta de stock",
            "Reporte diario",
            "Webhook de pagos",
            "Ventana de mantenimiento"
        };
        var values = new[]
        {
            "Habilitado",
            "Manual",
            "Menor a 10",
            "08:00 AM",
            "Activo",
            "Domingos 02:00"
        };

        return Enumerable.Range(1, 100)
            .Select(item => new AdminSettingDto(
                groups[(item - 1) % groups.Length],
                $"{settings[(item - 1) % settings.Length]} #{item}",
                values[(item - 1) % values.Length],
                DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-(item % 40))).ToString("yyyy-MM-dd")))
            .ToArray();
    }
}
