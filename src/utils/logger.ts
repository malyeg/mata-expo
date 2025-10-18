export enum LogLevel {
  trace,
  debug,
  info,
  warn,
  error,
}

export type LoggerConfig = {
  logLevel: LogLevel;
};

const SEPARATOR = ' => ';

const initConfig: LoggerConfig = {
  logLevel: __DEV__ ? LogLevel.debug : LogLevel.info,
};
class LoggerFactory {
  private static instance: LoggerFactory;

  private constructor(readonly loggerConfig: LoggerConfig) {}

  public static init(config: LoggerConfig): LoggerFactory {
    if (!LoggerFactory.instance) {
      LoggerFactory.instance = new LoggerFactory(config ?? initConfig);
    }
    // TODO  validate and process config
    return LoggerFactory.instance;
  }

  public static getInstance(): LoggerFactory {
    return LoggerFactory.instance;
  }

  static getLogger = (
    className: string | Function,
    loggerConfig?: LoggerConfig,
  ) => {
    if (!LoggerFactory.instance && !loggerConfig) {
      LoggerFactory.instance = new LoggerFactory(initConfig);
    }
    const name = typeof className === 'string' ? className : className.name;
    return new Log(name, loggerConfig ?? LoggerFactory.instance.loggerConfig);
  };
}
class Log {
  constructor(public className: string, readonly loggerConfig: LoggerConfig) {}

  trace(message?: any, ...optionalParams: any[]) {
    this.consoleLog(LogLevel.trace, message, ...optionalParams);
  }

  log(message?: any, ...optionalParams: any[]) {
    this.consoleLog(LogLevel.debug, message, ...optionalParams);
  }

  debug(message?: any, ...optionalParams: any[]) {
    this.consoleLog(LogLevel.debug, message, ...optionalParams);
  }

  info(message?: any, ...optionalParams: any[]) {
    this.consoleLog(LogLevel.info, message, ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]) {
    this.consoleLog(LogLevel.warn, message, ...optionalParams);
  }

  error(message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }
  private consoleLog(level: LogLevel, message?: any, ...optionalParams: any[]) {
    const template = `${this.className} ${SEPARATOR}`;
    this.loggerConfig.logLevel <= level &&
      console.log(template, message, ...optionalParams);
  }
}

const getLogger = LoggerFactory.getLogger;

export {LoggerFactory, getLogger};
