import { ILogLevel } from '../types/types';

/**
 * @description Returns if level is in interval
 *
 * @export
 * @param {ILogLevel} requiredLevel
 * @param {ILogLevel} [minLevel]
 * @param {ILogLevel} [maxLevel]
 * @return {(boolean | undefined)}
 */
export function isLogEnabledByMinMaxLevel(
    requiredLevel: ILogLevel,
    minLevel?: ILogLevel,
    maxLevel?: ILogLevel,
): boolean | undefined {
    let logEnabled: boolean | undefined = undefined;

    if (minLevel) {
        logEnabled = minLevel.isLessThanOrEqualTo(requiredLevel);
        if (!logEnabled) {
            return logEnabled;
        }
    }

    if (maxLevel) {
        logEnabled = maxLevel.isGreaterThanOrEqualTo(requiredLevel);
    }

    return logEnabled;
}
