import * as os from 'os';
import { logLevels } from '../../../classes/level';
import * as log4js from '../../../index';
import { eCoreAppenderType } from '../../../types/enums';
import { IPromiseResult } from '../../../types/types';

async function runTest(): Promise<void> {
    await log4js.configureLogger({
        appenders: {
            consoleAppender: {
                type: eCoreAppenderType.console,
                layout: {
                    type: 'COLORED_CONSOLE',
                    appName: 'self-log4js-testing',
                    source: 'DEVELOPMENT',
                    static: {
                        env: {
                            host: 'server a',
                            type: os.platform(),
                            hostname: os.hostname(),
                        },
                    },
                    stringFormat: {
                        colors: true,
                    },
                },
            },
        },
        categories: {
            default: {
                appenders: [`consoleAppender`],
                minLevel: logLevels.DEBUG,
                maxLevel: logLevels.FATAL,
            },
        },
    });

    const input = { log: '', in: { c: 1 } };
    const logger = log4js.getLogger();
    const debugFnc = logger.debug(input, input, input);

    Promise.allSettled(debugFnc).then((res) => {
        console.debug(res);
    });

    const promisesRes = (await Promise.allSettled(
        logger.debug(`xxxxx`),
    )) as IPromiseResult<log4js.ILoggingFunctionResponse>[];

    promisesRes
        .filter((f) => f.status === 'fulfilled')
        .forEach((fe) => {
            console.debug(fe.status, fe.value);
        });

    promisesRes
        .filter((f) => f.status === 'rejected')
        .forEach((fe) => {
            console.debug(fe.status, fe.reason);
        });
}

if (require.main === module) {
    runTest();
    // if (esMain(import.meta)) {
    // log4js.addLayout(messageOutputType.COLORED_CONSOLE, coloredConsoleLayout);
}
