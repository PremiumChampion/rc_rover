import * as fs from "fs";
import * as child_process from "child_process";
import path from "path";


export class RoverPipe {

    private static instance: RoverPipe = new RoverPipe();

    public static getInstance(): RoverPipe {
        return this.instance;
    }

    private constructor() {
        this.startRover();
    }

    public pipe: fs.WriteStream = null;
    public childprocess: child_process.ChildProcess = null;

    public startRover() {
        this.childprocess = child_process.execFile(path.join(process.cwd(), "exec", "rover"));
        process.on("beforeExit", () => {
            this.childprocess.kill();
        })
        this.openPipe();
    }

    public openPipe() {
        if (this.pipe != null) { return; }

        if (fs.existsSync("/tmp/rover")) {
            this.pipe = fs.createWriteStream("/tmp/rover");
        }
        else {
            setTimeout(() => {
                this.openPipe();
            }, 500);
        }
    }

    public set(angle: number, power: number) {
        if (!this.pipe) return;
        this.pipe.write(`1 ${angle} ${power}\n`);
    }

    public pauseRover() {
        this.set(0, 0);
    }

    public endRover() {
        if (!this.pipe) return;
        this.pipe.write("0\n");
    }

    public end() {
        if (!this.pipe) return;
        this.pipe.close();
    }
}