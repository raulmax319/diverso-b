import { $Enums } from '@prisma/client';

export interface InvestimentGoal {
  id?: string;
  type: $Enums.InvestimentType;
  value: number;
  userId?: string;
}

export interface BudgetGoal {
  id?: string;
  type: $Enums.BudgetType;
  value: number;
  userId?: string;
}
