export interface PaginationParams {
  page?: string;
  page_size?: string;
  sort?: string;
  sort_dir?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  sort: string;
  dir: SortDir;
  skip: number;
}

export type SortDir = 'asc' | 'desc';
