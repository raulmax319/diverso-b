import { User } from './user.model';

export interface Credentials {
  email: string;
  password: string;
}

export interface Auth {
  user: User;
  accessToken: string;
}
