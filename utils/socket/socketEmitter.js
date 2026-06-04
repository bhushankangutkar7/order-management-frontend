import { getIO } from "./SocketServer.js";

/**
 * Emit order status update to all connected clients in the order room
 * @param {string} orderId - The order ID
 * @param {string} newStatus - The new status of the order
 * @param {object} updatedOrder - The complete updated order object
 */
export const emitOrderStatusUpdate = (orderId, newStatus, updatedOrder) => {
  const io = getIO();
  
  if (!io) {
    console.warn("Socket.IO not initialized");
    return;
  }

  const roomName = `order_${orderId}`;
  const updateData = {
    orderId,
    status: newStatus,
    order: updatedOrder,
    timestamp: new Date().toISOString(),
  };

  console.log(
    `📤 Broadcasting order status update to room: ${roomName}`,
    updateData
  );

  // Broadcast to all clients in the order room
  io.to(roomName).emit("order-status-update", updateData);

  // Also emit to orderUpdated event for backward compatibility
  io.to(roomName).emit("orderUpdated", updateData.order);
};
