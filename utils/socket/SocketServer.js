import { Server } from "socket.io";

let io = null;

export const initializeSocket = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: process.env.BACKEND_NODE_URL || "http://localhost:4000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket Connected:", socket.id);

    // Join specific order room for real-time updates
    socket.on("join-order", (orderId) => {
      console.log(`📍 Client ${socket.id} joining room: order_${orderId}`);
      socket.join(`order_${orderId}`);
      socket.emit("message", `Joined order room: ${orderId}`);
    });

    // Leave order room
    socket.on("leave-order", (orderId) => {
      console.log(`🚪 Client ${socket.id} leaving room: order_${orderId}`);
      socket.leave(`order_${orderId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket Disconnected:", socket.id);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  return io;
};

export const getIO = () => io;