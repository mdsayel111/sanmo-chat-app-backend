import { Socket } from "socket.io";

export const registerCallHandlers = (
    socket: Socket
) => {
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`👥 Joined room ${roomId}`);
    });

    socket.on("offer", ({ roomId, offer }) => {
        console.log("📩 Offer received");
        socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", ({ roomId, answer }) => {
        console.log("📩 Answer received");
        socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
        console.log("🧊 ICE candidate received");
        socket.to(roomId).emit("ice-candidate", candidate);
    });
};