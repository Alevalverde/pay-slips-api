import { PaginationInfo } from '.';

export interface ApiResponse<T> {
  status: number;
  message: string | null;
  data?: T | null;
  errors?: ApiError[];
  pagination?: PaginationInfo;
}

export interface ApiError {
  key: string;
  message: string;
}
