export enum HttpStatusCode {
  ok = 200,
  unauthorized = 401,
  noContent = 204,
  badRequest = 400,
  serverError = 500,
  notFound = 404,
}

export type HttpResponse<T> = {
  status: HttpStatusCode;
  headers?: Record<string, any>;
  body?: T;
};
