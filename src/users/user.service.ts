import { Injectable } from '@nestjs/common';
import { SafeUser, User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  private users: User[] = [];

  private toSafeUser(user: User): SafeUser {
    const { password, ...safeUser } = user;
    if (password) {
      return safeUser;
    }
    return safeUser;
  }

  create(dto: CreateUserDto): SafeUser {
    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(user);
    return this.toSafeUser(user);
  }

  findAll(): SafeUser[] {
    return this.users.map((user) => this.toSafeUser(user));
  }

  findOne(id: string): SafeUser | null {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    return this.toSafeUser(user);
  }

  update(
    id: string,
    dto: UpdatePasswordDto,
  ): SafeUser | 'WRONG_PASSWORD' | null {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;

    if (dto.oldPassword !== user.password) {
      return 'WRONG_PASSWORD';
    }

    user.password = dto.newPassword;
    user.updatedAt = Date.now();
    user.version += 1;

    return this.toSafeUser(user);
  }

  delete(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}
