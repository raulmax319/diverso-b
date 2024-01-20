import { User } from 'domain/models';
import { Service } from 'domain/service';
import { DBClient } from 'main/db';

export class UserService extends Service {
  public async findById(id: string): Promise<User> {
    const user = await DBClient.shared.user.findFirstOrThrow({
      select: {
        name: true,
        email: true,
        assets: true,
        budgetGoals: {
          select: {
            id: true,
            type: true,
            value: true,
          },
        },
        investimentGoals: {
          select: {
            id: true,
            type: true,
            value: true,
          },
        },
        questions: {
          select: {
            id: true,
            criteria: true,
            question: true,
            strategy: true,
          },
        },
      },
      where: { id },
    });
    return user;
  }
}
