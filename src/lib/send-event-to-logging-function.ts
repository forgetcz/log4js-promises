import { addItemToErrList } from '..';
import { logLevels } from '../classes/level';
import {
    IAbstractAppenderConfiguration,
    ICategoryConfiguration,
    IConfiguration,
    ILoggingEvent,
    ILoggingFunctionResponse,
    TLoggingFunction,
} from '../types/types';
import { isLogEnabledByMinMaxLevel } from './is-log-enabled-by-category';

/**
 * @description This function sent event (message) to appenders functions to process logging
 *
 * @export
 * @param {ICategoryConfiguration} category { category : {...}} part of configuration
 * @param {ILoggingEvent} loggingEvent Event from debug/info/warning/error message
 * @param {IConfiguration} config Full log4js-promise configuratiom
 * @param {Map<string, TLoggingFunction>} loggingFunctions
 * @return {Promise<ILoggingFunctionResponse>[]}
 */
export function sendEventToLoggingFunction(
    category: ICategoryConfiguration,
    loggingEvent: ILoggingEvent,
    config: IConfiguration,
    loggingFunctions: Map<string, TLoggingFunction>,
): Promise<ILoggingFunctionResponse>[] {
    const logEnabledByCategory = isLogEnabledByMinMaxLevel(
        loggingEvent.level,
        category.minLevel,
        category.maxLevel,
    );

    const logFunctions: TLoggingFunction[] = [];

    if (logEnabledByCategory === undefined || logEnabledByCategory === true) {
        for (const appenderName of category.appenders) {
            const loggingFunction = loggingFunctions.get(
                appenderName,
            ) as TLoggingFunction;

            let logEnabledByAppenderLevel: boolean | undefined = undefined;

            if (logEnabledByCategory === undefined) {
                const appenderConfig = config.appenders[
                    appenderName
                ] as IAbstractAppenderConfiguration;

                logEnabledByAppenderLevel = isLogEnabledByMinMaxLevel(
                    logLevels.DEBUG,
                    appenderConfig?.minLevel,
                    appenderConfig?.maxLevel,
                );
            }

            if (
                logEnabledByCategory === undefined ||
                logEnabledByCategory === true ||
                logEnabledByAppenderLevel === undefined ||
                logEnabledByAppenderLevel === true
            ) {
                logFunctions.push(loggingFunction);
            }
        }
    }

    const loggingFunctionResults: Promise<ILoggingFunctionResponse>[] = [];
    /* This is here for development mode only !
    try {
        for (const logFnc of logFunctions) {
            loggingFunctionResults.push(logFnc(loggingEvent));
        }
    } catch (error) {
        if (error instanceof Error) {
            addItemToErrList(error);
        } else {
            console.error(error);
        }
    }*/

    logFunctions.forEach((logFnc) => {
        try {
            loggingFunctionResults.push(logFnc(loggingEvent));
        } catch (error) {
            if (error instanceof Error) {
                addItemToErrList(error);
            } else {
                console.error(error);
            }
        }
    });

    return loggingFunctionResults;
}
