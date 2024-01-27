import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
// import * as util from 'util';
import * as path from 'path';
import { addItemToErrList, projectRootDir } from '../..';
import { doGzip } from '../../lib/zlib/compress-file';
import {
    IAbstractAppenderConfiguration,
    IAppender,
    IFileAppenderConfiguration,
    ILoggingEvent,
    ILoggingFunctionResponse,
    TLayoutFunction,
    TLoggingFunction,
} from '../../types/types';
import { getFileDateStat } from '../../lib/fs/fs';

let localDirName: string = '';
let localFileName: string = '';

let localAppenderConfig: IFileAppenderConfiguration;
let localLayoutFunction: TLayoutFunction | undefined;

/** @description / */
const pathSeparator = path.sep;

async function createDirectoryTree(): Promise<void> {
    // const existsAsync = util.promisify(fs.existsSync);
    // const mkdirAsync = util.promisify(fs.mkdirSync);

    // console.debug(__dirname, __filename);

    if (fs.existsSync(localDirName)) {
        return;
    }

    const directoryPath = localDirName.split(pathSeparator);
    let currentPath: string = '';

    for (let x = 0; x < directoryPath.length - 1; x++) {
        try {
            if (currentPath.length > 0) {
                currentPath = currentPath + pathSeparator;
            }

            currentPath += directoryPath[x];
            const exists = fs.existsSync(currentPath);
            if (!exists) {
                await fsPromises.mkdir(currentPath, undefined);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

async function asyncWriteFile(loggingEvent: ILoggingEvent): Promise<any> {
    // const existsAsync = util.promisify(fs.existsSync);
    const currentDateTime = new Date();

    await createDirectoryTree();

    let writeData: string = '';

    if (localLayoutFunction) {
        writeData = localLayoutFunction(loggingEvent);
    } else {
        writeData = loggingEvent.toString();
    }

    try {
        const fullLocalLogFile = join(localDirName, path.sep, localFileName);
        const fileExists = fs.existsSync(fullLocalLogFile);

        if (fileExists) {
            if (
                localAppenderConfig.multiFile === false ||
                localAppenderConfig.multiFile === true
            ) {
                const stat = await getFileDateStat(fullLocalLogFile);
                const diff =
                    currentDateTime.toISOString().split('T')[0] !==
                    stat.lastModified.toISOString().split('T')[0];

                if (diff) {
                    const fileDatePart = currentDateTime
                        .toISOString()
                        .substring(0, 10); // -> 2023-12-02

                    if (localAppenderConfig.compress) {
                        const zipFile = join(
                            localDirName,
                            path.sep +
                                localFileName +
                                '_' +
                                fileDatePart +
                                '.gz',
                        );

                        try {
                            await doGzip(fullLocalLogFile, zipFile);
                            await fsPromises.unlink(
                                localDirName + path.sep + localFileName,
                            );
                        } catch (error) {
                            if (error instanceof Error) {
                                addItemToErrList(error);
                            } else {
                                console.debug(
                                    JSON.stringify(error, undefined, 4),
                                );
                            }
                        }
                    } else {
                        const oldLocalFileName =
                            localFileName + '_' + fileDatePart;
                        const fullOldLocalLogFile = join(
                            localDirName,
                            path.sep,
                            oldLocalFileName,
                        );

                        await fsPromises.rename(
                            fullLocalLogFile,
                            fullOldLocalLogFile,
                        );
                    }
                }
            }
        }

        /**
         * flags:
         *  - w  = Open file for reading and writing. File is created if not exists
         *  - a+ = Open file for reading and appending. The file is created if not exists
         */
        let flagMode: string = 'w';

        if (fileExists) {
            flagMode = 'a+';
        }

        await fsPromises.writeFile(fullLocalLogFile, writeData, {
            flag: flagMode,
        });

        return writeData;
    } catch (err) {
        console.error(err);
        if (err instanceof Error) {
            return err.message;
        } else {
            return err;
        }
    }
}

async function loggingEvent(
    loggingEvent: ILoggingEvent,
): Promise<ILoggingFunctionResponse> {
    // (async (): Promise<any> => {
    const fileResult = await asyncWriteFile(loggingEvent);
    return {
        loggerName: localAppenderConfig.type,
        loggerResponse: {
            event: loggingEvent,
            layoutTransformation: fileResult,
        },
    };
    // })();
}

export const fileAppender: IAppender = {
    configure: function (
        appenderConfig: IAbstractAppenderConfiguration,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        layoutFunction: TLayoutFunction | undefined,
    ): TLoggingFunction {
        localAppenderConfig = appenderConfig as IFileAppenderConfiguration;

        let projLogDirectory = projectRootDir;

        if (projLogDirectory.endsWith('dist')) {
            projLogDirectory = projLogDirectory.substring(
                0,
                projLogDirectory.length - 4,
            );
        }

        localAppenderConfig.fileName = localAppenderConfig.fileName
            .replaceAll('\\', path.sep) // tsconfig : "lib": [..., "ES2021.String", ...],
            .replaceAll('/', path.sep);

        localAppenderConfig.fileName =
            projLogDirectory + localAppenderConfig.fileName;

        const splitPath = localAppenderConfig.fileName.split(pathSeparator);

        localFileName = splitPath[splitPath.length - 1];
        splitPath.pop();
        localDirName = splitPath.join(path.sep);
        localLayoutFunction = layoutFunction;
        return loggingEvent;
    },
};
