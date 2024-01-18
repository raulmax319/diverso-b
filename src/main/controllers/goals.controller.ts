import { Request, Response } from 'express';
import { Controller, Get, Middleware, Put } from 'resdk';
import { AuthMiddleware } from 'main/middlewares/auth';
import { GoalsService } from 'main/services/goals';
import { BudgetGoal, InvestimentGoal } from 'domain/models';

@Controller('/goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService = new GoalsService()) {}

  @Get('/budget')
  @Middleware([AuthMiddleware.validateHeader, AuthMiddleware.validateToken])
  private async budget(req: Request, res: Response) {
    try {
      const goals = await this.goalsService.findBudgetGoals(req.identifier);
      res.status(200).json({ data: goals });
    } catch (error) {
      res.status(500).json({ data: {}, error });
    }
  }

  @Get('/investiment')
  @Middleware([AuthMiddleware.validateHeader, AuthMiddleware.validateToken])
  private async investiments(req: Request, res: Response) {
    try {
      const goals = await this.goalsService.findInvestimentGoals(req.identifier);
      res.status(200).json({ data: goals });
    } catch (error) {
      res.status(500).json({ data: {}, error });
    }
  }

  @Put('/update/budget')
  @Middleware([AuthMiddleware.validateHeader, AuthMiddleware.validateToken])
  private async updateBudget(req: Request, res: Response) {
    try {
      const data = req.body.data as Array<BudgetGoal>;
      const goals = await this.goalsService.updateBudgetGoals(data, req.identifier);
      res.status(200).json({ data: goals });
    } catch (error) {
      res.status(500).json({ data: {}, error });
    }
  }

  @Put('/update/investiment')
  @Middleware([AuthMiddleware.validateHeader, AuthMiddleware.validateToken])
  private async updateInvestiment(req: Request, res: Response) {
    try {
      const data = req.body.data as Array<InvestimentGoal>;
      const goals = await this.goalsService.updateInvestimentGoals(data, req.identifier);
      res.status(200).json({ data: goals });
    } catch (error) {
      res.status(500).json({ data: {}, error });
    }
  }
}
