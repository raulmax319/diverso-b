import { BudgetGoal, InvestimentGoal } from 'domain/models';
import createHttpError from 'http-errors';
import { DBClient } from 'main/db';

export class GoalsService {
  public async findBudgetGoals(userId: string): Promise<Array<BudgetGoal>> {
    return await DBClient.shared.budgetGoal.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        value: true,
      },
    });
  }

  public async findInvestimentGoals(userId: string): Promise<Array<InvestimentGoal>> {
    return await DBClient.shared.investimentGoal.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        value: true,
      },
    });
  }

  public async updateBudgetGoals(
    goals: Array<BudgetGoal>,
    userId: string,
  ): Promise<Array<BudgetGoal>> {
    const percentage = goals.reduce((prev, a) => prev + a.value, 0);
    const updatedGoals: Array<BudgetGoal> = [];

    if (percentage > 100) {
      throw createHttpError.BadRequest('Total exceeds 100.');
    }

    for (const goal of goals) {
      const result = await DBClient.shared.budgetGoal.update({
        data: goal,
        where: { id: goal.id, userId },
        select: {
          id: true,
          type: true,
          value: true,
        },
      });

      updatedGoals.push(result);
    }

    return updatedGoals;
  }

  public async updateInvestimentGoals(
    goals: Array<InvestimentGoal>,
    userId: string,
  ): Promise<Array<InvestimentGoal>> {
    const percentage = goals.reduce((prev, a) => prev + a.value, 0);
    const updatedGoals: Array<InvestimentGoal> = [];

    if (percentage > 100) {
      throw createHttpError.BadRequest('Total exceeds 100.');
    }

    for (const goal of goals) {
      const result = await DBClient.shared.investimentGoal.update({
        data: goal,
        where: { id: goal.id, userId },
        select: {
          id: true,
          type: true,
          value: true,
        },
      });

      updatedGoals.push(result);
    }

    return updatedGoals;
  }
}
