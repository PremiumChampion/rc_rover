import { Worker } from 'worker_threads';
import { Logger } from '../Logger/Logger';


export abstract class ManagedWorker<Arguments, ReturnValue> {

    protected correlationID: string;
    protected logger: Logger | undefined;
    protected worker: Worker;

    constructor(correlationId, logger?: Logger) {
        this.correlationID = correlationId;

        this.logger = logger;

        this.spawn();

        this.setupLogging();
    }

    protected abstract spawn(): void;

    public async run(data: Arguments, terminateWorkerOnExit = true): Promise<ReturnValue> {
        return new Promise<ReturnValue>((resolve, reject) => {

            this.worker.on("message", async (data) => {
                resolve(data);

                if (terminateWorkerOnExit) this.worker.terminate();
            });

            this.worker.on("error", error => {
                reject(error);
            });

            this.worker.postMessage(data);
        });
    }

    protected setupLogging() {
        if (this.logger) {
            this.worker.on("error", (...args) => this.logger.error("[EVENT=ERROR]", ...args));
            this.worker.on("messageerror", (...args) => this.logger.error("[EVENT=MESSAGEERROR]", ...args));
            this.worker.on("exit", (...args) => this.logger.info("[EVENT=EXIT]", ...args));
            this.worker.on("message", (...args) => this.logger.debug("[EVENT=MESSAGE]", ...args));
            this.worker.on("online", (...args) => this.logger.info("[EVENT=ONLINE]", ...args));
        }
    }

    public getNativeWorker() {
        return this.worker;
    }

    public terminate() {
        this.worker.terminate();
    }
}
