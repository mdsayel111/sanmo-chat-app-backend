// socket/chat.socket.ts
import { Server, Socket } from "socket.io";
import { createMessage } from "./chat-service";

export const registerChatHandlers = (
    io: Server,
    socket: Socket
) => {
    socket.on("chat:send", async (data) => {
        const saved = await createMessage(data);

        io.to(data.receiver).emit("chat:receive", saved);
    });
};