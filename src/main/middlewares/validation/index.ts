import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

export class ValidationMiddleware {
  public static validateBodyData(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body) {
        res.status(400).json({ data: { error: { message: 'Missing request body.' } } });
        return;
      }

      if (!req.body.data) {
        res.status(400).json({ data: { error: { message: 'Missing required field data.' } } });
        return;
      }

      next();
    } catch (err) {
      res.status(500).json({ data: createHttpError.InternalServerError(err.message) });
    }
  }
}
