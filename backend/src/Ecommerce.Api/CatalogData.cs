namespace Ecommerce.Api.Controllers;

public sealed record CategoryDto(
    string Id,
    string Name,
    string Slug,
    string Description);

public sealed record ProductDto(
    string Id,
    string Name,
    string Slug,
    string Description,
    string Image,
    decimal Price,
    decimal? DiscountPercentage,
    int Stock,
    bool Featured,
    string CategoryId,
    decimal Rating);

public sealed record HealthDto(string Status, string Service, DateTimeOffset Timestamp);

public static class CatalogData
{
    public static readonly IReadOnlyList<CategoryDto> Categories = new[]
    {
        new CategoryDto(
            "cat-1",
            "Decks y pisos",
            "decks-y-pisos",
            "Tablas resistentes para terrazas, senderos y zonas humedas."),
        new CategoryDto(
            "cat-2",
            "Mobiliario exterior",
            "mobiliario-exterior",
            "Muebles durables para parques, jardines y espacios urbanos."),
        new CategoryDto(
            "cat-3",
            "Fachadas y cerramientos",
            "fachadas-y-cerramientos",
            "Soluciones de revestimiento y privacidad para exteriores."),
        new CategoryDto(
            "cat-4",
            "Perfiles estructurales",
            "perfiles-estructurales",
            "Postes y vigas de madera plastica para proyectos constructivos."),
    };

    public static readonly IReadOnlyList<ProductDto> Products = new[]
    {
        new ProductDto(
            "prod-1",
            "Tabla Deck Premium 2,90 m",
            "tabla-deck-premium-290",
            "Tabla texturizada y antideslizante para terrazas de alto trafico.",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
            189900,
            8,
            64,
            true,
            "cat-1",
            4.8m),
        new ProductDto(
            "prod-2",
            "Deck Macizo Antideslizante",
            "deck-macizo-antideslizante",
            "Perfil macizo resistente al agua para piscinas y senderos.",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
            219900,
            null,
            42,
            true,
            "cat-1",
            4.6m),
        new ProductDto(
            "prod-3",
            "Banca Urbana Eco",
            "banca-urbana-eco",
            "Banca de tres puestos para parques, conjuntos y zonas comunes.",
            "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
            899000,
            null,
            12,
            true,
            "cat-2",
            4.7m),
        new ProductDto(
            "prod-4",
            "Mesa Picnic Familiar",
            "mesa-picnic-familiar",
            "Mesa exterior de seis puestos con estructura reforzada.",
            "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=900&q=80",
            1450000,
            null,
            8,
            true,
            "cat-2",
            4.9m),
        new ProductDto(
            "prod-5",
            "Jardinera Modular",
            "jardinera-modular",
            "Jardinera decorativa resistente a humedad, sol y plagas.",
            "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80",
            329000,
            null,
            25,
            false,
            "cat-2",
            4.5m),
        new ProductDto(
            "prod-6",
            "Panel de Cerramiento Exterior",
            "panel-cerramiento-exterior",
            "Panel modular para divisiones, cerramientos y privacidad.",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
            279000,
            10,
            36,
            true,
            "cat-3",
            4.7m),
        new ProductDto(
            "prod-7",
            "Revestimiento de Fachada",
            "revestimiento-fachada",
            "Liston decorativo de bajo mantenimiento para muros exteriores.",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
            174900,
            null,
            58,
            true,
            "cat-3",
            4.8m),
        new ProductDto(
            "prod-8",
            "Poste Estructural 10 x 10",
            "poste-estructural-10x10",
            "Poste solido para cercas, pergolas y estructuras exteriores.",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80",
            119900,
            null,
            80,
            false,
            "cat-4",
            4.5m),
        new ProductDto(
            "prod-9",
            "Perfil Viga Reforzada",
            "perfil-viga-reforzada",
            "Viga de madera plastica para cubiertas y soportes de exterior.",
            "https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=900&q=80",
            154900,
            null,
            47,
            false,
            "cat-4",
            4.6m),
        new ProductDto(
            "prod-10",
            "Silla Exterior Adirondack",
            "silla-exterior-adirondack",
            "Silla ergonomica para terrazas y jardines, libre de mantenimiento.",
            "https://images.unsplash.com/photo-1598300053650-4e6b56d21432?auto=format&fit=crop&w=900&q=80",
            649000,
            null,
            16,
            false,
            "cat-2",
            4.7m),
    };
}