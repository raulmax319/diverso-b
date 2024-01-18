import { User } from 'domain/models';
import { Request, Response } from 'express';
import { AuthMiddleware } from 'main/middlewares/auth';
import { ValidationMiddleware } from 'main/middlewares/validation';
import { AuthService } from 'main/services/auth';
import { Controller, Middleware, Post } from 'resdk';
import { Crypton } from 'src/infra/crypto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  @Post('/register')
  @Middleware([ValidationMiddleware.validateBodyData, AuthMiddleware.hashPassword])
  private async create(req: Request, res: Response) {
    try {
      const user = req.body.data as User;
      const result = await this.authService.register(user);
      res.setHeader('X-Auth-Token', Crypton.shared.sign());
      res.status(201).json({ data: result });
    } catch (e) {
      res.status(400).json({ status: 'erro ao criar usuario', e });
    }
  }

  @Post('/login')
  @Middleware(ValidationMiddleware.validateBodyData)
  private async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body.data;
      const result = await this.authService.login({
        email,
        password,
      });

      res.setHeader('X-Auth-Token', Crypton.shared.sign());
      res.status(200).json({ data: result });
    } catch (e) {
      res.status(401).json({ data: e });
    }
  }
}
