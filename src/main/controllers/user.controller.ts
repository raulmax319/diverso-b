import { Request, Response } from 'express';
import { Controller, Get, Middleware } from 'resdk';
import { UserService } from 'main/services/user';
import { AuthMiddleware } from 'main/middlewares/auth';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  @Get('/')
  @Middleware([AuthMiddleware.validateHeader, AuthMiddleware.validateToken])
  private async user(req: Request, res: Response) {
    try {
      const user = await this.userService.findById(req.identifier);
      res.status(200).json({ data: user });
    } catch (e) {
      res.status(400).json({ data: 'erro ao buscar usuario', e });
    }
  }
}
