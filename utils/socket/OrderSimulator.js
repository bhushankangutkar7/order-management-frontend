import Order from "@/db/models/OrderModel";
import { connectDB } from "@/db/config/ConnectDB";
import { getIO } from "./SocketServer";

const statuses = [
  "Order Received",
  "Preparing",
  "Out For Delivery",
  "Delivered",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const running = new Set();

export const simulateOrder = async (orderId) => {
  await connectDB();

  if (running.has(orderId)) return;
  running.add(orderId);

  const io = getIO();

  console.log("🚀 Simulating order:", orderId);

  for (let i = 1; i < statuses.length; i++) {
    await sleep(10000);

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: statuses[i] },
      { new: true }
    );

    console.log("📦 STATUS:", updatedOrder.status);

    io?.emit("orderUpdated", updatedOrder);
  }

  running.delete(orderId);
};