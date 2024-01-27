// import esMain from 'es-main'; "es-main": "^1.3.0"
import { logLevels } from '../../../classes/level';
import * as log4js from '../../../index';
import { eCoreAppenderType } from '../../../types/enums';
import { IPromiseResult } from '../../../types/types';

async function runTest(): Promise<void> {
    await log4js.configureLogger({
        appenders: {
            fileAppender: {
                type: eCoreAppenderType.file,
                fileName: 'logs/ccccc/dddddd/eeeee/application.log',
                compress: true,
                multiFile: true,
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

    const input = { log: '', in: { c: 1 } };
    const logger = log4js.getLogger();
    const debugFnc = logger.debug(input);

    const promisesRes = (await Promise.allSettled(
        debugFnc,
    )) as IPromiseResult<log4js.ILoggingFunctionResponse>[];

    const resErr = promisesRes.filter((f) => f.status === 'rejected');

    if (resErr.length > 0) {
        console.error('There is a error in processing');
    }

    const fileResponse = promisesRes
        .filter((f) => f.status === 'fulfilled')
        .find((f) => f.value.loggerName === eCoreAppenderType.file);

    if (fileResponse) {
        if (
            JSON.stringify(input) !==
            JSON.stringify(fileResponse.value.loggerResponse?.event.data[0])
        ) {
            console.error('Error here');
        }
    }
}

if (require.main === module) {
    runTest(); // if (esMain(import.meta)) {
}
