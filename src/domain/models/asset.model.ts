import { $Enums } from '@prisma/client';

export interface Asset {
  id?: string;
  type: $Enums.InvestimentType;
  ticker: string;
  quantity: number;
  userId?: string;
  questions?: Array<string>;
  score?: number;
}
