export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export function wrapResponse<T>(data: T): ApiResponse<T> {
  return { data };
}
