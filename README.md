# log4js-promises

This is a next possible conversion of the log4j framework to work with node. It is a also alternative for original template for this project [log4js](https://www.npmjs.com/package/log4js). Main differences between [log4js](https://www.npmjs.com/package/log4js) and this project is, that this is full promised based and strongly typed project (minimize of using any) full ready for esnext.

The full documentation is available [here](https://github.com/forgetcz/log4js-promises).

# Internal implementation of appenders:

-   console
-   file
-   std-err
-   loglevel
-   custom

# Example of custom appenders:

-   [log4js-appender-rest](https://www.npmjs.com/package/og4js-appender-rest)
-   [log4js-appender-mongodb](https://www.npmjs.com/package/log4js-appender-mongodb)
-   [log4js-appender-google-hangout](https://www.npmjs.com/package/og4js-appender-google-hangout)

# Simple example

```TypeScript
if (require.main === module) {
    configureLogger({
        appenders: {
            consoleAppender: {
                type: eCoreAppenderType.console,
                layout: {
                    type: 'COLORED_CONSOLE',
                    appName: 'appName',
                    source: 'develop',
                    static: {
                        env: {
                            host: 'config.http.balancerHost',
                        },
                    },
                    stringFormat: {
                        colors: true,
                    },
                },
            },
            consoleAppenderByLevel: {
                type: eCoreAppenderType.logLevelFilter,
                appender: 'consoleAppender',
                monLevel: logLevels.DEBUG,
                maxLevel: logLevels.ERROR,
            },
        },
        categories: {
            default: {
                appenders: ['consoleAppenderByLevel'],
            },
        },
    })
        .then(() => {
            const logger = getLogger();
            logger.debug('This is a message');
        })
        .catch((err) => {
            console.debug(err);
        });
}
```

```bash
[2024-01-28T16:56:57.745] [DEBUG] [default] - "This is a message"
```
