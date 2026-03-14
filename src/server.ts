/* eslint-disable no-console */
import http, { Server } from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";

import app from "./app";
import { authorizeSocketMiddleware } from "./app/middlewares/HOF-middlewares/authorization-middleware";
import config from "./config";
import { initIO, socketUserStore } from "./temporaty-stores/socket";
import { registerCallHandlers } from "./app/modules/call/call-socket";

const port = config.port;

// create HTTP server from express app
const httpServer = http.createServer(app);

// create socket server
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
  },
});

initIO(io);

let server: Server;

// authenticate socket connection
io.use(authorizeSocketMiddleware("user"));

// 🔌 Socket connection
io.on("connection", (socket) => {

  socketUserStore[socket.user._id] = socket.id;

  // registerChatHandlers(io, socket);
  registerCallHandlers(socket);
  socket.on("disconnect", () => {
  });

});

// handle unhandledRejection
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);

  if (server) {
    server.close(() => {
      console.error("Server closed due to unhandled rejection");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// handle uncaughtException
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// main bootstrap
async function main() {
  try {
    // connect MongoDB
    await mongoose.connect(config.dbUrl as string);

    // start server
    server = httpServer.listen(Number(port), "0.0.0.0", () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
}

main();
