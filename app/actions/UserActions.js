// app/actions/user.js
"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function createUser(data) {
  await connectDB();

  const user = await User.create(data);
  return JSON.parse(JSON.stringify(user));
}