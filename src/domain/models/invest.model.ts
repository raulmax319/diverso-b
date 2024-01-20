import { InvestimentType } from '@prisma/client';
import { Asset } from './asset.model';

export interface Invest {
  value: number;
}

export interface Distribution {
  type: InvestimentType;
  value: number;
  percentage: number;
}

export interface Suggestion {
  asset: Asset;
  suggestedValue: number;
  suggestedQuantity: number;
  suggestedPercentage?: number;
  percentageAfterInvestiment: number;
  totalAfterInvestiment: number;
}
