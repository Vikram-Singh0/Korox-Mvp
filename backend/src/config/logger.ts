/**
 * Simple logger for KOROX
 * Can be replaced with Winston or Pino later
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private prefix = '[KOROX]';

  private formatMessage(level: LogLevel, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    return `${this.prefix} [${timestamp}] [${level.toUpperCase()}]`;
  }

  info(...args: any[]) {
    console.log(this.formatMessage('info'), ...args);
  }

  warn(...args: any[]) {
    console.warn(this.formatMessage('warn'), ...args);
  }

  error(...args: any[]) {
    console.error(this.formatMessage('error'), ...args);
  }

  debug(...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug'), ...args);
    }
  }

  success(...args: any[]) {
    console.log(this.formatMessage('info'), '✅', ...args);
  }
}

export const logger = new Logger();
export default logger;
