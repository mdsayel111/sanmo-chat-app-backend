import { Server } from "socket.io";

export const socketUserStore: Record<string, any> = {};

export let io: Server;

export const initIO = (serverIO: Server) => {
    io = serverIO;
};

