import { addItemToErrList } from '..';
import { consoleAppender } from '../appenders/console-appender/console-appender';
import { fileAppender } from '../appenders/file-appender/file-appender';
import { logLevelAppender } from '../appenders/log-level-appender/log-level-filter';
import { noLogAppender } from '../appenders/no-logger-appender/no-logger-appender';
import { stdErrAppender } from '../appenders/std-err-appender/std-err-appender';
import { eCoreAppenderType } from '../types/enums';
import {
    IAppender,
    IConfiguration,
    ILayoutConfiguration,
    ILoggingEvent,
    TLayoutFunction,
    TLoggingFunction,
} from '../types/types';

/**
 * @description Parse configuration appenders section { appenders:{...} }
 *
 * @export
 * @param {IConfiguration} config Full config
 * @param {Map<string, TLayoutFunction>} layoutsFunctions List of layout configuration allready registred on system. This must be known before config is loaded !!!
 * @param {Map<string, TLoggingFunction>} loggingFunctions
 * @return {Promise<Map<string, IAppender>>}
 */
export async function parseConfigurationAppendersSection(
    config: IConfiguration,
    layoutsFunctions: Map<string, TLayoutFunction>,
    layoutConfigurations: Map<
        string,
        (config: ILayoutConfiguration) => (logEvent: ILoggingEvent) => any
    >,
    loggingFunctions: Map<string, TLoggingFunction>,
): Promise<void> {
    // const appenderConfigurations = new Map<string, IAppender>();
    const appenderNames = Object.keys(config.appenders);
    const eCoreAppenderKeyNames = Object.keys(eCoreAppenderType);

    // NoLogger is defined as default
    const loggingFunction = noLogAppender.configure({} as any, {} as any);
    loggingFunctions.set(eCoreAppenderType.noLogFilter, loggingFunction);
    // appenderConfigurations.set(eCoreAppenderType.noLogFilter, noLogAppender);

    for (const appenderName of appenderNames) {
        const appenderConfig = config.appenders[appenderName];
        let appenderType: eCoreAppenderType | undefined = undefined;

        if (eCoreAppenderKeyNames.includes(appenderConfig.type)) {
            appenderType = appenderConfig.type as eCoreAppenderType;
        }

        let layoutFunction: TLayoutFunction | undefined = undefined;

        if (appenderConfig.layout) {
            const layoutConfig = appenderConfig.layout as ILayoutConfiguration;
            const layoutType = layoutConfig.type;
            const layoutConfiguration = layoutConfigurations.get(layoutType);
            if (layoutConfiguration) {
                layoutFunction = layoutConfiguration(layoutConfig);
                layoutsFunctions.set(layoutConfig.type, layoutFunction);
            }
        }

        if (appenderType) {
            switch (appenderType) {
                case eCoreAppenderType.console: {
                    const loggingFunction = consoleAppender.configure(
                        appenderConfig,
                        layoutFunction,
                    );
                    loggingFunctions.set(appenderName, loggingFunction);
                    // appenderConfigurations.set(appenderName, consoleAppender);
                    break;
                }
                case eCoreAppenderType.logLevelFilter: {
                    const loggingFunction = logLevelAppender.configure(
                        appenderConfig,
                        layoutFunction,
                    );
                    loggingFunctions.set(appenderName, loggingFunction);
                    // appenderConfigurations.set(appenderName, logLevelAppender);
                    break;
                }
                case eCoreAppenderType.file: {
                    const loggingFunction = fileAppender.configure(
                        appenderConfig,
                        layoutFunction,
                    );
                    loggingFunctions.set(appenderName, loggingFunction);
                    // appenderConfigurations.set(appenderName, fileAppender);
                    break;
                }
                case eCoreAppenderType.stderr: {
                    const loggingFunction = stdErrAppender.configure(
                        appenderConfig,
                        layoutFunction,
                    );
                    loggingFunctions.set(appenderName, loggingFunction);
                    // appenderConfigurations.set(appenderName, fileAppender);
                    break;
                }
                default: {
                    const message = `Appender ${appenderConfig.type} not initialized `;
                    addItemToErrList(new Error(message));
                }
            }
        } else {
            try {
                const externalModuleAppender = (await import(
                    appenderConfig.type
                )) as IAppender;

                const loggingFunction = externalModuleAppender.configure(
                    appenderConfig,
                    layoutFunction,
                );
                loggingFunctions.set(appenderName, loggingFunction);
                /* appenderConfigurations.set(
                    appenderName,
                    externalModuleAppender,
                );*/
            } catch (error) {
                addItemToErrList(error as Error);
            }
        }
    }

    // return appenderConfigurations;
}
