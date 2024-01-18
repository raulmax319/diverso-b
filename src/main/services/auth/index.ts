import bcrypt from 'bcrypt';
import { Auth, BudgetGoal, Credentials, InvestimentGoal, User } from 'domain/models';
import createHttpError from 'http-errors';
import { DBClient } from 'main/db';
import { JsonWebToken } from 'src/infra/jwt';

export class AuthService {
  public async login(data: Credentials): Promise<Auth> {
    const { email } = data;

    const user = await DBClient.shared.user.findUniqueOrThrow({ where: { email } });

    if (!bcrypt.compareSync(data.password, user.password)) {
      throw createHttpError.Unauthorized("Password does't match");
    }

    delete user.password;
    delete user.createdAt;
    const accessToken = await JsonWebToken.shared.sign(user);
    return { user, accessToken };
  }

  public async register(user: User): Promise<Auth> {
    const defaultQuestions = await DBClient.shared.defaultQuestion.findMany({
      select: {
        criteria: true,
        question: true,
        strategy: true,
      },
    });

    const defaultInvestimentGoals: Array<InvestimentGoal> = [
      {
        type: 'international',
        value: 25,
      },
      {
        type: 'etf',
        value: 5,
      },
      {
        type: 'national',
        value: 30,
      },
      {
        type: 'fii',
        value: 10,
      },
      {
        type: 'reit',
        value: 10,
      },
      {
        type: 'crypto',
        value: 5,
      },
      {
        type: 'valueReserve',
        value: 0,
      },
      {
        type: 'fixedIncome',
        value: 15,
      },
    ];

    const defaultBudgetGoals: Array<BudgetGoal> = [
      {
        type: 'fixedCosts',
        value: 30,
      },
      {
        type: 'comfort',
        value: 15,
      },
      {
        type: 'goals',
        value: 10,
      },
      {
        type: 'pleasures',
        value: 10,
      },
      {
        type: 'freedom',
        value: 25,
      },
      {
        type: 'knowledge',
        value: 5,
      },
      {
        type: 'emergency',
        value: 5,
      },
    ];

    const result = await DBClient.shared.user.create({
      data: {
        ...user,
        questions: {
          createMany: {
            data: defaultQuestions,
          },
        },
        investimentGoals: {
          createMany: {
            data: defaultInvestimentGoals,
          },
        },
        budgetGoals: {
          createMany: {
            data: defaultBudgetGoals,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const accessToken = await JsonWebToken.shared.sign(result);
    return { user: result, accessToken };
  }
}
