import { Request, Response } from 'express';
import { Controller, Get } from 'resdk';

@Controller('/_status')
export class StatusController {
  @Get('/health')
  private health = (req: Request, res: Response) => {
    res.json({ status: 'OK' });
  };
}
