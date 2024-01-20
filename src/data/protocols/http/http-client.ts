import { HttpResponse } from './http-response';

export type HttpParams<T> = {
  url: string;
  body?: T;
  headers?: Record<string, any>;
};

export interface HttpClient {
  headers: Record<string, any>;
  get<P, R>(params: HttpParams<P>): Promise<HttpResponse<R>>;
}
