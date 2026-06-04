// pages/protected/Order.jsx
'use client';
import React, { useEffect, useState } from "react";
import { getSocket } from "../../utils/socket/SocketClient.js";
import { getAllOrders } from "../../app/actions/OrderActions.js";

const statuses = [
  "Order Received",
  "Preparing",
  "Out For Delivery", // Must exactly match backend
  "Delivered",
];  

const Orders = () => {
  const [ordersStatus, setOrdersStatus] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders = await getAllOrders();
        setOrdersStatus(orders || []);
      } catch (error) {
        console.error("Failed to load orders", error);
      }
    };

    loadOrders();
  }, []);

  // useEffect(() => {
  //   const socket = getSocket();

  //   socket.on("orderUpdated", (updatedOrder) => {
  //     setOrdersStatus((prev) => {
  //       const exists = prev.some(
  //         (order) => order._id === updatedOrder._id
  //       );

  //       if (exists) {
  //         return prev.map((order) =>
  //           order._id === updatedOrder._id
  //             ? updatedOrder
  //             : order
  //         );
  //       }

  //       return [updatedOrder, ...prev];
  //     });
  //   });

  //   return () => {
  //     socket.off("orderUpdated");
  //   };
  // }, [ordersStatus]);

  useEffect(() => {
    const socket = getSocket();
    console.log("SOCKET INSTANCE:", socket?.id);
  
    const handler = (updatedOrder) => {
      console.log("SOCKET RECEIVED:", updatedOrder.status);
  
      setOrdersStatus((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id
            ? { ...order, ...updatedOrder }
            : order
        )
      );
    };
  
    socket.on("orderUpdated", handler);
  
    return () => {
      socket.off("orderUpdated", handler);
    };
  }, []);


  const activeOrder = [...ordersStatus]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .find((order) => order.status !== "Delivered");

  const pastOrders = ordersStatus
    .filter((order) => order.status === "Delivered")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const currentStatusIndex = activeOrder
    ? statuses.indexOf(activeOrder.status)
    : -1;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">
        Order Tracking
      </h1>

      {activeOrder ? (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-4">
            <h2 className="font-bold text-xl">
              Order #{activeOrder._id.slice(-6)}
            </h2>

            <p className="text-gray-500">
              Current Status: {activeOrder.status}
            </p>
          </div>

          <div className="space-y-4">
            {statuses.map((status, index) => (
              <div
                key={status}
                className="flex items-center gap-4"
              >
                <div
                  className={`w-5 h-5 rounded-full ${
                    index <= currentStatusIndex
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />

                <span
                  className={`font-medium ${
                    index <= currentStatusIndex
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 mb-12">
          No active orders found
        </div>
      )}

      {pastOrders.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mt-12">
          <h2 className="font-bold text-xl mb-4">Past Orders</h2>
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <div key={order._id} className="border-b pb-4">
                <h3 className="font-bold">Order #{order._id.slice(-6)}</h3>
                <p className="text-gray-500">Status: {order.status}</p>
                <p className="text-gray-500">
                  Created: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;