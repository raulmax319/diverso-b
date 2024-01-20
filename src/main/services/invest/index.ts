import { Service } from 'domain/service';
import { AssetsService } from '../assets';
import { Asset, Distribution, InvestimentGoal, Suggestion } from 'domain/models';
import createHttpError from 'http-errors';
import { GoalsService } from '../goals';

export class InvestService extends Service {
  private userAssets: Array<Asset>;
  private userGoals: Array<InvestimentGoal>;

  constructor(
    private readonly assetsService: AssetsService = new AssetsService(),
    private readonly goalsService: GoalsService = new GoalsService(),
  ) {
    super();
  }

  private getTotalWealth(assets: Array<Asset>): number {
    return assets.reduce((prev, ass) => prev + ass.position, 0);
  }

  private async calculateTotalInvestimentPerType(
    value: number,
    assets: Array<Asset>,
    goals: Array<InvestimentGoal>,
  ): Promise<Array<Distribution>> {
    const total = this.getTotalWealth(assets);
    const newTotal = total + value;

    this.logger.info('patrimonio atual ', total);
    this.logger.info('novo patrimonio ', newTotal);

    const theoreticalGoal = goals.map((goal) => {
      const total = assets
        .filter((ass) => ass.type === goal.type)
        .reduce((prev, a) => prev + a.position, 0);

      const valueToReachGoal =
        newTotal * (goal.value / 100) - total <= 0 ? 0 : newTotal * (goal.value / 100) - total;

      return {
        type: goal.type,
        value: valueToReachGoal,
        percentage: goal.value,
      };
    });

    const theoreticalTotal = theoreticalGoal.reduce((prev, g) => prev + g.value, 0);

    this.logger.info('valor teorico', theoreticalTotal);

    return theoreticalGoal.map((g) => {
      const percentage = (g.value / theoreticalTotal) * 100;
      const realValue = (value * percentage) / 100;

      return {
        ...g,
        value: realValue,
        percentage,
      };
    });
  }

  private async calculateSuggestedValues(investimentValue: number): Promise<Array<Suggestion>> {
    const investiments = await this.calculateTotalInvestimentPerType(
      investimentValue,
      this.userAssets,
      this.userGoals,
    );

    return this.userAssets.map((ass) => {
      const investimentType = investiments.find((inv) => inv.type === ass.type);

      const scoreSum = this.userAssets
        .filter((ass) => ass.type === investimentType.type)
        ?.reduce((prev, a) => prev + a.score, 0);

      const suggestedPercentage = ass.score / scoreSum;
      const suggestedValue = suggestedPercentage * investimentType.value;
      let suggestedQuantity = suggestedValue / ass.currentPrice;
      const totalAfterInvestiment = suggestedQuantity * ass.currentPrice;
      const percentageAfterInvestiment = totalAfterInvestiment / investimentValue;

      if (ass.type === 'national' || ass.type === 'fii' || ass.ticker.includes('.T')) {
        suggestedQuantity = Math.round(suggestedQuantity);
        this.logger.info('\n', ass.ticker, suggestedQuantity);
      }

      return {
        asset: ass,
        suggestedValue,
        suggestedQuantity,
        totalAfterInvestiment,
        percentageAfterInvestiment,
      };
    });
  }

  public async invest(value: number, userId: string): Promise<Array<Suggestion>> {
    try {
      this.userAssets = await this.assetsService.findAllByUserId(userId);
      this.userGoals = await this.goalsService.findInvestimentGoals(userId);

      return await this.calculateSuggestedValues(value);
    } catch (error) {
      this.logger.error(error);
      createHttpError.BadRequest(error);
    }
  }
}
