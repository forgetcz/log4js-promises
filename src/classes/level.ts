import { eLevelName, eValidColors } from '../types/enums';
import { ILogLevel, ILogLevels } from '../types/types';

export class Level implements ILogLevel {
    levelNumber: number;
    levelStr: eLevelName;
    color: eValidColors;

    constructor(
        levelNumber: number,
        color: eValidColors,
        levelStr: eLevelName,
    ) {
        this.levelNumber = levelNumber;
        this.levelStr = levelStr;
        this.color = color;
    }

    toString(): string {
        return this.levelStr;
    }

    /**
     * converts given String to corresponding Level
     * @param {(ILogLevel|string)} sArg -- String value of Level OR Log4js.Level
     * @param {ILogLevel} [defaultLevel] -- default Level, if no String representation
     * @return {ILogLevel}
     */
    static getLevel(
        sArg: ILogLevel | string | undefined,
        // eslint-disable-next-line no-use-before-define
        defaultLevel: ILogLevel = logLevels.ALL,
    ): ILogLevel {
        if (!sArg) {
            return defaultLevel;
        }

        if (sArg && !(sArg instanceof String)) {
            return sArg as ILogLevel;
        }

        return defaultLevel;
    }

    isEqualTo(otherLevel: ILogLevel | string): boolean {
        if (typeof otherLevel === 'string') {
            otherLevel = Level.getLevel(otherLevel);
        }
        return this.levelNumber === otherLevel.levelNumber;
    }
    isLessThan(other: string | ILogLevel): boolean {
        if (typeof other === 'string') {
            other = Level.getLevel(other) as ILogLevel;
        }
        return this.levelNumber < other.levelNumber;
    }
    isGraterThan(other: string | ILogLevel): boolean {
        if (typeof other === 'string') {
            other = Level.getLevel(other) as ILogLevel;
        }
        return this.levelNumber > other.levelNumber;
    }
    isLessThanOrEqualTo(otherLevel: ILogLevel | string): boolean {
        if (typeof otherLevel === 'string') {
            otherLevel = Level.getLevel(otherLevel) as ILogLevel;
        }
        return this.levelNumber <= otherLevel.levelNumber;
    }

    isGreaterThanOrEqualTo(otherLevel: ILogLevel | string): boolean {
        if (typeof otherLevel === 'string') {
            otherLevel = Level.getLevel(otherLevel);
        }
        return this.levelNumber >= otherLevel.levelNumber;
    }
}

/**
 *  @description Exported version of logLevels object
 */
export const logLevels: ILogLevels = {
    ALL: new Level(Number.MIN_VALUE, eValidColors.grey, eLevelName.ALL),
    TRACE: new Level(5000, eValidColors.blue, eLevelName.TRACE),
    DEBUG: new Level(10000, eValidColors.cyan, eLevelName.DEBUG),
    INFO: new Level(20000, eValidColors.green, eLevelName.INFO),
    WARN: new Level(30000, eValidColors.yellow, eLevelName.WARN),
    ERROR: new Level(40000, eValidColors.red, eLevelName.ERROR),
    FATAL: new Level(50000, eValidColors.magenta, eLevelName.FATAL),
    MARK: new Level(9007199254740992, eValidColors.grey, eLevelName.MARK),
    OFF: new Level(Number.MAX_VALUE, eValidColors.grey, eLevelName.OFF),
    levels: new Map(),
    addLevels: (customLevels: ILogLevel[]) => {
        customLevels.forEach((level) => {
            logLevels.levels.set(level.levelStr, level);
        });
    },
    getLevel: function (
        levelStr: string,
        defaultLevel?: ILogLevel,
    ): ILogLevel | undefined {
        const findLvl = logLevels.levels.get(levelStr);
        if (findLvl) {
            return findLvl;
        } else {
            return defaultLevel;
        }
    },
};

/** @deprecated Please use logLevels */
export const levels = logLevels;
