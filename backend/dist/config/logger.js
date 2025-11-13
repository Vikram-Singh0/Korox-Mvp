/**
 * Simple logger for KOROX
 * Can be replaced with Winston or Pino later
 */
class Logger {
    constructor() {
        this.prefix = '[KOROX]';
    }
    formatMessage(level, ...args) {
        const timestamp = new Date().toISOString();
        return `${this.prefix} [${timestamp}] [${level.toUpperCase()}]`;
    }
    info(...args) {
        console.log(this.formatMessage('info'), ...args);
    }
    warn(...args) {
        console.warn(this.formatMessage('warn'), ...args);
    }
    error(...args) {
        console.error(this.formatMessage('error'), ...args);
    }
    debug(...args) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage('debug'), ...args);
        }
    }
    success(...args) {
        console.log(this.formatMessage('info'), '✅', ...args);
    }
}
export const logger = new Logger();
export default logger;
