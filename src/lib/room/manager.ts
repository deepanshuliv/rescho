import { Room, Location, Restaurant } from "@/types";
import { generateRoomCode } from "./codeGenerator";
import { exec } from "./store";
import { v4 as uuidv4 } from "uuid";

/** Rooms expire after two hours without activity. */
const ROOM_TTL_SECONDS = 2 * 60 * 60;
const MAX_USERS = 2;

interface RoomMeta {
  id: string;
  code: string;
  location: Location;
  createdAt: number;
}

const keys = {
  meta: (roomId: string) => `room:${roomId}`,
  code: (code: string) => `code:${code.toUpperCase()}`,
  users: (roomId: string) => `room:${roomId}:users`,
  restaurants: (roomId: string) => `room:${roomId}:restaurants`,
  likes: (roomId: string, userId: string) => `room:${roomId}:likes:${userId}`,
  matches: (roomId: string) => `room:${roomId}:matches`,
};

/** Extends the lifetime of every key belonging to a room. */
function touch(meta: RoomMeta) {
  return [
    keys.meta(meta.id),
    keys.code(meta.code),
    keys.users(meta.id),
    keys.restaurants(meta.id),
    keys.matches(meta.id),
  ].map((key) => ["EXPIRE", key, ROOM_TTL_SECONDS]);
}

async function getMeta(roomId: string): Promise<RoomMeta | undefined> {
  const [raw] = await exec([["GET", keys.meta(roomId)]]);
  return raw ? (JSON.parse(raw as string) as RoomMeta) : undefined;
}

/**
 * Creates a new room with a unique ID and human-readable code.
 */
export async function createRoom(location: Location): Promise<Room> {
  const meta: RoomMeta = { id: uuidv4(), code: "", location, createdAt: Date.now() };

  // Claim a code atomically (SET NX) so two rooms can never share one
  for (let attempt = 0; attempt < 10 && !meta.code; attempt++) {
    const code = generateRoomCode();
    const [claimed] = await exec([
      ["SET", keys.code(code), meta.id, "NX", "EX", ROOM_TTL_SECONDS],
    ]);
    if (claimed === "OK") meta.code = code;
  }
  if (!meta.code) throw new Error("Could not allocate a room code");

  await exec([
    ["SET", keys.meta(meta.id), JSON.stringify(meta), "EX", ROOM_TTL_SECONDS],
  ]);

  return { ...meta, users: [], restaurants: [], matches: [] };
}

/**
 * Loads a room with its users, restaurant list and matches.
 */
export async function getRoomById(roomId: string): Promise<Room | undefined> {
  const [raw, users, restaurants, matches] = await exec([
    ["GET", keys.meta(roomId)],
    ["SMEMBERS", keys.users(roomId)],
    ["GET", keys.restaurants(roomId)],
    ["SMEMBERS", keys.matches(roomId)],
  ]);
  if (!raw) return undefined;

  const meta = JSON.parse(raw as string) as RoomMeta;
  const userIds = (users as string[]) ?? [];
  return {
    ...meta,
    users: userIds,
    restaurants: restaurants ? (JSON.parse(restaurants as string) as Restaurant[]) : [],
    matches: (matches as string[]) ?? [],
  };
}

/**
 * Look up a room by its human-readable code (case-insensitive).
 */
export async function getRoomByCode(code: string): Promise<Room | undefined> {
  const [roomId] = await exec([["GET", keys.code(code)]]);
  return roomId ? getRoomById(roomId as string) : undefined;
}

/**
 * Adds a user to a room if space is available. Returns true if the user is
 * (now) in the room.
 */
export async function addUserToRoom(roomId: string, userId: string): Promise<boolean> {
  const meta = await getMeta(roomId);
  if (!meta) return false;

  const [added, count] = await exec([
    ["SADD", keys.users(roomId), userId],
    ["SCARD", keys.users(roomId)],
    ...touch(meta),
  ]);

  // A new third person made the room overflow: undo their join
  if (added === 1 && (count as number) > MAX_USERS) {
    await exec([["SREM", keys.users(roomId), userId]]);
    return false;
  }
  return true;
}

/**
 * Stores the restaurant list for a room. Only the first write wins, so both
 * people always swipe the same list even if two requests race.
 */
export async function setRoomRestaurants(
  roomId: string,
  restaurants: Restaurant[],
): Promise<boolean> {
  const [result] = await exec([
    ["SET", keys.restaurants(roomId), JSON.stringify(restaurants), "NX", "EX", ROOM_TTL_SECONDS],
  ]);
  return result === "OK";
}

/**
 * Records a user's swipe and checks for a mutual match.
 */
export async function recordSwipe(
  roomId: string,
  userId: string,
  restaurantId: string,
  direction: "left" | "right",
): Promise<{ success: boolean; isMatch: boolean }> {
  const meta = await getMeta(roomId);
  if (!meta) return { success: false, isMatch: false };

  // Only right swipes matter for matching
  if (direction === "left") {
    await exec(touch(meta));
    return { success: true, isMatch: false };
  }

  const [, , users] = await exec([
    ["SADD", keys.likes(roomId, userId), restaurantId],
    ["EXPIRE", keys.likes(roomId, userId), ROOM_TTL_SECONDS],
    ["SMEMBERS", keys.users(roomId)],
    ...touch(meta),
  ]);

  for (const otherId of (users as string[]).filter((id) => id !== userId)) {
    const [theyLikedIt] = await exec([["SISMEMBER", keys.likes(roomId, otherId), restaurantId]]);
    if (theyLikedIt === 1) {
      // SADD returns 1 only for the request that records the match first
      const [added] = await exec([["SADD", keys.matches(roomId), restaurantId]]);
      return { success: true, isMatch: added === 1 };
    }
  }

  return { success: true, isMatch: false };
}
