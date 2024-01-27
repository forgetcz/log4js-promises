export enum eValidColors {
    white = 'white',
    grey = 'grey',
    black = 'black',
    blue = 'blue',
    cyan = 'cyan',
    green = 'green',
    magenta = 'magenta',
    red = 'red',
    yellow = 'yellow',
}

export enum eLevelName {
    ALL = 'ALL',
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL',
    MARK = 'MARK',
    OFF = 'OFF',
}

export enum eCoreAppenderType {
    console = 'console',
    file = 'file',
    // fileSync = 'fileSync',
    // dateFile = 'dateFile',
    logLevelFilter = 'logLevelFilter',
    // multiFile = 'multiFile',
    // multiProcess = 'multiProcess',
    // recording = 'recording',
    stderr = 'stderr',
    // stdout = 'stdout',
    // tcp = 'tcp',
    // categoryFilter = 'categoryFilter',
    noLogFilter = 'noLogFilter',
}
