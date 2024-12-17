import { ApiResponse, ApiError, PaginationInfo } from '@/interface';

export function prepareResponse<T>(
  status: number,
  message: string | null,
  data?: T | null,
  pagination?: PaginationInfo,
  errors?: ApiError[]
): ApiResponse<T> {
  return {
    status,
    message,
    data,
    pagination,
    errors,
  };
}
