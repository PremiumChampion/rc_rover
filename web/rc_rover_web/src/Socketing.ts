import { io } from "socket.io-client";
import { AsyncSetup } from "./AsyncSetup";


const socket = io();

// socket_setup.registerSetup(new Promise((res) => {
//     socket.connect();
//     socket.on("connect", () => {
//         res(null);
//     });
// }));
// socket_setup.executeAsyncSetup();



export { socket };