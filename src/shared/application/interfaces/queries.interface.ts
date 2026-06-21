export interface Query<TRequest, TResponse> {
  execute(request: TRequest): TResponse;
}
