import winston from 'winston';
import { config } from '../../config/environment';

const formats = {
  json: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  pretty: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
      return `${timestamp} [${level}]: ${message}${metaStr}`;
    }),
  ),
};

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: formats[config.LOG_FORMAT],
  defaultMeta: { service: 'mcp-gateway' },
  transports: [
    new winston.transports.Console(),
  ],
});

// Add file transport in production
if (config.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }));
  logger.add(new winston.transports.File({
    filename: 'logs/combined.log',
  }));
}

export default logger;