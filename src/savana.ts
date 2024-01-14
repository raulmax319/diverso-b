import 'dotenv/config';
import { Server, getControllerInstances } from 'resdk';
import * as controllers from 'main/controllers';

class Savana extends Server {
  private PORT = process.env.PORT;

  constructor() {
    super();

    this.setupControllersInstances();
  }

  private setupControllersInstances() {
    const instances = getControllerInstances(controllers);
    this.setupControllers(instances);
  }

  public start() {
    this.app.listen(this.PORT, () => this.logger.info(`Server listening on port ${this.PORT}`));
  }
}

export default new Savana();
