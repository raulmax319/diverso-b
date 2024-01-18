import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

export class JsonWebToken {
  static shared = new JsonWebToken();
  private constructor() {}

  public sign(payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          payload: {
            email: payload.email,
          },
          identifier: payload.id,
        },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) return reject(createHttpError.InternalServerError());
          resolve(token);
        },
      );
    });
  }

  public verify(token: string): Promise<jwt.JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, {}, (err, payload) => {
        if (err) {
          const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
          return reject(createHttpError.Unauthorized(message));
        }

        resolve(payload as jwt.JwtPayload);
      });
    });
  }
}
