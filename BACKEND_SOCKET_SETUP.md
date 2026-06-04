# Socket.IO Backend Setup Guide

## 🚀 Quick Start for Backend (Node.js on port 4000)

Your backend API needs to initialize Socket.IO alongside your existing Express/Node.js server.

## Installation

```bash
npm install socket.io cors
```

## Backend Server Setup

Update your backend `app.js` or `server.js` with this setup:

```javascript
import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your Next.js frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);

  // Join specific order room
  socket.on("join-order", (orderId) => {
    console.log(`📍 Client ${socket.id} joining room: order_${orderId}`);
    socket.join(`order_${orderId}`);
  });

  // Leave order room
  socket.on("leave-order", (orderId) => {
    console.log(`🚪 Client ${socket.id} leaving room: order_${orderId}`);
    socket.leave(`order_${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});

// Make io available globally
global.io = io;

// Your existing Express routes
app.use(express.json());
// ... your routes ...

// Start server on port 4000
server.listen(4000, () => {
  console.log("🚀 Backend Server running on http://localhost:4000");
  console.log("📡 Socket.IO server listening for connections...");
});
```

## Emit Order Status Updates

Whenever you update an order status via your API, emit a socket event:

### Example: Update Order Status Endpoint

```javascript
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

    // Emit to all clients listening to this order
    global.io.to(`order_${orderId}`).emit("order-status-update", {
      orderId,
      status,
      order: updatedOrder,
      timestamp: new Date().toISOString(),
    });

    // Legacy event for backward compatibility
    global.io.to(`order_${orderId}`).emit("orderUpdated", updatedOrder);

    return res.json({ 
      success: true, 
      data: updatedOrder 
    });

  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ error: error.message });
  }
});
```

### Example: Emit from Order Creation

```javascript
app.post("/api/v1/orders", async (req, res) => {
  try {
    // ... your order creation logic ...
    
    const newOrder = new Order({
      customer: userId,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      status: "Order Received",
    });

    await newOrder.save();

    // Optional: Notify all connected clients about new order
    global.io.emit("order-created", {
      order: newOrder,
      timestamp: new Date().toISOString(),
    });

    return res.json({ 
      success: true, 
      data: newOrder 
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
```

## Using the Emitter Helper

Create a helper function in your backend:

```javascript
// utils/socketEmitter.js
export const emitOrderStatusUpdate = (io, orderId, status, updatedOrder) => {
  io.to(`order_${orderId}`).emit("order-status-update", {
    orderId,
    status,
    order: updatedOrder,
    timestamp: new Date().toISOString(),
  });

  // Legacy event
  io.to(`order_${orderId}`).emit("orderUpdated", updatedOrder);
};
```

Then use it in your routes:

```javascript
import { emitOrderStatusUpdate } from "./utils/socketEmitter.js";

app.patch("/api/v1/orders/:orderId", async (req, res) => {
  // ... update logic ...
  
  emitOrderStatusUpdate(global.io, orderId, newStatus, updatedOrder);
  
  return res.json({ success: true, data: updatedOrder });
});
```

## Testing Socket Connection

### From Backend Terminal

```javascript
// After starting server, test emitting in Node REPL
setTimeout(() => {
  global.io.to('order_test_123').emit('order-status-update', {
    orderId: 'test_123',
    status: 'Preparing',
    timestamp: new Date().toISOString(),
  });
  console.log('Test message sent to order_test_123');
}, 2000);
```

### From Frontend Browser Console

```javascript
import { joinOrderRoom, getSocket } from '@/utils/socket/SocketClient';

// Connect and join room
joinOrderRoom('test_123');

// Listen for messages
const socket = getSocket();
socket.on('order-status-update', (data) => {
  console.log('Received:', data);
});
```

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Frontend (Next.js) - localhost:3000            │
│  ├─ pages/protected/Order.jsx                   │
│  ├─ utils/hooks/useOrderSocket.js               │
│  └─ utils/socket/SocketClient.js                │
└──────────────┬──────────────────────────────────┘
               │ WebSocket Connection
               │ (Socket.IO Client)
               │
┌──────────────▼──────────────────────────────────┐
│  Backend API (Node.js) - localhost:4000         │
│  ├─ Socket.IO Server (Port 4000)                │
│  ├─ Express Routes (REST API)                   │
│  └─ MongoDB (Orders, Menu, Users)               │
└─────────────────────────────────────────────────┘
```

## Environment Variables

In your backend `.env`:

```
PORT=4000
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/order-management
JWT_SECRET=your_secret
```

## Debugging

### Check if socket.io is listening

```bash
# Terminal 1 - Start backend server
node server.js
# Should show: "📡 Socket.IO server listening for connections..."

# Terminal 2 - Check if port is open
netstat -an | find "4000"
# or on Linux: lsof -i :4000
```

### Enable Socket.IO debug logs

On backend:
```javascript
import debug from "debug";
debug.enable("socket.io*");
```

On frontend browser console:
```javascript
localStorage.debug = "socket.io-client:*";
```

## Common Issues

### "Cannot GET /socket.io/"
- Socket.IO server not initialized on backend
- Backend not running on port 4000
- Check that `http.createServer(app)` is used before creating Socket.IO server

### "CORS error" in browser console
- Check CORS origin in Socket.IO config matches frontend URL
- Ensure credentials are set to true if needed

### Socket connection timeout
- Backend Socket.IO server not running
- Firewall blocking port 4000
- Check `NEXT_PUBLIC_SOCKET_URL` env var points to correct backend URL

## Next Steps

1. Add Socket.IO to your backend server initialization
2. Add socket event emissions in your order update endpoints
3. Restart both frontend (npm run dev) and backend servers
4. Check browser console for connection success message
5. Test by updating an order status - should see real-time update in Order.jsx

