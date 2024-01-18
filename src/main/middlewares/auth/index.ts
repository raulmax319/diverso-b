import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { Crypton } from 'src/infra/crypto';
import { JsonWebToken } from 'src/infra/jwt';

export class AuthMiddleware {
  public static async validateToken(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.headers.authorization) {
        res.status(400).json({ data: createHttpError.Unauthorized('Access token is required.') });
        return;
      }

      const [bearer, token] = req.headers.authorization.split(' ');

      if (!bearer) {
        res.status(400).json({ data: createHttpError.Unauthorized('Token with wrong format.') });
        return;
      }

      if (!token) {
        res.status(400).json({ data: createHttpError.Unauthorized('Invalid token.') });
        return;
      }

      const decoded = await JsonWebToken.shared.verify(token);
      req.identifier = decoded.identifier;
      req.email = decoded.payload.email;
      next();
    } catch (err) {
      res.status(401).json({ data: createHttpError.Unauthorized(err.message) });
    }
  }

  public static async validateHeader(req: Request, res: Response, next: NextFunction) {
    try {
      const xAuthToken = req.headers['x-auth-token'] as string;

      if (!xAuthToken) {
        res.status(401).json({ data: createHttpError.Unauthorized('Required header.') });
        return;
      }

      if (!Crypton.shared.verify(xAuthToken)) {
        res.status(401).json({ data: createHttpError.Unauthorized('Missing data.') });
        return;
      }

      next();
    } catch (err) {
      res.status(401).json({ data: createHttpError.Unauthorized(err.message) });
    }
  }

  public static hashPassword(req: Request, res: Response, next: NextFunction) {
    if (!req.body.data.password) {
      res.status(400).json({ data: { error: { message: 'Missing required password field.' } } });
      return;
    }

    req.body.data.password = bcrypt.hashSync(req.body.data.password, 15);
    next();
  }
}
