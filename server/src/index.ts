import { json, text, } from "body-parser";
import express, { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { createServer, IncomingMessage, Server } from "http";
import { ENVIROMENT } from "./Enviroment/EnviromentVariables";
import { SocketIO } from "./WebSockets/SocketInit";

const app = express();
const server: Server = createServer(app);
SocketIO.initialize(server);

// Use body parser for json and text body
app.use(text());
app.use(json());
app.use(express.static("static"))

// start the server
server.listen(ENVIROMENT.port.getValue(), () => console.log('Server started at http://localhost:' + ENVIROMENT.port.getValue()));

export { app };