import { $Enums } from '@prisma/client';

export interface Question {
  id?: string;
  criteria: string;
  question: string;
  strategy: $Enums.Strategy;
  userId?: string;
}
