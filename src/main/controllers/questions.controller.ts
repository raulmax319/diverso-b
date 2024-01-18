import { Question } from 'domain/models';
import { Request, Response } from 'express';
import { AuthMiddleware } from 'main/middlewares/auth';
import { ValidationMiddleware } from 'main/middlewares/validation';
import { QuestionsService } from 'main/services/questions';
import { Controller, Delete, Get, Middleware, Post, Put } from 'resdk';

@Controller('/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService = new QuestionsService()) {}

  @Get('/')
  @Middleware([AuthMiddleware.validateToken, AuthMiddleware.validateHeader])
  private async getQuestionList(req: Request, res: Response) {
    const questions = await this.questionsService.findAll(req.identifier);
    res.status(200).json({ data: questions });
  }

  @Post('/create')
  @Middleware([
    AuthMiddleware.validateToken,
    AuthMiddleware.validateHeader,
    ValidationMiddleware.validateBodyData,
  ])
  private async create(req: Request, res: Response) {
    const data = req.body.data as Question;
    const question = await this.questionsService.create(data, req.identifier);
    res.status(200).json({ data: question });
  }

  @Put('/update')
  @Middleware([
    AuthMiddleware.validateToken,
    AuthMiddleware.validateHeader,
    ValidationMiddleware.validateBodyData,
  ])
  private async update(req: Request, res: Response) {
    const data = req.body.data as Question;
    const question = await this.questionsService.update(data, req.identifier);
    res.status(200).json({ data: question });
  }

  @Delete('/delete')
  @Middleware([
    AuthMiddleware.validateToken,
    AuthMiddleware.validateHeader,
    ValidationMiddleware.validateBodyData,
  ])
  private async delete(req: Request, res: Response) {
    try {
      const data = req.body.data as Question;
      const asset = await this.questionsService.delete(data.id, req.identifier);
      res.status(201).json({ data: asset });
    } catch (e) {
      res.status(400).json(e);
    }
  }
}
