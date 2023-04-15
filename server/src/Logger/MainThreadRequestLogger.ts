import path from "path";
import { FileLogger } from "./FileLogger";
import { Logger } from "./Logger";
import { LoggerLevel } from "./LoggerLevel";

export class MainThreadRequestLogger extends Logger {
    protected correlationId: string;

    constructor(correlationId: string) {
        super();
        this.correlationId = correlationId;
        //this.loggingPath = path.join(process.cwd(), "log", `${this.correlationId}.log`);
    }

    protected getLoggingMetaData(level: LoggerLevel) {
        let loggingMetaData = super.getLoggingMetaData(level);
        loggingMetaData.push(`[THREAD=MAIN]`);
        loggingMetaData.push(`[CORRELATIONID=${this.correlationId}]`)
        return loggingMetaData;
    }
}