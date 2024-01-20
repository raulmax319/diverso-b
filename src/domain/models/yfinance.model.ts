import { Symbol } from './symbol.model';

export interface Crumb {
  cookie: string;
  value: string;
}

export interface QuoteResponse {
  result: Array<Symbol>;
  error: any;
}

export interface YFinance {
  quoteResponse: QuoteResponse;
}
