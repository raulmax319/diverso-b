import { Question } from 'domain/models';
import { Service } from 'domain/service';
import { DBClient } from 'main/db';

export class QuestionsService extends Service {
  public async create(question: Question, userId: string): Promise<Question> {
    const data = {
      ...question,
      userId,
    };

    return await DBClient.shared.question.create({
      data,
    });
  }

  public async findAll(userId: string): Promise<Array<Question>> {
    return await DBClient.shared.question.findMany({
      select: {
        id: true,
        criteria: true,
        question: true,
        strategy: true,
      },
      where: { userId },
    });
  }

  public async update(data: Question, userId: string): Promise<Question> {
    const result = await DBClient.shared.question.update({
      where: { id: data.id, userId },
      data,
    });
    delete result.userId;
    return result;
  }

  public async delete(id: string, userId: string): Promise<Question> {
    return await DBClient.shared.question.delete({ where: { id, userId } });
  }
}
