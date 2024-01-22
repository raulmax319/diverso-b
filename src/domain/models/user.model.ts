import { Asset } from './asset.model';

export interface User {
  id?: string;
  name: string;
  email: string;
  assets?: Array<Asset>;
  password?: string;
  createdAt?: Date;
}
