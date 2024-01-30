# log4js-promises

This is a next possible conversion of the log4j framework to work with node. It is a also alternative for original template for this project [log4js](https://www.npmjs.com/package/log4js). Main differences between [log4js](https://www.npmjs.com/package/log4js) and this project is, that this is full promised based and strongly typed project (minimize of using any). Full ready for esnext.

The full documentation is available [here](https://github.com/forgetcz/log4js-promises).

# Internal implementation of appenders:

-   console
-   file
-   std-err
-   loglevel
-   custom

# Example of custom appenders:

-   [log4js-appender-rest](https://www.npmjs.com/package/og4js-appender-rest)
-   [log4js-db-mongodb-esnext](https://www.npmjs.com/package/log4js-db-mongodb-esnext)
-   [log4js-appender-google-hangout](https://www.npmjs.com/package/log4js-appender-google-hangout)

# Layout formating is also possible here

-   [log4js-layouts](https://www.npmjs.com/package/log4js-layouts)

# Simple example

```bash
npm i log4js-promises
```

```TypeScript
import { configureLogger, getLogger, logLevels } from 'log4js-node-next';
import { eCoreAppenderType } from 'log4js-node-next/dist/types/enums.js';

if (require.main === module) {
    configureLogger({
        appenders: {
            consoleAppender: {
                type: eCoreAppenderType.console,
            },
        },
        categories: {
            default: {
                appenders: [`consoleAppender`],
                minLevel: logLevels.DEBUG,
                maxLevel: logLevels.FATAL,
            },
        },
    })
        .then(() => {
            const logger = getLogger();
            const debugFunctions = logger.debug('Debug message...');

            Promise.allSettled(debugFunctions).then((res) => {
                const resErr = res.filter((f) => f.status === 'rejected');

                if (resErr.length > 0) {
                    console.error('There is a error in debugger processing');
                }
            });
        })
        .catch((err) => {
            console.error(err);
        });
}
```

```bash
[2024-01-28T16:56:57.745] [DEBUG] [default] - "This is a message"
```
