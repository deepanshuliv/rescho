import { NextResponse } from "next/server";

// Health check for the hosting platform (Render polls /health before routing traffic)
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
