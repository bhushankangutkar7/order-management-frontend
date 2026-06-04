// pages/protected/Order.jsx
'use client';
import React, { useEffect, useState } from "react";
import { useOrderSocket } from "../../utils/hooks/useOrderSocket.js";
import { getAllOrders } from "../../app/actions/OrderActions.js";

const statuses = [
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

const Orders = () => {
  const [ordersStatus, setOrdersStatus] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const {orderStatusSocket, isConnectedSocket, latestUpdateSocket } = useOrderSocket(
    activeOrder?._id
  );

  // Load all orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders = await getAllOrders();
        if (orders && Array.isArray(orders)) {
          setOrdersStatus(orders);
          
          // Set the active order (first non-delivered order)
          const active = orders.find(
            (order) => order.status !== "Delivered"
          );
          if (active) {
            setActiveOrder(active);
          }
        }
      } catch (error) {
        console.error("Failed to load orders", error);
      }
    };

    loadOrders();
  }, []);

  // Update orders when socket receives new data
  useEffect(() => {
    if (latestUpdateSocket) {
      setOrdersStatus((prev) =>
        prev.map((order) =>
          order._id === latestUpdateSocket._id
            ? { ...order, ...latestUpdateSocket }
            : order
        )
      );

      // Update active order if it's the same
      if (activeOrder?._id === latestUpdateSocket.orderId) {
        setActiveOrder({ ...activeOrder, ...latestUpdateSocket});
        // setActiveOrder({ ...activeOrder, "status": latestUpdateSocket.status });
      }
    }
  }, [latestUpdateSocket]);

  // Handle order delivery - check if active order became delivered
  useEffect(() => {
    if (activeOrder?.status === "Delivered") {
      console.log("✅ Order delivered, finding next active order");
      
      // Find next active (non-delivered) order from ordersStatus
      const nextActive = ordersStatus.find(
        (order) => order.status !== "Delivered" && order._id !== activeOrder._id
      );

      if (nextActive) {
        console.log("📍 Switching to next active order:", nextActive._id);
        setActiveOrder(nextActive);
      } else {
        console.log("🎉 No more active orders");
        setActiveOrder(null); // Clear active order - socket connection will stop via hook
      }
    }
  }, [activeOrder?.status]);

  const pastOrders = ordersStatus
    .filter((order) => order.status === "Delivered")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const currentStatusIndex = activeOrder
    ? statuses.indexOf(activeOrder.status)
    : -1;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Tracking</h1>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              activeOrder ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm font-medium">
            {activeOrder ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {activeOrder ? (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-4">
            <h2 className="font-bold text-xl">
              Order #{activeOrder._id.slice(-6)}
            </h2>

            <p className="text-gray-500">
              Current Status: <span className="font-semibold text-gray-700">{activeOrder.status}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Order Date: {new Date(activeOrder.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Items:</h3>
            <div className="space-y-2">
              {activeOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-gray-600">
                    x{item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t font-semibold flex justify-between">
              <span>Total:</span>
              <span>₹{activeOrder.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            {statuses.map((status, index) => (
              <div
                key={status}
                className="flex items-center gap-4"
              >
                <div
                  className={`w-5 h-5 rounded-full transition-colors ${
                    index <= currentStatusIndex
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />

                <span
                  className={`font-medium transition-colors ${
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
          <p className="text-gray-500">No active orders found</p>
        </div>
      )}

      {pastOrders.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mt-12">
          <h2 className="font-bold text-xl mb-4">Past Orders</h2>
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <div
                key={order._id}
                className="border-b pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.totalAmount?.toFixed(2)}</p>
                    <p className="text-sm text-green-600">{order.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;