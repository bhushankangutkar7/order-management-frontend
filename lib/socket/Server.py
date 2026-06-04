import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      path: "/api/socket",
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);
    });
  }

  return io;
};

export const getIO = () => io;