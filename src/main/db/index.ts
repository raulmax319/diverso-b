import { PrismaClient } from '@prisma/client';

export class DBClient extends PrismaClient {
  public static shared: DBClient = new DBClient();
}
