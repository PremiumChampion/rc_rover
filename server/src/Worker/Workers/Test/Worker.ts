import { Worker } from 'worker_threads';
import { ManagedWorker } from '../../managedWorker';

export class TestWorker extends ManagedWorker<string, string> {
    protected spawn() {
        this.worker = new Worker(new URL('./Thread.ts', import.meta.url), { workerData: { correlationID: this.correlationID }, env: process.env });
    }
}