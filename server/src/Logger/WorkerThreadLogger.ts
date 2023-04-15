import path from "path";
import { FileLogger } from "./FileLogger";
import { LoggerLevel } from "./LoggerLevel";

export class WorkerThreadLogger extends FileLogger {
    constructor() {
        super();

        let filename = `${new Date().toISOString()}.log`.replace(/#|%|&|{|}|\\|<|>|\*|\?|\/| |\$|!|'|"|:|@|\+|`|\||=/gi, "-");
        this.loggingPath = path.join(process.cwd(), "log", filename);
    }

    protected getLoggingMetaData(level: LoggerLevel) {
        let loggingMetaData = super.getLoggingMetaData(level);
        loggingMetaData.push(`[THREAD=MAIN]`);
        return loggingMetaData;
    }
}