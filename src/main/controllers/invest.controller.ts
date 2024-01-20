import { Controller, Middleware, Post } from 'resdk';
import { Request, Response } from 'express';
import { AuthMiddleware } from 'main/middlewares/auth';
import { InvestService } from 'main/services/invest';
import { ValidationMiddleware } from 'main/middlewares/validation';
import { Invest } from 'domain/models';
import createHttpError from 'http-errors';

@Controller('/invest')
export class InvestController {
  constructor(private readonly investService: InvestService = new InvestService()) {}

  @Post('/')
  @Middleware([
    AuthMiddleware.validateToken,
    AuthMiddleware.validateHeader,
    ValidationMiddleware.validateBodyData,
  ])
  private async invest(req: Request, res: Response) {
    try {
      const data = req.body.data as Invest;

      if (!data.value) {
        res.status(400).json({ data: {}, error: createHttpError.BadRequest('Value not provided') });
        return;
      }

      res.status(200).json({ data: {}, error: null });
    } catch (error) {
      res.status(500).json({ data: {}, error });
    }
  }
}
