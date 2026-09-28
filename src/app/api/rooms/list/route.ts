import { NextResponse } from "next/server";
import { getAllRooms } from "@/lib/room/manager";

// Debug endpoint: development only
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const rooms = await getAllRooms();
  return NextResponse.json({
    count: rooms.length,
    rooms: rooms.map((r) => ({
      id: r.id,
      code: r.code,
      userCount: r.users.length,
      restaurantCount: r.restaurants.length,
      status: r.status,
      createdAt: new Date(r.createdAt).toISOString(),
    })),
  });
}
