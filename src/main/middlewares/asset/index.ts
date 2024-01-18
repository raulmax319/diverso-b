import { Asset } from 'domain/models';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

export class AssetMiddleware {
  public static async validateBody(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body) {
        res.status(400).json({ data: { error: { message: 'Missing request body.' } } });
        return;
      }

      if (!req.body.data) {
        res.status(400).json({ data: { error: { message: 'Missing required field data.' } } });
        return;
      }

      if (Array.isArray(req.body.data)) {
        const fail = (req.body.data as Array<Asset>).find((asset) => !asset.ticker);
        if (fail) {
          res
            .status(400)
            .json({ data: { error: { message: 'Missing required ticker field in list.' } } });
          return;
        }
        next();
        return;
      }

      const asset = req.body.data as Asset;

      if (!asset.ticker) {
        res.status(400).json({ data: { error: { message: 'Missing required ticker field.' } } });
        return;
      }

      next();
    } catch (err) {
      res.status(400).json({ data: createHttpError.BadRequest(err.message) });
    }
  }
}
