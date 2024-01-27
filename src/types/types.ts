// Type definitions for log4js

import {
    addLayout as addLayoutExport,
    configureLogger as configureLoggerExport,
    getLogger as getLoggerExport,
    logLevels,
} from '..';
import { eCoreAppenderType, eLevelName, eValidColors } from './enums';

export interface ILogLevel {
    isEqualTo(other: string | ILogLevel): boolean;
    isLessThan(other: string | ILogLevel): boolean;
    isGraterThan(other: string | ILogLevel): boolean;
    isLessThanOrEqualTo(other: string | ILogLevel): boolean;
    isGreaterThanOrEqualTo(other: string | ILogLevel): boolean;
    levelNumber: number;
    levelStr: string;
    color: eValidColors;
}

export interface ILogLevels {
    ALL: ILogLevel;
    MARK: ILogLevel;
    TRACE: ILogLevel;
    DEBUG: ILogLevel;
    INFO: ILogLevel;
    WARN: ILogLevel;
    ERROR: ILogLevel;
    FATAL: ILogLevel;
    OFF: ILogLevel;
    levels: Map<string, ILogLevel>;
    getLevel(level: string, defaultLevel?: ILogLevel): ILogLevel | undefined;
    addLevels(customLevels: ILogLevel[]): void;
}

export interface ILayoutConfiguration {
    type: string;
    static?: any;
    dynamic?: any;
    [key: string]: any;
}
/**
 * A parsed CallStack from an `Error.stack` trace
 */
export interface CallStack {
    functionName: string;
    fileName: string;
    lineNumber: number;
    columnNumber: number;
    /**
     * The stack string after the skipped lines
     */
    callStack: string;
}

export interface ILoggingEvent {
    /**
     * @description category name of event just fired
     *
     * @type {string}
     * @memberof ILoggingEvent
     */
    categoryName: string;
    /**
     * @description current appender name
     *
     * @type {string}
     * @memberof ILoggingEvent
     */
    appenderNames: string[];
    /**
     * @description level of message
     *
     * @type {ILogLevel}
     * @memberof ILoggingEvent
     */
    level: ILogLevel;
    startTime: Date;
    /**
     * @description current process id
     *
     * @type {number}
     * @memberof ILoggingEvent
     */
    pid: number;
    /**
     * @description Logging data
     *
     * @type {any[]}
     * @memberof ILoggingEvent
     */
    data: any[];
    /**
     * @data from context transformed by layoutTransformation function
     *
     * @type {*}
     * @memberof ILoggingEvent
     */
    layoutTransformation?: any;
    error?: Error;

    /** @description Basic toString() function: [2023-09-22T04:57:28.627] [INFO] default - Server is running: .. */
    toString: () => string;
}

/** @deprecated Use interface name ILoggingEvent (log4js, here is it for backward compatibility)*/
export interface LoggingEvent extends ILoggingEvent {}

export type Token = ((logEvent: ILoggingEvent) => string) | string;

export interface IPatternLayout {
    type: 'pattern';
    // specifier for the output format, using placeholders as described below
    pattern: string;
    // user-defined tokens to be used in the pattern
    tokens?: { [name: string]: Token };
}

export interface ICustomLayout {
    [key: string]: any;
    type: string;
}

export interface IAbstractAppenderConfiguration {
    type: eCoreAppenderType | string;
    // the minimum level of event to allow through the filter, if no minLevel specified then all messages is logged (all)
    minLevel?: ILogLevel;
    // (defaults to FATAL) the maximum level of event to allow through the filter, if no minLevel specified then all messages is logged
    maxLevel?: ILogLevel;
    layout?: ILayoutConfiguration;
}

/**
 * Category Filter
 *
 * @see https://log4js-node.github.io/log4js-node/categoryFilter.html
 */
/* export interface ICategoryFilterAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.categoryFilter;
    // the category (or categories if you provide an array of values) that will be excluded from the appender.
    exclude?: string | string[];
    // the name of the appender to filter. see https://log4js-node.github.io/log4js-node/layouts.html
    appender?: string;
}
*/
/**
 * No Log Filter
 *
 * @see https://log4js-node.github.io/log4js-node/noLogFilter.html
 */
export interface INoLogFilterAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.noLogFilter;
    // the regular expression (or the regular expressions if you provide an array of values)
    // will be used for evaluating the events to pass to the appender.
    // The events, which will match the regular expression, will be excluded and so not logged.
    exclude: string | string[];
    // the name of an appender, defined in the same configuration, that you want to filter.
    appender: string;
}

/**
 * Console Appender
 *
 * @see https://log4js-node.github.io/log4js-node/console.html
 */
export interface IConsoleAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.console;
}

export interface IFileAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.file;
    /** @description  the path of the file where you want your logs written*/
    fileName: string;
    /** @description Split log file to multi files parted by date */
    multiFile?: boolean;
    /* @description  (defaults to false) compress the backup files using gzip (backup files will have .gz extension) */
    compress?: boolean;

    // (defaults to undefined) the maximum size (in bytes) for the log file. If not specified or 0, then no log rolling will happen.
    // maxLogSize?: number | string;
    // (defaults to 5) the number of old log files to keep (excluding the hot file).
    // backups?: number;
    // (defaults to utf-8)
    // encoding?: string;
    // (defaults to 0o600)
    // mode?: number;
    // (defaults to a)
    // flags?: string;
    // (defaults to false) preserve the file extension when rotating log files (`file.log` becomes `file.1.log` instead of `file.log.1`).
    // keepFileExt?: boolean;
    // (defaults to .) the filename separator when rolling. e.g.: abc.log`.`1 or abc`.`1.log (keepFileExt)
    // fileNameSep?: string;
}
/*
export interface ISyncFileAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.fileSync;
    // the path of the file where you want your logs written.
    filename: string;
    // (defaults to undefined) the maximum size (in bytes) for the log file. If not specified or 0, then no log rolling will happen.
    maxLogSize?: number | string;
    // (defaults to 5) the number of old log files to keep (excluding the hot file).
    backups?: number;
    // (defaults to utf-8)
    encoding?: string;
    // (defaults to 0o600)
    mode?: number;
    // (defaults to a)
    flags?: string;
}

export interface IDateFileAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.dateFile;
    // the path of the file where you want your logs written.
    filename: string;
    // (defaults to yyyy-MM-dd) the pattern to use to determine when to roll the logs.
    /**
     * The following strings are recognized in the pattern:
     *  - yyyy : the full year, use yy for just the last two digits
     *  - MM   : the month
     *  - dd   : the day of the month
     *  - hh   : the hour of the day (24-hour clock)
     *  - mm   : the minute of the hour
     *  - ss   : seconds
     *  - SSS  : milliseconds (although I'm not sure you'd want to roll your logs every millisecond)
     *  - O    : timezone (capital letter o)

    pattern?: string;
    // (defaults to utf-8)
    encoding?: string;
    // (defaults to 0o600)
    mode?: number;
    // (defaults to a)
    flags?: string;
    // (defaults to false) compress the backup files using gzip (backup files will have .gz extension)
    compress?: boolean;
    // (defaults to false) preserve the file extension when rotating log files (`file.log` becomes `file.2017-05-30.log` instead of `file.log.2017-05-30`).
    keepFileExt?: boolean;
    // (defaults to .) the filename separator when rolling. e.g.: abc.log`.`2013-08-30 or abc`.`2013-08-30.log (keepFileExt)
    fileNameSep?: string;
    // (defaults to false) include the pattern in the name of the current log file.
    alwaysIncludePattern?: boolean;
    // (defaults to 1) the number of old files that matches the pattern to keep (excluding the hot file).
    numBackups?: number;
}
*/
export interface LogLevelFilterAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.logLevelFilter;
    // the name of an already defined appender, defined in the same configuration, that you want to filter.
    appender: eCoreAppenderType.logLevelFilter | string;
}

/**
 * @description This is full response from promises
 *
 * @export
 * @interface IPromiseResult
 * @template
 * {
    status: 'fulfilled' | 'rejected';
    value: T;
    reason: Error;
}
 */
export interface IPromiseResult<T> {
    status: 'fulfilled' | 'rejected';
    value: T;
    reason: Error;
}

export interface ILoggingFunctionResponse {
    loggerName: string | eCoreAppenderType;
    loggerResponse?: {
        event: ILoggingEvent;
        layoutTransformation: any;
    };
    error?: Error;
}

export interface ILogger {
    trace(message: any, ...args: any[]): Promise<ILoggingFunctionResponse>[];
    debug(message: any, ...args: any[]): Promise<ILoggingFunctionResponse>[];
    info(message: any, ...args: any[]): Promise<ILoggingFunctionResponse>[];
    warn(message: any, ...args: any[]): Promise<ILoggingFunctionResponse>[];
    error(message: any, ...args: any[]): Promise<ILoggingFunctionResponse>[];
    fatal(message: any, ...args: any[]): Promise<ILoggingFunctionResponse>[];
    mark(message: any, ...args: any[]): Promise<ILoggingFunctionResponse>[];
}
/*
export interface MultiFileAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.multiFile;
    // the base part of the generated log filename
    base: string;
    // the value to use to split files (see below).
    property: string;
    // the suffix for the generated log filename.
    extension: string;
}

export interface MultiProcessAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.multiProcess;
    // controls whether the appender listens for log events sent over the network, or is responsible for serializing events and sending them to a server.
    mode: 'master' | 'worker';
    // (only needed if mode == master) the name of the appender to send the log events to
    appender?: string;
    // (defaults to 5000) the port to listen on, or send to
    loggerPort?: number;
    // (defaults to localhost) the host/IP address to listen on, or send to
    loggerHost?: string;
}

export interface RecordingAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.recording;
}
*/
export interface StandardErrorAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.stderr;
}
/*
export interface StandardOutputAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.stdout;
}
*/
export interface CustomDefinedAppenderConfiguration {
    type: string;
    [key: string]: any;
}

/**
 * TCP Appender
 *
 * @see https://log4js-node.github.io/log4js-node/tcp.html

export interface TCPAppenderConfiguration
    extends IAbstractAppenderConfiguration {
    type: eCoreAppenderType.tcp;
    port?: number;
    host?: string;
    endMsg?: string;
}

/** @description Definition for layout function :  (config: ILayout) => (logEvent: ILoggingEvent) => any */
export type TLayoutFunction = (logEvent: ILoggingEvent) => any;

/** @description Definition of logging function */
export type TLoggingFunction = (
    logEvent: ILoggingEvent,
) => Promise<ILoggingFunctionResponse>;

/**
 * @description List of possible appenders
 *
 * @export
 * @interface IAppenders
 */
export interface IAppenders {
    // CategoryFilterAppender: ICategoryFilterAppenderConfiguration;
    ConsoleAppender: IConsoleAppenderConfiguration;
    FileAppender: IFileAppenderConfiguration;
    // SyncFileAppender: ISyncFileAppenderConfiguration;
    // DateFileAppender: IDateFileAppenderConfiguration;
    LogLevelFilterAppender: LogLevelFilterAppenderConfiguration;
    NoLogFilterAppender: INoLogFilterAppenderConfiguration;
    // MultiFileAppender: MultiFileAppenderConfiguration;
    // MultiProcessAppender: MultiProcessAppenderConfiguration;
    // RecordingAppender: RecordingAppenderConfiguration;
    // StandardErrorAppender: StandardErrorAppenderConfiguration;
    // StandardOutputAppender: StandardOutputAppenderConfiguration;
    // TCPAppender: TCPAppenderConfiguration;
    CustomAppender: CustomDefinedAppenderConfiguration;
}

export type AppenderConfig = IAppenders[keyof IAppenders];

/**
 * @description Configuration for category (list of affected appenders, min?/max? level for logging)
 *
 * @export
 * @interface ICategoryConfiguration
 */
export interface ICategoryConfiguration {
    /** @description List of appenders we want to join to current category */
    appenders: string[];
    /** @description  in case this is present, then this is a main minLevel, other (lowers) levels is ignored */
    minLevel?: ILogLevel;
    /** @description  in case this is present, then this is a max minLevel, other (bigger) levels is ignored */
    maxLevel?: ILogLevel;
}

/**
 * @description Main configuration interface
 *
 * @export
 * @interface IConfiguration
 */
export interface IConfiguration {
    /**
     * @description List of appender's definition
     *
     * @type {{ [name: string]: AppenderConfig }}
     * @memberof IConfiguration
     */
    appenders: { [name: string]: AppenderConfig };
    /**
     * @description List of categories we want to initialize
     *
     * @type {{
     *         [name: string]: ICategoryConfiguration;
     *     }}
     * @memberof IConfiguration
     */
    categories?: {
        [name: string]: ICategoryConfiguration;
    };
}

/**
 * @description Initialization of appender ()
 *
 * @export {TLoggingFunction}
 * @interface IAppender
 */
export interface IAppender {
    configure: (
        config: IAbstractAppenderConfiguration,
        layoutFunction: TLayoutFunction | undefined,
    ) => TLoggingFunction;
}

// //////////////////////////////// Export default methods //////////////////////////////////////////////
// export async function configureLogger = (config: IConfiguration): Promise<void> => configureLoggerExport(config);
export const configureLogger = (config: IConfiguration): Promise<void> =>
    configureLoggerExport(config);

export const addLayout = (
    layoutTypeName: string = '',
    layoutFnc: (config: any) => (logEvent: ILoggingEvent) => any,
): void => addLayoutExport(layoutTypeName, layoutFnc);

export const getLogger = (category: string = 'default'): ILogger =>
    getLoggerExport(category);

export { logLevels as levels, logLevels };

/** @deprecated please use TLayoutFunction */
export { TLayoutFunction as LayoutFunction };
/** @deprecated please use TLayoutFunction */
export { TLoggingFunction as AppenderFunction };
/** @deprecated please use TLayoutFunction */
export { IAppender as AppenderModule };
export { eValidColors, eLevelName };

/* export function addLayout(
    layoutTypeName: string = '',
    layoutFnc: (
        config: ILayoutConfiguration | any,
    ) => (logEvent: ILoggingEvent) => any,
): void {
    addLayoutExport(layoutTypeName, layoutFnc);
}

export function getLogger(category: string = 'default'): ILogger {
    return getLoggerExport(category);
}
*/
// //////////////////////////////// Export default methods //////////////////////////////////////////////

/**
 * @description Error in processing
 *
 * @export
 * @interface IErrorItem
 */
export interface IErrorItem {
    errorDate: string;
    error: Error;
}
