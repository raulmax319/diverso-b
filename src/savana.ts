import 'dotenv/config';
import cors from 'cors';
import { Server, getControllerInstances } from 'resdk';
import * as controllers from 'main/controllers';
import { DBClient } from 'main/db';

class Savana extends Server {
  private PORT = process.env.PORT;

  constructor() {
    super();

    this.app.use(cors({ exposedHeaders: 'X-Auth-Token' }));
    this.setupControllersInstances();
  }

  private setupControllersInstances() {
    const instances = getControllerInstances(controllers);
    this.setupControllers(instances);
  }

  public async start() {
    this.app.listen(this.PORT, async () => {
      await DBClient.shared.$connect();
      this.logger.info(`Server listening on port ${this.PORT}`);
    });
  }
}

export default new Savana();
