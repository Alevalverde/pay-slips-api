import { Pagination, PaginationStages } from 'qsocialnow-common';

export function createPaginationStages(page: number, pageSize: number): PaginationStages {
  return [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }];
}

export function createPaginationObject(page: number, pageSize: number, count: number): Pagination {
  return { page, page_size: pageSize, count };
}
