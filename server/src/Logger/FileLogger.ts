import path from "path";
import { Logger } from "./Logger";
import fs from "fs/promises";

export class FileLogger extends Logger {
    protected loggingPath = path.join(process.cwd(), "log", "log.txt");

    protected loggingFN: (...args: string[]) => Promise<void> = async (...args) => {
        let dirname = path.dirname(this.loggingPath);

        try {
            await fs.access(dirname);
        } catch (error) {
            fs.mkdir(dirname);
        }

        try {
            await fs.access(this.loggingPath);
        } catch (error) {
            await fs.writeFile(this.loggingPath, "");
        }
        try {
            await fs.appendFile(this.loggingPath, args.join(" ") + "\n");
        } catch (error) {
            console.error(error);
        }
    }
}