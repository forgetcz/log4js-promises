import {
    IAbstractAppenderConfiguration,
    IAppender,
    ILoggingEvent,
    ILoggingFunctionResponse,
    TLayoutFunction,
    TLoggingFunction,
} from '../../types/types';

// let localLayoutFunction: TLayoutFunction | undefined;
let localAppenderConfig: IAbstractAppenderConfiguration;

async function loggingEvent(
    loggingEvent: ILoggingEvent,
): Promise<ILoggingFunctionResponse> {
    return {
        loggerName: localAppenderConfig.type,
        loggerResponse: {
            event: loggingEvent,
            layoutTransformation: undefined,
        },
    };
}

export const noLogAppender: IAppender = {
    configure: function (
        config: IAbstractAppenderConfiguration,
        _layoutFunction: TLayoutFunction | undefined,
    ): TLoggingFunction {
        // localLayoutFunction = layoutFunction;
        localAppenderConfig = config;
        return loggingEvent;
    },
};
