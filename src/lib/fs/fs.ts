// import * as fs from 'fs';
// import * as util from 'util';
import { promises as fsPromises } from 'fs';

export interface FileStat {
    lastModified: Date;
    lastAccessed: Date;
    fileCreatedAt: Date;
    lastStatusChange: Date;
}

/**
 * @description Get file information about file
 * @param {string} filepath Full file path to file we want to get information about
 * @returns {FileStat}
 */
export async function getFileDateStat(filepath: string): Promise<FileStat> {
    // const statPromise = util.promisify(fs.stat);
    const stats = await fsPromises.stat(filepath);
    // const stats = fs.statSync(filepath);

    // console.log(stats);

    return {
        lastModified: stats.mtime,
        lastAccessed: stats.atime,
        lastStatusChange: stats.ctime,
        fileCreatedAt: stats.birthtime,
    };
}
