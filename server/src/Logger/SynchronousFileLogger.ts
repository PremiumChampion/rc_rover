import path from "path";
import { Logger } from "./Logger";
import fs from "fs";

export class SynchronousFileLogger extends Logger {
    protected loggingPath = path.join(process.cwd(), "log", "log.txt");

    protected loggingFN: (...args: string[]) => Promise<void> = async (...args) => {
        let dirname = path.dirname(this.loggingPath);

        if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);
        if (!fs.existsSync(this.loggingPath)) fs.writeFileSync(this.loggingPath, "");

        fs.appendFileSync(this.loggingPath, args.join(" ") + "\n");
    }
}