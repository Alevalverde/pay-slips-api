export interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  dir?: SortDir;
}
export interface PaginationParams extends PaginationQuery {
  page_size?: string;
  sort_dir?: string;
}

export interface Pagination extends PaginationQuery {
  skip: number;
}

export interface PaginationInfo {
  count: number;
  page: number;
  page_size: number;
}

export type SortDir = 'asc' | 'desc';
