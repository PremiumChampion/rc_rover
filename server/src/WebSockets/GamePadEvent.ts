import { RoverPipe } from "../Rover/RoverPipe";
import { FrameworkSocket } from "./SocketInit";


export class GamePadEvent {

    public static instance: GamePadEvent = new GamePadEvent();

    public static getInstance(): GamePadEvent {
        return this.instance;
    }

    private connections: number = 0;

    private constructor() { }

    public setSocketIfNotExists(socket: FrameworkSocket): void {
        this.connections++;
        socket.on("rover", (...args) => {
            this.handleData(...args);
        });
        socket.on("disconnect", (...args) => {
            this.handleDisconnect(...args);
        });
        socket.emit("data", "connected")
    }

    private handleData(...args: any[]) {

        let angle: number = args[0];
        let power: number = args[1];

        RoverPipe.getInstance().set(angle, power);
    }

    private handleDisconnect(...args: any[]) {
        this.connections--;
        if (this.connections == 0)
            RoverPipe.getInstance().pauseRover();
    }
}