import { Socket } from "socket.io";

export const registerCallHandlers = (
    socket: Socket
) => {
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
    });

    socket.on("offer", ({ roomId, offer }) => {
        socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", ({ roomId, answer }) => {
        socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
        socket.to(roomId).emit("ice-candidate", candidate);
    });
};