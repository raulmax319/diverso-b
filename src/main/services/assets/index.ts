import { Asset } from 'domain/models';
import createHttpError from 'http-errors';
import { DBClient } from 'main/db';

export class AssetsService {
  public async create(asset: Asset, userId: string): Promise<Asset> {
    const data = {
      type: asset.type,
      ticker: asset.ticker,
      quantity: asset.quantity,
      userId,
    };

    return await DBClient.shared.asset.create({
      data,
    });
  }

  public async createMany(assets: Array<Asset>, userId: string): Promise<number> {
    const result = await DBClient.shared.asset.createMany({
      data: assets.map((asset) => ({ ...asset, userId })),
    });
    return result.count;
  }

  public async findAllByUserId(userId: string): Promise<Array<Asset>> {
    if (!userId) throw createHttpError.NotFound('User not found.');

    const questions = await DBClient.shared.question.findMany({
      where: { userId },
    });

    const assets = await DBClient.shared.asset.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        type: true,
        ticker: true,
        quantity: true,
        questions: true,
      },
    });

    return assets.map((asset) => {
      return {
        ...asset,
        score: questions.filter((q) => asset.questions.find((question) => q.id === question))
          .length,
      };
    });
  }

  public async update(data: Asset, userId: string): Promise<Asset> {
    const result = await DBClient.shared.asset.update({
      where: { id: data.id, userId },
      data,
    });
    delete result.userId;
    return result;
  }

  public async delete(id: string, userId: string): Promise<Asset> {
    return await DBClient.shared.asset.delete({ where: { id, userId } });
  }
}
