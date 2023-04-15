import { GamePadEvent } from "./GamePadEvent";
import { FrameworkSocket, SocketIO } from "./SocketInit";


export function setup() {

    SocketIO.onConnection = (socket: FrameworkSocket) => {
        socket.logger.info("connected");
        let gamepadHandler = GamePadEvent.getInstance();
        gamepadHandler.setSocketIfNotExists(socket);
    }
}
