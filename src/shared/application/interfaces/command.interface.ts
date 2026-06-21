export interface Command<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}
