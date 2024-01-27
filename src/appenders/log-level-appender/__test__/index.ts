// import esMain from 'es-main'; "es-main": "^1.3.0"
import { logLevels } from '../../../classes/level';
import * as log4js from '../../../index';
import { eCoreAppenderType } from '../../../types/enums';
import { IPromiseResult } from '../../../types/types';

async function runIt(): Promise<void> {
    await log4js.configureLogger({
        appenders: {
            console: {
                type: eCoreAppenderType.console,
                minLevel: logLevels.WARN,
                maxLevel: logLevels.FATAL,
            },
            logLevel: {
                type: eCoreAppenderType.logLevelFilter,
                appender: eCoreAppenderType.console,
            },
        },
        categories: {
            default: {
                appenders: [`logLevel`],
                minLevel: logLevels.DEBUG,
                maxLevel: logLevels.ERROR,
            },
        },
    });

    const input = { log: '', in: { c: 1 } };
    const logger = log4js.getLogger();
    const debugFnc = logger.debug(input);

    const promisesRes = (await Promise.allSettled(
        debugFnc,
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
    /* Promise.allSettled(debugFnc).then((res) => {
        const errPromises = res.filter((f) => f.status === 'rejected');
        const okPromises = res.filter((f) => f.status === 'fulfilled');

        const logLevelResponse = okPromises.values;
        logLevelResponse.
        .filter(
            (f) => f.loggerName === eCoreAppenderType.logLevelFilter,
        );
        if (logLevelResponse) {
            if (
                res.length === 0 &&
                JSON.stringify(input) !== JSON.stringify(logLevelResponse)
            ) {
                console.error('Error here');
            }
        }
    });*/
}

if (require.main === module) {
    // if (esMain(import.meta)) {
    runIt();
}
