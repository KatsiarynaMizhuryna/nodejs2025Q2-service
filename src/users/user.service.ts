import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { SafeUser, User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private toSafeUser(
    user: User,
  ): SafeUser & { createdAt: number; updatedAt: number } {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...rest } = user;
    return {
      ...rest,
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    };
  }

  async create(dto: CreateUserDto): Promise<SafeUser> {
    const existing = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (existing) {
      throw new BadRequestException('User with this login already exists');
    }

    const timestamp = BigInt(Date.now());

    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: dto.password,
        version: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    return this.toSafeUser(user);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toSafeUser(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password does not match');
    }

    const timestamp = BigInt(Date.now());

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
        updatedAt: timestamp,
        version: { increment: 1 },
      },
    });

    return this.toSafeUser(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
