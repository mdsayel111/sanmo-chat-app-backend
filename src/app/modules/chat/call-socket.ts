// socket/chat.socket.ts
// import { Server, Socket } from "socket.io";
// import chatService from "./chat-services";

// export const registerChatHandlers = (
//     io: Server,
//     socket: Socket
// ) => {
//     socket.on("chat:send", async (data) => {
//         const saved = await chatService.createMessage(data);

//         io.to(data.receiver).emit("chat:receive", saved);
//     });
// };