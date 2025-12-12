import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const maxFileSize = process.env.LOG_MAX_SIZE || '1024';
    const logLevel = process.env.LOG_LEVEL?.toLowerCase() || 'info';

    const fileTransport = new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      level: logLevel,
      maxsize: parseInt(maxFileSize) * 1024,
      maxFiles: 5,
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message, context }) =>
            `${timestamp} [${level.toUpperCase()}]${context ? `[${context}]` : ''} ${message}`,
        ),
      ),
    });

    const errorTransport = new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: parseInt(maxFileSize) * 1024,
      maxFiles: 5,
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message, context }) =>
            `${timestamp} [${level.toUpperCase()}]${context ? `[${context}]` : ''} ${message}`,
        ),
      ),
    });

    const consoleTransport = new winston.transports.Console({
      level: logLevel,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message, context }) =>
            `${timestamp} [${level}]${context ? `[${context}]` : ''} ${message}`,
        ),
      ),
    });

    this.logger = winston.createLogger({
      level: logLevel,
      transports: [fileTransport, errorTransport, consoleTransport],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    const msg = trace ? `${message}\n${trace}` : message;
    this.logger.error(msg, { context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  logRequest(method: string, url: string, query: any, body: any) {
    const msg = `Request: ${method} ${url} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(body)}`;
    this.log(msg, 'HTTP');
  }

  logResponse(method: string, url: string, statusCode: number) {
    const msg = `Response: ${method} ${url} | Status: ${statusCode}`;
    this.log(msg, 'HTTP');
  }
}
