import { parentPort, workerData } from "worker_threads";
import { WorkerThreadRequestLogger } from "../../Logger/WorkerThreadRequestLogger";

export const LOG_REQUEST = new WorkerThreadRequestLogger(workerData.correlationID);

export const setupWorkerLogging = () => {
    parentPort.on("close", (...args) => LOG_REQUEST.info("[EVENT=CLOSE]", ...args));
    parentPort.on("message", (...args) => LOG_REQUEST.info("[EVENT=MESSAGE]", ...args));
    parentPort.on("messageerror", (...args) => LOG_REQUEST.error("[EVENT=MESSAGEERROR]", ...args));
}
