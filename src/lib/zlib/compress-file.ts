import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { createGzip } from 'node:zlib';

// const gzip = createGzip();
// const source = createReadStream('input.txt');
// const destination = createWriteStream('input.txt.gz');

/* pipeline(source, gzip, destination, (err) => {
    if (err) {
        console.error('An error occurred:', err);
        process.exitCode = 1;
    }
});*/

// Or, Promisified

const pipe = promisify(pipeline);

/**
 * https://nodejs.org/api/zlib.html
 *
 * @export
 * @param {string} inputFile
 * @param {string} outputFile
 * @return {Promise<any>}
 */
export async function doGzip(
    inputFile: string,
    outputFile: string,
): Promise<any> {
    const gzip = createGzip();
    const source = createReadStream(inputFile);
    const destination = createWriteStream(outputFile);
    await pipe(source, gzip, destination);
}
/*
doGzip('input.txt', 'input.txt.gz').catch((err) => {
    console.error('An error occurred:', err);
    process.exitCode = 1;
});
*/
/*
if (require.main === module) {
    doGzip('logs/log1X.log', 'logs/log1.log.gz');
}
*/
