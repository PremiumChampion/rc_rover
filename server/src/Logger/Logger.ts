import { LoggerLevel } from "./LoggerLevel";

export class Logger {

    protected loggingFN: (...args: string[]) => Promise<void> = async (...args) => console.log(...args);

    public logLevel = LoggerLevel.DEBUG;

    public isEnabled(level: LoggerLevel) {
        return level <= this.logLevel;
    }

    protected getLoggingMetaData(logLevel: LoggerLevel): string[] {
        let loggingMetadata: string[] = [];
        loggingMetadata.push(`[${new Date().toUTCString()}]`);
        loggingMetadata.push(`[${LoggerLevel[logLevel]}]`);
        return loggingMetadata;
    }

    protected _log(level: LoggerLevel, ...args: any[]) {
        if (this.isEnabled(level)) {
            let metadata = this.getLoggingMetaData(level);

            args = args.map(arg => {
                switch (typeof arg) {
                    case "bigint":
                        return arg.toString();
                    case "boolean":
                        return arg.toString();
                    case "function":
                        return "[FUNCTION LOGGING NOT SUPPORTED]";
                    case "number":
                        return arg.toString();
                    case "object":
                        return JSON.stringify(arg);
                    case "string":
                        return arg;
                    case "undefined":
                        return "undefiend";
                    case "symbol":
                        return "[SYMBOL LOGGING NOT SUPPORTED]";
                    default:
                        return "[UNKNOWN TYPE]";
                }
            })

            this.loggingFN(...metadata, ...args);
        }
    }

    public fatal(...args: any[]) {
        this._log(LoggerLevel.FATAL, ...args);
    }

    public error(...args: any[]) {
        this._log(LoggerLevel.ERROR, ...args);
    }

    public warn(...args: any[]) {
        this._log(LoggerLevel.WARN, ...args);
    }

    public info(...args: any[]) {
        this._log(LoggerLevel.INFO, ...args);
    }

    public debug(...args: any[]) {
        this._log(LoggerLevel.DEBUG, ...args);
    }

    public trace(...args: any[]) {
        this._log(LoggerLevel.TRACE, ...args);
    }
}

