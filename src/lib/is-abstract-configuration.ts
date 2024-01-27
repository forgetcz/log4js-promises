import { IAbstractAppenderConfiguration } from '../types/types';

/**
 * @description Test if input object is type of configuration (atribut type is present)
 *  If configuration do not includes type, then this is not valid configuration
 *
 * @export
 * @param {*} configuration
 * @return {configuration is IAbstractAppenderConfiguration}
 */
export function isAbstractConfiguration(
    configuration: any,
): configuration is IAbstractAppenderConfiguration {
    const type = (<IAbstractAppenderConfiguration>configuration).type;
    return type !== undefined && type?.length > 0;
}
