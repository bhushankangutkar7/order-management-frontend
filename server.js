import http from "http";
import next from "next";
import { Server } from "socket.io";
import { initializeSocket } from "./utils/socket/SocketServer.js";

const app = next({ dev: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer(handler);

  // Attach socket.io to real server
  initializeSocket(server);

  server.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
});