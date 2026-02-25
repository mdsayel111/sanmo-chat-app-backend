/* eslint-disable no-console */
import http, { Server } from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";

import app from "./app";
import config from "./config";

const port = config.port;

// create HTTP server from express app
const httpServer = http.createServer(app);

// create socket server
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*"
  }
});

let server: Server;

// 🔌 Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// handle unhandledRejection
process.on("unhandledRejection", (reason) => {
  console.log("Unhandled Rejection:", reason);

  if (server) {
    server.close(() => {
      console.log("Server closed due to unhandled rejection");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// handle uncaughtException
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception:", error);
  process.exit(1);
});

// main bootstrap
async function main() {
  try {
    // connect MongoDB
    await mongoose.connect(config.dbUrl as string);

    console.log("MongoDB connected");

    // start server
    server = httpServer.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log("Server startup error:", error);
  }
}

main();