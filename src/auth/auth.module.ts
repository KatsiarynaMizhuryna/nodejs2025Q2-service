import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/user.module';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LoggingService } from 'src/logging/logging.service';

@Global()
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoggingService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
