export interface User {
  id: string;
  login: string;
  password: string;
  refreshTokenHash?: string | null;
  version: number;
  createdAt: bigint;
  updatedAt: bigint;
}

export type SafeUser = Omit<User, 'password' | 'createdAt' | 'updatedAt'> & {
  createdAt: number;
  updatedAt: number;
};
