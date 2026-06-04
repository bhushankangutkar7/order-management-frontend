"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function getAllMenuItems() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  
  const response = await axios.get(`${process.env.BACKEND_NODE_URL}/api/v1/menu`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data.data;
};