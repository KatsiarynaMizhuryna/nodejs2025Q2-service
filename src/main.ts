import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingService } from './logging/logging.service';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { UserService } from './users/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggingService = app.get(LoggingService);
  const port = process.env.PORT || 4000;

  app.useLogger(loggingService);

  loggingService.log('Starting application initialization...', 'Bootstrap');

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  loggingService.log('Swagger documentation initialized at /doc', 'Bootstrap');

  app.useGlobalFilters(new AllExceptionsFilter(loggingService));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector, app.get(AuthService), app.get(UserService)),
  );

  process.on('uncaughtException', (error: Error) => {
    loggingService.error(
      `Uncaught Exception: ${error.message}`,
      error.stack,
      'Process',
    );

    setTimeout(() => process.exit(1), 1000);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    loggingService.error(
      `Unhandled Rejection at: ${promise}, reason: ${reason}`,
      reason?.stack,
      'Process',
    );
  });

  process.on('SIGTERM', async () => {
    loggingService.log(
      'SIGTERM signal received: closing HTTP server',
      'Bootstrap',
    );
    await app.close();
    loggingService.log('HTTP server closed', 'Bootstrap');
  });

  process.on('SIGINT', async () => {
    loggingService.log(
      'SIGINT signal received: closing HTTP server',
      'Bootstrap',
    );
    await app.close();
    loggingService.log('HTTP server closed', 'Bootstrap');
  });

  await app.listen(port);
  loggingService.log(`Application is running on port ${port}`, 'Bootstrap');
  loggingService.log(
    `Swagger docs available at http://localhost:${port}/doc`,
    'Bootstrap',
  );
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
