export interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SafeUser = Omit<User, 'password'>;
