export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
}

export interface UninterceptedApiError {
  message: string | Record<string, string[]>;
}

export interface PaginatedApiResponse<T> {
  code: number;
  message: string;
  data: T;
  meta: {
    page: number;
    per_page: number;
    max_page: number;
    count: number | null;
  };
}
