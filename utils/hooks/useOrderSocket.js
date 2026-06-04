"use client";

import { useEffect, useState } from "react";
import { getSocket, joinOrderRoom, leaveOrderRoom } from "../socket/SocketClient";

/**
 * Hook for managing socket order updates
 * @param {string} orderId - The order ID to listen for updates
 * @returns {object} - { orderStatusSocket: string, isConnectedSocket: boolean, latestUpdateSocket: object }
 */
export const useOrderSocket = (orderId) => {
  const [orderStatusSocket, setOrderStatusSocket] = useState(null);
  const [isConnectedSocket, setIsConnectedSocket] = useState(false);
  const [latestUpdateSocket, setLatestUpdateSocket] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const socket = getSocket();

    // Handle connection state
    const handleConnect = () => {
      console.log("🔌 Socket connected, joining order room");
      setIsConnectedSocket(true);
      joinOrderRoom(orderId);
    };

    const handleDisconnect = () => {
      console.log("🔌 Socket disconnected");
      setIsConnectedSocket(false);
    };

    // Handle order status updates
    const handleOrderStatusUpdate = (data) => {
      console.log("📦 Received order status update:", data);
      setOrderStatusSocket(data.status);
      setLatestUpdateSocket(data);
    };

    // Handle backward compatibility with orderUpdated event
    const handleOrderUpdated = (order) => {
      console.log("📦 Received order update (legacy):", order);
      setOrderStatusSocket(order.status);
      setLatestUpdateSocket(order);
    };

    // Attach listeners
    if (socket.connected) {
      joinOrderRoom(orderId);
      setIsConnectedSocket(true);
    } else {
      socket.on("connect", handleConnect);
    }

    socket.on("disconnect", handleDisconnect);
    socket.on("order-status-update", handleOrderStatusUpdate);
    socket.on("orderUpdated", handleOrderUpdated);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("order-status-update", handleOrderStatusUpdate);
      socket.off("orderUpdated", handleOrderUpdated);
      leaveOrderRoom(orderId);
    };
  }, [orderId]);

  return { orderStatusSocket, isConnectedSocket, latestUpdateSocket };
};

/**
 * Hook for general socket connection state
 * @returns {object} - { socket, isConnectedSocket }
 */
export const useSocket = () => {
  const [isConnectedSocket, setIsConnectedSocket] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    const handleConnect = () => {
      setIsConnectedSocket(true);
    };

    const handleDisconnect = () => {
      setIsConnectedSocket(false);
    };

    if (socketInstance.connected) {
      setIsConnectedSocket(true);
    }

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
    };
  }, []);

  return { socket, isConnectedSocket };
};
