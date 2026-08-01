export function currency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function trackById<T extends { id: string }>(
  _index: number,
  item: T,
): string {
  return item.id;
}
