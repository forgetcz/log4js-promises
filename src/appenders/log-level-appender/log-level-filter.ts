import { loggingFunctions } from '../..';
import {
    IAbstractAppenderConfiguration,
    IAppender,
    ILoggingEvent,
    ILoggingFunctionResponse,
    LogLevelFilterAppenderConfiguration,
    TLayoutFunction,
    TLoggingFunction,
} from '../../types/types';

let localAppenderConfig: LogLevelFilterAppenderConfiguration;
// let localLayoutFunction: TLayoutFunction | undefined;

async function loggingEvent(
    loggingEvent: ILoggingEvent,
): Promise<ILoggingFunctionResponse> {
    const nextLayoutFnc = loggingFunctions.get(localAppenderConfig.appender);

    if (nextLayoutFnc) {
        const nextLoggerResponse = await nextLayoutFnc(loggingEvent);

        return {
            loggerName: localAppenderConfig.type,
            loggerResponse: {
                event: loggingEvent,
                layoutTransformation:
                    nextLoggerResponse.loggerResponse?.layoutTransformation,
            },
            error: nextLoggerResponse.error,
        };
    } else {
        return {
            loggerName: localAppenderConfig.type,
            loggerResponse: {
                event: loggingEvent,
                layoutTransformation: undefined,
            },
        };
    }
}

export const logLevelAppender: IAppender = {
    configure: function (
        config: IAbstractAppenderConfiguration,
        _layoutFunction: TLayoutFunction | undefined,
    ): TLoggingFunction {
        localAppenderConfig = config as LogLevelFilterAppenderConfiguration;
        // localLayoutFunction = layoutFunction;
        return loggingEvent;
    },
};
