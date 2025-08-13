import { createLogger, format, transports } from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import 'winston-daily-rotate-file';

// Ensure logs directory exists
const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log level from environment variable (default to 'info')
const logLevel = process.env.LOG_LEVEL || 'info';

// Custom log format with timestamp, level, message, and optional metadata
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }), // include stack trace if error
  format.splat(),
  format.printf(({ timestamp, level, message, stack }) => {
    // If error stack exists, log it instead of message
    const logMessage = stack || message;
    return `[${timestamp}] ${level.toUpperCase()}: ${logMessage}`;
  })
);

// Configure transports
const logger = createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    // Console transport for all logs >= logLevel
    new transports.Console({
      format: format.colorize({ all: true }),
    }),

    // Daily rotated file transport for info and above
    new transports.DailyRotateFile({
      filename: path.join(logDir, 'test-run-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),

    // Separate error file for errors only
    new transports.DailyRotateFile({
      filename: path.join(logDir, 'test-run-error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
    }),
  ],

  exitOnError: false, // Do not exit on handled exceptions
});

export default logger;
