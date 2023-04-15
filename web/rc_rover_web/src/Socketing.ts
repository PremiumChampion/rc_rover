import { io } from "socket.io-client";
import { AsyncSetup } from "./AsyncSetup";

const socket_setup: AsyncSetup = new AsyncSetup();

const socket = io();

socket_setup.registerSetup(new Promise((res) => {
    socket.connect();
    socket.on("connect", () => {
        res(null);
    });
}));
socket_setup.executeAsyncSetup();

socket.on("connect", () => {
    console.log("connected");
    socket.on("gamepaderror", console.log);
    socket.on("data", console.log);
});

export { socket_setup, socket };