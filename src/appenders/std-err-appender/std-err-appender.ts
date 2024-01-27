import * as os from 'os';
import {
    IAbstractAppenderConfiguration,
    IAppender,
    ILoggingEvent,
    ILoggingFunctionResponse,
    TLayoutFunction,
    TLoggingFunction,
} from '../../types/types';

let localAppenderConfig: IAbstractAppenderConfiguration;
let localLayoutFunction: TLayoutFunction | undefined;

async function loggingEvent(
    loggingEvent: ILoggingEvent,
): Promise<ILoggingFunctionResponse> {
    if (localLayoutFunction) {
        const layoutResult = localLayoutFunction(loggingEvent);
        process.stderr.write(`${layoutResult}${os.EOL}`);
        return {
            loggerName: localAppenderConfig.type,
            loggerResponse: {
                event: loggingEvent,
                layoutTransformation: layoutResult,
            },
        };
    } else {
        const strData = loggingEvent.toString();
        process.stderr.write(strData);

        return {
            loggerName: localAppenderConfig.type,
            loggerResponse: {
                event: loggingEvent,
                layoutTransformation: undefined,
            },
        };
    }
}

export const stdErrAppender: IAppender = {
    configure: function (
        config: IAbstractAppenderConfiguration,
        layoutFunction: TLayoutFunction | undefined,
    ): TLoggingFunction {
        localAppenderConfig = config;
        localLayoutFunction = layoutFunction;
        return loggingEvent;
    },
};
