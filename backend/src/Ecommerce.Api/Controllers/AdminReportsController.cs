using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

public sealed record AdminReportsFilterRequest(
    string Period,
    string Channel,
    string Status,
    string Country);

public sealed record AdminReportKpiDto(
    string Key,
    string Label,
    string Value,
    string Trend);

public sealed record AdminReportRowDto(
    string Id,
    string Metric,
    string Value,
    string Comparison,
    string Status,
    string Owner);

public sealed record AdminReportResultDto(
    string GeneratedAt,
    string Title,
    string Summary,
    IReadOnlyList<AdminReportKpiDto> Kpis,
    IReadOnlyList<AdminReportRowDto> Rows);

[ApiController]
[Route("api/admin/reports")]
[Authorize(Roles = "admin,manager")]
public class AdminReportsController : ControllerBase
{
    [HttpPost("generate")]
    public ActionResult<AdminReportResultDto> Generate([FromBody] AdminReportsFilterRequest filters)
    {
        var normalized = Normalize(filters);
        var result = BuildReport(normalized);
        return Ok(result);
    }

    private static AdminReportsFilterRequest Normalize(AdminReportsFilterRequest filters)
    {
        return new AdminReportsFilterRequest(
            string.IsNullOrWhiteSpace(filters.Period) ? "Ultimos 30 dias" : filters.Period.Trim(),
            string.IsNullOrWhiteSpace(filters.Channel) ? "Todos" : filters.Channel.Trim(),
            string.IsNullOrWhiteSpace(filters.Status) ? "Todos" : filters.Status.Trim(),
            string.IsNullOrWhiteSpace(filters.Country) ? "Colombia" : filters.Country.Trim());
    }

    private static AdminReportResultDto BuildReport(AdminReportsFilterRequest filters)
    {
        var rows = BuildRows();
        var summary = $"Periodo {filters.Period} - Canal {filters.Channel} - Estado {filters.Status} - Pais {filters.Country}";

        return new AdminReportResultDto(
            DateTime.UtcNow.ToString("O"),
            "Reporte ejecutivo de negocio",
            summary,
            new List<AdminReportKpiDto>
            {
                new("revenue", "Revenue", "$182.4M", "+12.8%"),
                new("orders", "Pedidos", "3,241", "+8.1%"),
                new("aov", "Ticket medio", "$286k", "+4.2%"),
                new("refunds", "Reembolsos", "1.4%", "-0.3 pts")
            },
            rows);
    }

    private static IReadOnlyList<AdminReportRowDto> BuildRows()
    {
        var metrics = new[]
        {
            "Ingresos netos",
            "Conversion checkout",
            "Ticket promedio",
            "Reembolsos",
            "CAC",
            "Retencion 30d",
            "NPS",
            "Margen bruto"
        };
        var statuses = new[] { "Saludable", "Mejorando", "Estable", "Controlado", "Riesgo" };
        var owners = new[] { "Finanzas", "CRO", "Comercial", "Operaciones", "BI" };

        return Enumerable.Range(1, 100)
            .Select(item =>
            {
                var metric = metrics[(item - 1) % metrics.Length];
                var isPercentMetric = metric.Contains("Conversion", StringComparison.OrdinalIgnoreCase)
                    || metric.Contains("Retencion", StringComparison.OrdinalIgnoreCase);
                var value = isPercentMetric
                    ? $"{(2 + ((item * 0.17) % 8)):0.0}%"
                    : $"${(120000 + item * 9300).ToString("N0")}";
                var comparison = $"{(item % 2 == 0 ? "+" : "-")}{(0.3 + ((item * 0.11) % 4)):0.0}% vs periodo anterior";

                return new AdminReportRowDto(
                    $"r-{item}",
                    $"{metric} {Math.Ceiling(item / (double)metrics.Length)}",
                    value,
                    comparison,
                    statuses[(item - 1) % statuses.Length],
                    owners[(item - 1) % owners.Length]);
            })
            .ToArray();
    }
}
