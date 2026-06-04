import http from "http";
import next from "next";

const app = next({ dev: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer(handler);

  server.listen(3000, () => {
    console.log("🚀 Next.js Server running on http://localhost:3000");
    console.log("📡 Socket.IO server expected on http://localhost:4000");
  });
});