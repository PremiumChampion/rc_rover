import { parentPort, workerData } from "worker_threads";
import { LOG_REQUEST, setupWorkerLogging } from "../../Thread/SetupWorkerThreadRequestLogging";
import { LOG_FILE } from "../../Thread/SetupWorkerLogging";

// setup logging for the thread
setupWorkerLogging();

//recieve data from the main thread
parentPort.on("message", (data: string) => {
    // execute perfomance intensive task
    LOG_REQUEST.info("Processing request");
    // send message back to the main thread
    parentPort.postMessage(data + data);
});
