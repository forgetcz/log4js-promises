// import esMain from 'es-main'; "es-main": "^1.3.0"
import * as os from 'os';
import * as log4js from '../../../index';
import { logLevels } from '../../../classes/level';

async function runTest(): Promise<void> {
    // if (esMain(import.meta)) {
    // log4js.addLayout(messageOutputType.JSON, jsonLayout);

    await log4js.configureLogger({
        appenders: {
            mongoAppender: {
                type: 'log4js-db-mongodb-esnext',
                mongoSetting: {
                    url: 'mongodb+srv://logging:iyBQ4FxqWOHwQiOI@test.wsttp.mongodb.net/messenger',
                    options: {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        ignoreUndefined: false,
                    },
                    database: 'messenger',
                    collection: 'log',
                },
                layout: {
                    type: 'JSON',
                    appName: ' app test',
                    source: 'test',
                    static: {
                        env: {
                            host: 'host',
                            type: os.platform(),
                            hostname: os.hostname(),
                        },
                    },
                },
            },
        },
        categories: {
            default: {
                appenders: [`mongoAppender`],
                minLevel: logLevels.DEBUG,
                maxLevel: logLevels.FATAL,
            },
        },
    });

    const input = { log: '', in: { c: 1 } };
    const logger = log4js.getLogger();
    const debugFnc = logger.debug(input);
    Promise.allSettled(debugFnc).then((_res) => {
        console.debug(_res);
        /* if (res.length && ) {
            const consoleDebugResponse = res.filter(
                (f) => f.loggerName === 'log4js-db-mongodb',
            );
            if (consoleDebugResponse) {
                if (
                    res.length === 0 &&
                    JSON.stringify(input) !==
                        JSON.stringify(consoleDebugResponse)
                ) {
                    console.error('Error here');
                }
            }
        }*/
    });
}

if (require.main === module) {
    runTest();
}
