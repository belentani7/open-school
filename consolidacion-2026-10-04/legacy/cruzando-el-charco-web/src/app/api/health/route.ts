import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.2.1",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV ?? "development",
  });
}