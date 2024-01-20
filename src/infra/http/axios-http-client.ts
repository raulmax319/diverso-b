import axios from 'axios';
import createHttpError from 'http-errors';
import { HttpClient, HttpParams, HttpResponse } from 'src/data/protocols/http';

export class AxiosHttpClient implements HttpClient {
  public headers: Record<string, any>;

  async get<P, R>(params: HttpParams<P>): Promise<HttpResponse<R>> {
    try {
      const response = await axios.get<R>(params.url, {
        headers: {
          ...params.headers,
          ...this.headers,
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-GB,en;q=0.8',
          'Cache-Control': 'max-age=0',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': 'Windows',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-User': '?1',
          'Sec-Gpc': 1,
          'Upgrade-Insecure-Requests': 1,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        withCredentials: true,
      });

      if (!this.headers) {
        const Cookie = response.headers['set-cookie'].join(';');
        this.headers = { Cookie };
      }

      return {
        status: response.status,
        headers: response.headers,
        body: response.data,
      };
    } catch (error) {
      return createHttpError.BadRequest(error);
    }
  }
}
