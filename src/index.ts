// import esMain from 'es-main'; "es-main": "^1.3.0"

import {
    Level,
    logLevels as internalLogLevels,
    logLevels,
} from './classes/level';
import { getLocalIsoDateTime } from './lib/get-local-iso-time';
import { isAbstractConfiguration } from './lib/is-abstract-configuration';
import { printErrors } from './lib/print-errors';
import { parseConfigurationAppendersSection } from './load-configuration/parse-configuration-appenders-section';
import {
    emptyLogger,
    parseConfigurationCategoriesSection,
} from './load-configuration/parse-configuration-categories-section';
import { eCoreAppenderType, eLevelName, eValidColors } from './types/enums';
import {
    IAppender,
    IConfiguration,
    IErrorItem,
    ILayoutConfiguration,
    ILogger,
    ILoggingEvent,
    ILoggingFunctionResponse,
    TLayoutFunction,
    TLoggingFunction,
} from './types/types';

/** @description List of defined and recognized categories(loggers)  */
const loggingCategories = new Map<string, ILogger>();

/** @description List of loaded logging functions (= result of init Appender) */
export const loggingFunctions = new Map<string, TLoggingFunction>();

/** @description List of loaded layout layout configuration */
const layoutsConfiguration = new Map<
    string,
    (config: ILayoutConfiguration) => TLayoutFunction
>();

/** @description List of loaded layout functions (= result of init layout) */
const layoutsFunctions = new Map<string, TLayoutFunction>();

/** @description List of errors in last process */
export const errorList: IErrorItem[] = [];

/** @description Project root dir (dist as default) */
export let projectRootDir = __dirname;

/**
 * @description Set project root dir (used for logging root path - file appender using this for directory setting)
 *      to redirect from dist to root of project
 *
 * @export
 * @param {string} rootDir Root dir to set
 */
export function setRootDir(rootDir: string): void {
    projectRootDir = rootDir;
}

/**
 * @description Add error message from process to list of errors list summary (printed in next step)
 *
 * @export
 * @param {Error} message
 */
export function addItemToErrList(message: Error): void {
    const newItem: IErrorItem = {
        errorDate: getLocalIsoDateTime(new Date()),
        error: message,
    };
    errorList.push(newItem);
    // console.error(message.message);
}

let isInitialized = false;

/**
 * @description Basic function to configure appliacation
 * @param {IConfiguration} config
 */
export async function configureLogger(config: IConfiguration): Promise<void> {
    if (isAbstractConfiguration(config)) {
        throw new Error(
            `There is no required field 'type' in configuration variable
                appenders: {
                consoleAppender: {
                type: eCoreAppenderType.console`,
        );
    }

    await parseConfigurationAppendersSection(
        config,
        layoutsFunctions,
        layoutsConfiguration,
        loggingFunctions,
    );

    parseConfigurationCategoriesSection(
        config,
        loggingFunctions,
        loggingCategories,
    );

    isInitialized = true;
}

/**
 * @description Add layout function (formater) to list of layout functions
 *
 * @export
 * @param {string} [layoutTypeName='']
 * @param {((
 *         config: ILayoutConfiguration | any,
 *     ) => (logEvent: ILoggingEvent) => any)} layoutFnc any in config here is for backward compatibility
 * @return {void}
 */
export function addLayout(
    layoutTypeName: string = '',
    layoutFnc: (config: any) => (logEvent: ILoggingEvent) => any,
): void {
    if (!layoutTypeName || layoutTypeName === '') {
        layoutTypeName = 'default';
    }

    layoutsConfiguration.set(layoutTypeName, layoutFnc);
}

/**
 * @description Get logger for requested category
 *
 * @export
 * @param {string} [category='default']
 * @return  {ILogger}
 */
export function getLogger(category: string = 'default'): ILogger {
    printErrors(errorList);

    if (!isInitialized) {
        return emptyLogger;
    }

    if (!category || category === '') {
        category = 'default';
    }

    const currentLogger = loggingCategories.get(category);

    if (currentLogger) {
        return currentLogger;
    } else {
        const err = new Error(`Unknown category ${category}`);
        console.error(err);
        throw err;
    }
}

/** @deprecated please use logLevels */
export {
    ILoggingFunctionResponse,
    eLevelName,
    eValidColors,
    logLevels as levels,
};
/** @deprecated please use TLayoutFunction */
export { TLayoutFunction as LayoutFunction };
/** @deprecated please use TLayoutFunction */
export { TLoggingFunction as AppenderFunction };
/** @deprecated please use TLayoutFunction */
export { IAppender as AppenderModule };

export { IAppender, Level, TLayoutFunction, TLoggingFunction, logLevels };

// https://stackoverflow.com/questions/45136831/node-js-require-main-module
if (require.main === module) {
    // if (esMain(import.meta)) {

    /*
    configureLogger({
        appenders: {
            consoleAppender: {
                type: eCoreAppenderType.console,
                layout: {
                    type: messageOutputType.COLORED_CONSOLE,
                    appName: config.http.nginxPrefix,
                    source: config.http.environment,
                    static: {
                        env: {
                            host: config.http.balancerHost,
                        },
                    },
                    stringFormat: {
                        colors: true,
                    },
                } as IJsonLayoutConfig,
            },
            consoleAppenderByLevel: {
                type: eCoreAppenderType.logLevelFilter,
                appender: 'consoleAppender',
                level: config.logging.console.logLevels.min,
                maxLevel: config.logging.console.logLevels.max,
            },
            stdErrAppender: {
                type: 'stderr',
                messageParam: 'msg',
                layout: {
                    type: messageOutputType.JSON,
                    appName: config.http.nginxPrefix,
                    source: config.http.environment,
                    static: {
                        env: {
                            host: config.http.balancerHost,
                        },
                    },
                } as IJsonLayoutConfig,
            },
            stdErrAppenderByLevel: {
                type: 'logLevelFilter',
                appender: 'stdErrAppender',
                level: config.logging.stdErr.logLevels.min,
                maxLevel: config.logging.stdErr.logLevels.max,
            },
            mongoAppender: {
                type: 'log4js-db-mongodb-esnext',
                mongoSetting: {
                    url: config.mongo.mongoUrl,
                    options: config.mongo.options,
                    database: 'messenger',
                    collection: 'log',
                },
                layout: {
                    type: messageOutputType.JSON,
                    appName: config.http.nginxPrefix,
                    source: config.http.environment,
                    static: {
                        env: {
                            host: config.http.balancerHost,
                        },
                    },
                },
            } as IMongoAppenderConfiguration,
            mongoAppenderByLevel: {
                type: 'logLevelFilter',
                appender: 'mongoAppender',
                level: config.logging.mongo.logLevels.min,
                maxLevel: config.logging.mongo.logLevels.max,
            },
            hangoutAlert: {
                type: '@kevit/log4js-hangout',
                layout: {
                    type: messageOutputType.HANGOUT,
                    appName: config.http.nginxPrefix,
                    source: config.http.environment,
                    static: {
                        env: {
                            host: config.http.balancerHost,
                        },
                    },
                } as IJsonLayoutConfig,
                space: config.logging.chat.roomName,
                webhookUrl: config.logging.chat.url,
            },
            hangoutAlertByLevel: {
                type: 'logLevelFilter',
                appender: 'hangoutAlert',
                level: config.logging.chat.logLevels.min,
                maxLevel: config.logging.chat.logLevels.max,
            },
            fileAppender: {
                type: 'file',
                filename: 'logs/application.log',
            },
        },
        categories: {
            default: {
                appenders: ['consoleAppenderByLevelX', 'fileAppender'],
            },
        },
    });
    */
    configureLogger({
        appenders: {
            consoleAppender: {
                type: eCoreAppenderType.console,
                layout: {
                    type: '',
                },
            },
            consoleAppenderByLevel: {
                type: eCoreAppenderType.logLevelFilter,
                appender: 'consoleAppender',
                minLevel: internalLogLevels.ALL,
                maxLevel: internalLogLevels.ERROR,
            },
            fileAppender: {
                type: eCoreAppenderType.file,
                fileName: 'logs/application.log',
                compress: true,
            },
        },
        categories: {
            default: {
                appenders: ['fileAppender'],
            },
        },
    });
    /*
    addLayoutFunction('', () => {
        return '';
    });

    await configureLogger({
        appenders: {
            consoleAppender: {
                type: eCoreAppenderType.console,
                layout: {
                    type: `colored_console`,
                    stringFormat: {
                        colors: true,
                    },
                },
            },
            mongoAppender: {
                type: `log4js-db-mongodb`,
                mongoSetting: {
                    url: `mongodb+srv://is-adapter:RS4oDEFnc6E98UFM@test.wsttp.mongodb.net/is_adapter`,
                    options: {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        ignoreUndefined: false,
                    },
                    database: `messenger`,
                    collection: `log`,
                },
            },
            mongoAppenderByLevel: {
                type: eCoreAppenderType.logLevelFilter,
                appender: `mongoAppender`,
                minLevel: logLevels.DEBUG,
                maxLevel: logLevels.FATAL,
            },
            fileAppender: {
                type: eCoreAppenderType.file,
                filename: 'logs/application.log',
            },
        },
        categories: {
            default: {
                appenders: [`fileAppender`],
                minLevel: logLevels.DEBUG,
                maxLevel: logLevels.FATAL,
            },
        },
    });

    getLogger().debug({ pokus1: { t1: `x` } });*/
}
