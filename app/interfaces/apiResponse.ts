export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}
