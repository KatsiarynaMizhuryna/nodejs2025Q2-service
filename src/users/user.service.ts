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
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private toSafeUser(
    user: User,
  ): SafeUser & { createdAt: number; updatedAt: number } {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshTokenHash, createdAt, updatedAt, ...rest } = user;
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
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const timestamp = BigInt(Date.now());

    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: passwordHash,
        refreshTokenHash: null,
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

  async validateUserCredentials(login: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { login } });
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;

    return user;
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toSafeUser(user);
  }

  async updateRefreshToken(userId: string, refreshTokenHash: string | null) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash,
        updatedAt: BigInt(Date.now()),
      },
    });
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const valid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!valid) {
      throw new ForbiddenException('Old password does not match');
    }
    const newHash = await bcrypt.hash(dto.newPassword, 10);
    const timestamp = BigInt(Date.now());

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: newHash,
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
