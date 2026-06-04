"use client";

import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket || !socket.connected) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    
    socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("✅ Socket Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket Disconnected");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  return socket;
};

/**
 * Join a specific order room to receive real-time updates
 * @param {string} orderId - The order ID to join
 */
export const joinOrderRoom = (orderId) => {
  const socket = getSocket();
  console.log(`📍 Joining order room: ${orderId}`);
  socket.emit("join-order", orderId);
};

/**
 * Leave a specific order room
 * @param {string} orderId - The order ID to leave
 */
export const leaveOrderRoom = (orderId) => {
  const socket = getSocket();
  console.log(`🚪 Leaving order room: ${orderId}`);
  socket.emit("leave-order", orderId);
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};