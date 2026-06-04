// app/actions/OrderActions.js
"use server";
import { cookies } from "next/headers";
import axios from "axios";

export async function createOrder(data) {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("session_token")?.value;

    const itemsData = data.items || [];

    const updatedData = itemsData.map((item) => ({
      menuItem: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const totalAmount = updatedData.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

    const response = await axios.post(
      "http://localhost:4000/api/v1/orders",
      {
        items: updatedData,
        totalAmount,
        status: "Order Received",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      "Create Order Error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to create order",
    };
  }
}

export async function getAllOrders() {
  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get("session_token")?.value;
      
    const response = await axios.get(
      "http://localhost:4000/api/v1/orders",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
    
  } catch(error){
    console.error(
      "Get All Orders Error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to get orders",
    };
  }
}
