import * as os from 'os';
import { IErrorItem } from '../types/types';

/**
 * @description Print all errors messages from process to console. Delete showed message.
 *
 * @export
 * @param IErrorItem[] errorList
 */
export function printErrors(errorList: IErrorItem[]): void {
    const errArray: string[] = [];

    while (errorList.length > 0) {
        const errItem = errorList.pop();
        if (errItem) {
            errArray.push(`[${errItem.errorDate} : ${errItem.error}]`);
        }

        const errResultMessages = errArray.join(os.EOL);

        console.error(errResultMessages);
    }
}
