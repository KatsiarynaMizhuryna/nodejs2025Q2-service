import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/users/user.service';
import { SignupDto, LoginDto, RefreshTokenDto } from './auth-dto';
import { LoggingService } from 'src/logging/logging.service';

export interface JwtPayload {
  userId: string;
  login: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private loggingService: LoggingService,
  ) {}
  private readonly ACCESS_TOKEN_SECRET = process.env.JWT_SECRET_KEY;
  private readonly REFRESH_TOKEN_SECRET = process.env.JWT_SECRET_REFRESH_KEY;

  async signup(signupDto: SignupDto) {
    const { login, password } = signupDto;

    if (!login || !password) {
      this.loggingService.error(
        'Signup failed: Invalid login or password',
        undefined,
        'AuthService',
      );
      throw new BadRequestException('Invalid login or password');
    }

    const user = await this.userService.create({ login, password });
    this.loggingService.log(
      `User created successfully: ${login}`,
      'AuthService',
    );

    return { id: user.id, login: user.login };
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const { login, password } = dto;

    const user = await this.userService.validateUserCredentials(
      login,
      password,
    );

    if (!user) {
      this.loggingService.error(
        `Login failed: Invalid credentials for user: ${login}`,
        undefined,
        'AuthService',
      );
      throw new ForbiddenException('Authentication failed');
    }

    const tokens = this.generateTokens(user.id, user.login);

    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userService.updateRefreshToken(user.id, refreshHash);

    return tokens;
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, this.ACCESS_TOKEN_SECRET) as JwtPayload;
      return payload;
    } catch (error) {
      this.loggingService.error(
        'Access token verification failed',
        error instanceof Error ? error.stack : undefined,
        'AuthService',
      );
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthTokens> {
    const { refreshToken } = dto;

    if (!refreshToken) {
      this.loggingService.error(
        'Refresh token is required',
        undefined,
        'AuthService',
      );
      throw new UnauthorizedException('Refresh token is required');
    }

    let payload: JwtPayload;

    try {
      payload = jwt.verify(
        refreshToken,
        this.REFRESH_TOKEN_SECRET,
      ) as JwtPayload;
    } catch (error) {
      this.loggingService.error(
        'Invalid or expired refresh token',
        error instanceof Error ? error.stack : undefined,
        'AuthService',
      );
      throw new ForbiddenException('Invalid or expired refresh token');
    }

    const user = await this.userService.findOne(payload.userId);

    if (!user) {
      this.loggingService.error(
        `Refresh failed: User not found: ${payload.userId}`,
        undefined,
        'AuthService',
      );
      throw new ForbiddenException('User not found');
    }

    if (user.refreshTokenHash) {
      const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!isValid) {
        this.loggingService.error(
          `Refresh failed: Invalid refresh token for user: ${user.login}`,
          undefined,
          'AuthService',
        );
        throw new ForbiddenException('Invalid refresh token');
      }
    }

    const tokens = this.generateTokens(user.id, user.login);

    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userService.updateRefreshToken(user.id, refreshHash);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }

  private generateTokens(userId: string, login: string): AuthTokens {
    const payload: JwtPayload = { userId, login };

    const accessToken = jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
      expiresIn: '24h',
    });

    return { accessToken, refreshToken };
  }
}
