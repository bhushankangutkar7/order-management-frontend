"use server";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function createOrder(data) {
  await connectDB();

  const order = await Order.create(data);
  return JSON.parse(JSON.stringify(order));
}

export async function getOrders() {
  await connectDB();

  return JSON.parse(JSON.stringify(await Order.find().populate("customer")));
}

export async function getOrderById(id) {
  await connectDB();

  return JSON.parse(JSON.stringify(
    await Order.findById(id).populate("customer").populate("items.menuItem")
  ));
}

export async function updateOrderStatus(id, status) {
  await connectDB();

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  return JSON.parse(JSON.stringify(order));
}