
export interface QueryOptions {
  sortBy?: string;
  limit?: number;
  page?: number;
}

export interface QueryResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}