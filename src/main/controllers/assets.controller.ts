import { Request, Response } from 'express';
import { Controller, Delete, Get, Middleware, Patch, Post, Put } from 'resdk';
import { AuthMiddleware } from 'main/middlewares/auth';
import { AssetsService } from 'main/services/assets';
import { AssetMiddleware } from 'main/middlewares/asset';
import { Asset } from 'domain/models';

@Controller('/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService = new AssetsService()) {}

  @Get('/')
  @Middleware([AuthMiddleware.validateToken, AuthMiddleware.validateHeader])
  private async findAll(req: Request, res: Response) {
    try {
      const assets = await this.assetsService.findAllByUserId(req.identifier);
      res.status(200).json({ data: assets });
    } catch (e) {
      res.status(400).json(e);
    }
  }

  @Post('/create')
  @Middleware([
    AuthMiddleware.validateToken,
    AuthMiddleware.validateHeader,
    AssetMiddleware.validateBody,
  ])
  private async create(req: Request, res: Response) {
    try {
      const data = req.body.data as Asset;
      const asset = await this.assetsService.create(data, req.identifier);
      res.status(201).json({ data: asset });
    } catch (e) {
      res.status(400).json(e);
    }
  }

  @Post('/create/many')
  @Middleware([
    AuthMiddleware.validateToken,
    AuthMiddleware.validateHeader,
    AssetMiddleware.validateBody,
  ])
  private async createMany(req: Request, res: Response) {
    try {
      const data = req.body.data as Array<Asset>;
      const count = await this.assetsService.createMany(data, req.identifier);
      const success = data.length === count;
      res.status(201).json({ data: { success } });
    } catch (e) {
      res.status(400).json(e);
    }
  }

  @Put('/update')
  @Middleware([
    AuthMiddleware.validateToken,
    AuthMiddleware.validateHeader,
    AssetMiddleware.validateBody,
  ])
  private async update(req: Request, res: Response) {
    try {
      const data = req.body.data as Asset;
      const asset = await this.assetsService.update(data, req.identifier);
      res.status(201).json({ data: asset });
    } catch (e) {
      res.status(400).json(e);
    }
  }

  @Patch('/update/quantity')
  @Middleware([
    AuthMiddleware.validateToken,
    AuthMiddleware.validateHeader,
    AssetMiddleware.validateBody,
  ])
  private async quantity(req: Request, res: Response) {
    try {
      const data = req.body.data as Asset;
      const asset = await this.assetsService.update(data, req.identifier);
      res.status(201).json({ data: asset });
    } catch (e) {
      res.status(400).json(e);
    }
  }

  @Patch('/update/questions')
  @Middleware([
    AuthMiddleware.validateToken,
    AuthMiddleware.validateHeader,
    AssetMiddleware.validateBody,
  ])
  private async questions(req: Request, res: Response) {
    try {
      const data = req.body.data as Asset;
      const asset = await this.assetsService.update(data, req.identifier);
      res.status(201).json({ data: asset });
    } catch (e) {
      res.status(400).json(e);
    }
  }

  @Delete('/delete')
  @Middleware([
    AuthMiddleware.validateToken,
    AuthMiddleware.validateHeader,
    AssetMiddleware.validateBody,
  ])
  private async delete(req: Request, res: Response) {
    try {
      const data = req.body.data as Asset;
      const asset = await this.assetsService.delete(data.id, req.identifier);
      res.status(201).json({ data: asset });
    } catch (e) {
      res.status(400).json(e);
    }
  }
}
