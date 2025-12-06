import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SafeUser, User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private toSafeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async create(dto: CreateUserDto): Promise<SafeUser> {
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: dto.password,
        version: 1,
      },
    });

    return this.toSafeUser(user);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => this.toSafeUser(u));
  }

  async findOne(id: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.toSafeUser(user);
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<SafeUser | 'WRONG_PASSWORD' | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    if (user.password !== dto.oldPassword) {
      return 'WRONG_PASSWORD';
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
        version: user.version + 1,
      },
    });

    return this.toSafeUser(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
