"use server";

import { connectDB } from "@/lib/mongodb";
import Menu from "@/models/Menu";

export async function getAllMenuItems() {
  await connectDB();
  const menuItems = await Menu.find();
  return JSON.parse(JSON.stringify(menuItems));
}

export async function createMenuItem(data) {
  await connectDB();

  const item = await Menu.create(data);
  return JSON.parse(JSON.stringify(item));
}