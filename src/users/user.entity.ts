export interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: bigint;
  updatedAt: bigint;
}

export type SafeUser = Omit<User, 'password' | 'createdAt' | 'updatedAt'> & {
  createdAt: number;
  updatedAt: number;
};
