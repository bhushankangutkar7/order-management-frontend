# Socket.IO Implementation Guide

## Overview

This guide explains how to integrate Socket.IO for real-time order status tracking in your order management system.

## Architecture

- **Frontend**: Next.js client with socket.io-client
- **Backend**: Node.js/Express API (localhost:4000) with socket.io integration
- **Real-time Updates**: Order status changes broadcast via Socket.IO rooms

## File Structure

```
utils/socket/
├── SocketServer.js       # Socket.IO server initialization
├── SocketClient.js       # Client socket connection utilities
└── socketEmitter.js      # Helper to emit order updates

utils/hooks/
└── useOrderSocket.js     # React hook for socket management

pages/protected/
└── Order.jsx            # Order tracking UI with socket integration
```

## How It Works

### 1. Client-Side Connection Flow

```javascript
// Import the hook
import { useOrderSocket } from "@/utils/hooks/useOrderSocket.js";

// Use in component
const { orderStatus, isConnected, latestUpdate } = useOrderSocket(orderId);

// Component automatically:
// 1. Connects to socket server
// 2. Joins order room on mount
// 3. Listens for order-status-update events
// 4. Leaves room on unmount
```

### 2. Server-Side Event Flow

**Client to Server:**
```
Client → emit('join-order', orderId)
Client → emit('leave-order', orderId)
```

**Server to Client:**
```
Server → emit('order-status-update', {
  orderId: "order_id",
  status: "Preparing",
  order: { /* full order object */ },
  timestamp: "2026-06-04T10:30:00Z"
})
```

## Backend Integration (API at localhost:4000)

### Step 1: Install Dependencies

```bash
npm install socket.io cors
```

### Step 2: Initialize Socket.IO in Your Backend

In your backend `server.js` or `app.js`:

```javascript
import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join order room
  socket.on("join-order", (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`Client joined order room: order_${orderId}`);
  });

  // Leave order room
  socket.on("leave-order", (orderId) => {
    socket.leave(`order_${orderId}`);
    console.log(`Client left order room: order_${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make io accessible globally
global.io = io;

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
```

### Step 3: Emit Order Updates from API Endpoints

When an order status is updated via your REST API, emit the socket event:

```javascript
// In your order update endpoint (e.g., PATCH /api/v1/orders/:orderId)

import Order from "@/db/models/OrderModel.js";

app.patch("/api/v1/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Update order in database
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    // Emit socket event to all clients in the order room
    global.io.to(`order_${orderId}`).emit("order-status-update", {
      orderId,
      status,
      order: updatedOrder,
      timestamp: new Date().toISOString(),
    });

    // Also emit legacy event for backward compatibility
    global.io.to(`order_${orderId}`).emit("orderUpdated", updatedOrder);

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: error.message });
  }
});
```

### Step 4: Alternative - Use the Emitter Helper (From Next.js)

If you want to reuse the emitter helper from your Next.js backend utilities:

```javascript
// In your backend API
import { getIO } from "@/utils/socket/SocketServer.js";

const io = getIO();

// In your order update logic
io.to(`order_${orderId}`).emit("order-status-update", {
  orderId,
  status: newStatus,
  order: updatedOrder,
  timestamp: new Date().toISOString(),
});
```

## Frontend Component Integration

### Using the Hook (Recommended)

```javascript
"use client";
import { useOrderSocket } from "@/utils/hooks/useOrderSocket.js";

function OrderTracker({ orderId }) {
  const { orderStatus, isConnected, latestUpdate } = useOrderSocket(orderId);

  return (
    <div>
      <p>Status: {orderStatus}</p>
      <p>Connected: {isConnected ? "✓" : "✗"}</p>
      {latestUpdate && <p>Updated: {latestUpdate.timestamp}</p>}
    </div>
  );
}
```

### Manual Socket Usage (Legacy)

```javascript
import { getSocket, joinOrderRoom, leaveOrderRoom } from "@/utils/socket/SocketClient.js";

// Join a room
joinOrderRoom("order_123");

// Listen for updates
const socket = getSocket();
socket.on("order-status-update", (data) => {
  console.log("Order updated:", data.status);
});

// Leave room
leaveOrderRoom("order_123");
```

## Socket Events Reference

### Events Emitted by Server

| Event | Data | Description |
|-------|------|-------------|
| `order-status-update` | `{ orderId, status, order, timestamp }` | Order status changed |
| `orderUpdated` | `{ /* full order object */ }` | Legacy order update event |
| `message` | `string` | General server message |

### Events Expected by Server

| Event | Data | Description |
|-------|------|-------------|
| `join-order` | `orderId` | Client joins order room |
| `leave-order` | `orderId` | Client leaves order room |

## Debugging

### Enable Console Logs

The implementation includes console logs for debugging:

```
✅ Socket Connected: <socket-id>
📍 Client {id} joining room: order_{orderId}
📤 Broadcasting order status update to room: order_{orderId}
❌ Socket Disconnected: <socket-id>
```

### Check Connection Status

```javascript
import { useSocket } from "@/utils/hooks/useOrderSocket.js";

function DebugSocket() {
  const { socket, isConnected } = useSocket();

  return (
    <div>
      <p>Socket ID: {socket?.id}</p>
      <p>Connected: {isConnected ? "Yes" : "No"}</p>
    </div>
  );
}
```

## REST API Endpoints (Unchanged)

All REST API endpoints remain operational for data fetching:

```
POST   /api/v1/orders           → Create order
GET    /api/v1/orders           → Fetch all orders
GET    /api/v1/orders/:orderId  → Fetch specific order
PATCH  /api/v1/orders/:orderId  → Update order (triggers socket event)
POST   /api/v1/menu             → Menu operations
POST   /api/v1/auth             → Authentication
```

## Environment Variables

Update your `.env.local`:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Testing Socket Connection

### From Frontend Console

```javascript
import { getSocket, joinOrderRoom } from "@/utils/socket/SocketClient.js";

const socket = getSocket();
console.log("Socket ID:", socket.id);
console.log("Connected:", socket.connected);

// Test joining order room
joinOrderRoom("test_order_123");
```

### From Backend

```javascript
// Simulate order update
io.to("order_test_order_123").emit("order-status-update", {
  orderId: "test_order_123",
  status: "Preparing",
  order: { /* test data */ },
  timestamp: new Date().toISOString(),
});
```

## Troubleshooting

### Socket not connecting
- Check if socket server is running on localhost:3000
- Verify `NEXT_PUBLIC_SOCKET_URL` in `.env.local`
- Check browser console for CORS errors

### Events not received
- Verify client has joined order room with `joinOrderRoom(orderId)`
- Check that backend is emitting to correct room: `io.to(\`order_${orderId}\`)`
- Enable socket debug in browser console: `localStorage.debug = '*'`

### Multiple connections
- Use `getSocket()` which returns existing connection
- Ensure `useOrderSocket` hook is properly cleaned up on unmount

## Security Considerations

- Add authentication to socket connections
- Validate orderId ownership before emitting updates
- Implement proper error handling for socket failures
- Rate limit socket events to prevent abuse

## Next Steps

1. Implement socket initialization in your backend API
2. Add socket event emissions in order update endpoints
3. Test with frontend order tracking page
4. Monitor socket connections and optimize as needed
