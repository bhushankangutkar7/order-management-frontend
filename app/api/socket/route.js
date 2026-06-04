import { NextResponse } from "next/server";
import { initSocket } from "@/lib/socket/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const res = NextResponse.next();

  const server = res?.socket?.server;

  if (!server.io) {
    console.log("🚀 Initializing Socket.IO");

    const io = initSocket(server);
    server.io = io;
  }

  return NextResponse.json({ ok: true });
}