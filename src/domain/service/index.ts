import { Logger } from 'tslog';

export class Service {
  constructor(readonly logger: Logger<Service> = new Logger()) {}
}
