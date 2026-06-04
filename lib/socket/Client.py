"use client";

import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Socket error:", err.message);
    });
  }

  return socket;
};