import { randomUUID } from "crypto";
import { IncomingMessage, Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { VerifyAzureBaererToken } from "../Authentication/VerifyAzureBaererToken";
import { HTTPError } from "../errorHandling/http/HttpError";
import { SevereError } from "../ErrorHandling/SevereError/SevereError";
import { MainThreadRequestLogger } from "../Logger/MainThreadRequestLogger";
import { setup } from "./SocketEvents";


export interface FrameworkSocket extends Socket {
    readonly correlationId: string;
    readonly logger: MainThreadRequestLogger
}

export class SocketIO {

    private static io: SocketIOServer = null;

    public static initialize(server: Server) {
        SocketIO.io = new SocketIOServer(server, {
            cors: { origin: "*", optionsSuccessStatus: 200, methods: "*" },
            allowRequest: async (req: IncomingMessage, callback: (error: string | null, isAuthorised: boolean) => void) => {
                callback(null, true);
                return;
            }
        });

        SocketIO.io.on("connection", (socket: Socket) => {
            const correlationID = randomUUID();
            const logger = new MainThreadRequestLogger(correlationID);
            socket["correlationID"] = correlationID
            socket["logger"] = logger
            const frameworkSocket: FrameworkSocket = socket as FrameworkSocket;
            if (SocketIO.onConnection) SocketIO.onConnection(frameworkSocket);
            frameworkSocket.logger.info("[CONNECTION=START]");
            frameworkSocket.on('disconnect', () => {
                frameworkSocket.logger.info("[CONNECTION=END]");
                if (SocketIO.onDisconnect) SocketIO.onDisconnect(frameworkSocket);
            });
        });

        setup();
    }

    public static onConnection: (socket: FrameworkSocket) => void;
    public static onDisconnect: (socket: FrameworkSocket) => void;

    public static get() {
        if (!SocketIO.io) throw new SevereError("Socket.io is not initialised. Please initialise socket.io first.");
        return SocketIO.io;
    }
}