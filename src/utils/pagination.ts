import { Pagination, PaginationParams, PaginationQuery, SortDir } from '@/interface';

const isNumber = (value: string) => !Number.isNaN(parseFloat(value)) && Number.isFinite(value);

const getNumberIfValid = (value: string) => (isNumber(value) ? parseFloat(value) : null);

const getNumberIfPositive = (value: string) => {
  const n = getNumberIfValid(value);
  return n && n >= 0 ? n : null;
};

/**
 * Given pagination parameters, returns an object with the limit and page number.
 * @param params - An object containing optional page and page_size parameters.
 * @returns An object with the limit and page.
 * The limit defaults to 10 and the page defaults to 1 if no parameters are provided.
 * The page and page_size parameters are checked to be positive numbers.
 * If the parameters are not valid numbers, the default values are used.
 */
export const paginate = (params: PaginationParams) => {
  let limit = 10;
  let page = 1;
  if (!params) {
    return { limit, page };
  }
  if (params.page && params.page_size) {
    page = getNumberIfPositive(params.page as string) || page;
    limit = getNumberIfPositive(params.page_size) || limit;
  }
  return { limit, page };
};

/**
 * Determines the sorting field and direction based on the provided pagination parameters.
 * @param params - An object containing optional sorting parameters.
 * @returns An object with the sorting field and direction.
 */
export const sortBy = (params: PaginationParams) => {
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

/**
 * Formats the given parameters into a Pagination object.
 * @param params - An object containing pagination details including page, limit, sort, and dir.
 * @returns A Pagination object with page, limit, sort, dir, and skip properties.
 * The skip property is calculated as (page - 1) * limit.
 */
export const formatPaginationParams = (params: PaginationQuery): Pagination => {
  const { page, limit, sort, dir } = params;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  return {
    page: pageNumber,
    limit: limitNumber,
    sort: sort as string,
    dir: dir as SortDir,
    skip: (pageNumber - 1) * limitNumber,
  };
};
