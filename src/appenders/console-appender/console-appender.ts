import { eCoreAppenderType } from '../../types/enums';
import {
    IAbstractAppenderConfiguration,
    IAppender,
    ILoggingEvent,
    ILoggingFunctionResponse,
    TLayoutFunction,
    TLoggingFunction,
} from '../../types/types';

let localLayoutFunction: TLayoutFunction | undefined;
let localAppenderConfig: IAbstractAppenderConfiguration;

const consoleLog = console.log.bind(console);

async function logEvent(
    loggingEvent: ILoggingEvent,
): Promise<ILoggingFunctionResponse> {
    if (localLayoutFunction) {
        const layoutResult = localLayoutFunction(loggingEvent);
        consoleLog(layoutResult);

        return {
            loggerName: eCoreAppenderType.console,
            loggerResponse: {
                event: loggingEvent,
                layoutTransformation: layoutResult,
            },
        };
    } else {
        const strData: string = loggingEvent.toString();
        consoleLog(strData);

        return {
            loggerName: localAppenderConfig.type,
            loggerResponse: {
                event: loggingEvent,
                layoutTransformation: strData,
            },
        };
    }
}

export const consoleAppender: IAppender = {
    configure: function (
        appenderConfig: IAbstractAppenderConfiguration,
        layoutFunction: TLayoutFunction | undefined,
    ): TLoggingFunction {
        localAppenderConfig = appenderConfig;
        localLayoutFunction = layoutFunction;

        return logEvent;
    },
};
