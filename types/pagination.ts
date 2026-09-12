export interface PaginationMeta {
  total: number;
  offset: number;
  limit: number;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
