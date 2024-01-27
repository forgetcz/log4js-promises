import { EOL } from 'os';
import { logLevels } from '../classes/level';
import { getLocalIsoDateTime } from '../lib/get-local-iso-time';
import { printErrors } from '../lib/print-errors';
import { sendEventToLoggingFunction } from '../lib/send-event-to-logging-function';
import {
    IConfiguration,
    ILogger,
    ILoggingEvent,
    ILoggingFunctionResponse,
    TLoggingFunction,
} from '../types/types';
import { errorList } from '..';

const emptyResponse: ILoggingFunctionResponse = {
    loggerName: '',
    loggerResponse: {
        event: {
            categoryName: '',
            appenderNames: [''],
            level: logLevels.DEBUG,
            startTime: new Date(),
            pid: 0,
            data: [],
        },
        layoutTransformation: undefined,
    },
};

export const emptyLogger: ILogger = {
    debug: (_message: any, ..._args: any[]) => {
        return [Promise.resolve(emptyResponse)];
    },
    info: (_message: any, ..._args: any[]) => {
        return [Promise.resolve(emptyResponse)];
    },
    warn: (_message: any, ..._args: any[]) => {
        return [Promise.resolve(emptyResponse)];
    },
    error: (_message: any, ..._args: any[]) => {
        return [Promise.resolve(emptyResponse)];
    },
    fatal: (_message: any, ..._args: any[]) => {
        return [Promise.resolve(emptyResponse)];
    },
    trace: (_message: any, ..._args: any[]) => {
        return [Promise.resolve(emptyResponse)];
    },
    mark: (_message: any, ..._args: any[]) => {
        return [Promise.resolve(emptyResponse)];
    },
};

/**
 * @description Parse configuration categories section { categories : {...} }
 *
 * @export
 * @param {IConfiguration} config
 * @param {Map<string, TLoggingFunction>} loggingFunctions
 * @param {Map<string, ILogger>} loggingCategories
 */
export function parseConfigurationCategoriesSection(
    config: IConfiguration,
    loggingFunctions: Map<string, TLoggingFunction>,
    loggingCategories: Map<string, ILogger>,
): void {
    if (config.categories) {
        const categoryNames = Object.keys(config.categories);

        for (const categoryName of categoryNames) {
            const currentCategory = config.categories[categoryName];

            const loggingEvent: ILoggingEvent = {
                startTime: new Date(),
                categoryName: categoryName,
                appenderNames: currentCategory.appenders,
                level: logLevels.ALL,
                data: [],
                pid: process.pid,
                error: new Error(),
                toString: () => {
                    let strData: string = '';
                    for (const dataItem of loggingEvent.data) {
                        if (strData.length > 0) {
                            strData += `,${EOL}`;
                        }
                        strData += JSON.stringify(dataItem, undefined, 4);
                    }

                    // [2023-09-22T04:57:28.627Z] [INFO] default - Server is running: ..
                    const strDate = getLocalIsoDateTime(loggingEvent.startTime);
                    strData = `[${strDate}] [${loggingEvent.level}] ${loggingEvent.categoryName} - ${strData}`;

                    return strData;
                },
            };

            const newLogger: ILogger = {
                debug: (message: any, ...args: any[]) => {
                    printErrors(errorList);

                    loggingEvent.data = [...[message], ...args];
                    loggingEvent.level = logLevels.DEBUG;
                    return sendEventToLoggingFunction(
                        currentCategory,
                        loggingEvent,
                        config,
                        loggingFunctions,
                    );
                },
                info: (message: any, ...args: any[]) => {
                    printErrors(errorList);

                    loggingEvent.data = [...[message], ...args];
                    loggingEvent.level = logLevels.INFO;
                    return sendEventToLoggingFunction(
                        currentCategory,
                        loggingEvent,
                        config,
                        loggingFunctions,
                    );
                },
                warn: (message: any, ...args: any[]) => {
                    printErrors(errorList);

                    loggingEvent.data = [...[message], ...args];
                    loggingEvent.level = logLevels.WARN;
                    return sendEventToLoggingFunction(
                        currentCategory,
                        loggingEvent,
                        config,
                        loggingFunctions,
                    );
                },
                error: (message: any, ...args: any[]) => {
                    printErrors(errorList);

                    loggingEvent.data = [...[message], ...args];
                    loggingEvent.level = logLevels.ERROR;
                    return sendEventToLoggingFunction(
                        currentCategory,
                        loggingEvent,
                        config,
                        loggingFunctions,
                    );
                },
                fatal: (message: any, ...args: any[]) => {
                    printErrors(errorList);

                    loggingEvent.data = [...[message], ...args];
                    loggingEvent.level = logLevels.FATAL;
                    return sendEventToLoggingFunction(
                        currentCategory,
                        loggingEvent,
                        config,
                        loggingFunctions,
                    );
                },
                trace: (message: any, ...args: any[]) => {
                    printErrors(errorList);

                    loggingEvent.data = [...[message], ...args];
                    loggingEvent.level = logLevels.TRACE;
                    return sendEventToLoggingFunction(
                        currentCategory,
                        loggingEvent,
                        config,
                        loggingFunctions,
                    );
                },
                mark: (message: any, ...args: any[]) => {
                    printErrors(errorList);

                    loggingEvent.data = [...[message], ...args];
                    loggingEvent.level = logLevels.MARK;
                    return sendEventToLoggingFunction(
                        currentCategory,
                        loggingEvent,
                        config,
                        loggingFunctions,
                    );
                },
            };

            loggingCategories.set(categoryName, newLogger);
            /* for (const appenderName of currentCategory.appenders) {
                const appender = appendersConfigurations.get(appenderName);
                if (!appender) {
                    const message = `Unknown appender name '${appenderName}' in array { categories : ${categoryName} : { appenders: ['${appenderName}'] }}
                        or appender can be wrong initialized.`;
                    addItemToErrList(new Error(message));
                    continue;
                }

                const loggingEvent: ILoggingEvent = {
                    startTime: new Date(),
                    categoryName: categoryName,
                    appenderNames: appenderName,
                    level: logLevels.ALL,
                    data: [],
                    pid: process.pid,
                    error: new Error(),
                    toString: () => {
                        let strData: string = '';
                        for (const dataItem of loggingEvent.data) {
                            if (strData.length > 0) {
                                strData += `,${EOL}`;
                            }
                            strData += JSON.stringify(dataItem, undefined, 4);
                        }

                        // [2023-09-22T04:57:28.627Z] [INFO] default - Server is running: ..
                        const strDate = getLocalIsoDateTime(
                            loggingEvent.startTime,
                        );
                        strData = `[${strDate}] [${loggingEvent.level}] ${loggingEvent.categoryName} - ${strData}`;

                        return strData;
                    },
                };
            }*/
        }
    }
}
