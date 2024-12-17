import { Pagination, PaginationParams, SortDir } from '@/interface';

const isNumber = (value: string) => !Number.isNaN(parseFloat(value)) && Number.isFinite(value);

const getNumberIfValid = (value: string) => (isNumber(value) ? parseFloat(value) : null);

const getNumberIfPositive = (value: string) => {
  const n = getNumberIfValid(value);
  return n && n >= 0 ? n : null;
};

const paginate = (params: PaginationParams) => {
  let limit = 10;
  let page = 1;
  if (!params) {
    return { limit, page };
  }
  if (params.page && params.page_size) {
    page = getNumberIfPositive(params.page) || page;
    limit = getNumberIfPositive(params.page_size) || limit;
  }
  return { limit, page };
};

// Sorting for mongoose
const sortBy = (params: PaginationParams) => {
  let sort = 'updatedAt';
  let dir = 'asc';
  if (params.sort) {
    ({ sort } = params);
  }
  if (params.sort_dir) {
    dir = params.sort_dir === 'ASC' ? 'asc' : 'desc';
  }
  return { sort, dir };
};

export const formatPaginationParams = (params: any): Pagination => {
  const { page, limit, sort, dir } = params;
  return {
    page,
    limit,
    sort: sort as string,
    dir: dir as SortDir,
    skip: (page - 1) * limit,
  };
};

export { paginate, sortBy };
