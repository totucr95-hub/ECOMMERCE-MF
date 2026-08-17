namespace Ecommerce.Api.Controllers;

public sealed record AdminDashboardKpiDto(
    string Module,
    string Kpi,
    string Value,
    string Status);

public static class AdminDashboardStore
{
    private static readonly IReadOnlyList<AdminDashboardKpiDto> Kpis = BuildInitialKpis();

    public static IReadOnlyList<AdminDashboardKpiDto> GetAll() => Kpis;

    private static IReadOnlyList<AdminDashboardKpiDto> BuildInitialKpis()
    {
        var modules = new[]
        {
            "Ventas",
            "Pedidos",
            "Usuarios",
            "Catalogo",
            "Pagos",
            "Logistica"
        };
        var kpis = new[]
        {
            "Ingresos diarios",
            "Pendientes",
            "Activos",
            "Productos sin stock",
            "Aprobacion pagos",
            "Despachos en SLA"
        };
        var statuses = new[] { "OK", "OK", "Atencion", "Revisar" };

        return Enumerable.Range(1, 100)
            .Select(item => new AdminDashboardKpiDto(
                modules[(item - 1) % modules.Length],
                kpis[(item - 1) % kpis.Length],
                item % 2 == 0
                    ? $"${(8000 + item * 320).ToString("N0")}"
                    : (5 + (item % 97)).ToString(),
                statuses[(item - 1) % statuses.Length]))
            .ToArray();
    }
}
