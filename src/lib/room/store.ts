/**
 * Minimal key-value store for room state.
 *
 * Production (Vercel): Upstash Redis over its REST API. Serverless functions do
 * not share memory, so rooms must live outside the process. Connect Upstash from
 * Vercel's Storage tab; it injects either UPSTASH_REDIS_REST_* or KV_REST_API_*.
 *
 * Local development: falls back to in-process maps when no credentials are set.
 */

type Command = (string | number)[];

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const usingRedis = Boolean(REDIS_URL && REDIS_TOKEN);

/** Runs commands in order and returns each command's result. */
export async function exec(commands: Command[]): Promise<unknown[]> {
  return usingRedis ? redisPipeline(commands) : commands.map(memoryExec);
}

async function redisPipeline(commands: Command[]): Promise<unknown[]> {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis request failed: ${res.status}`);
  const results = (await res.json()) as { result?: unknown; error?: string }[];
  return results.map((r) => {
    if (r.error) throw new Error(`Redis error: ${r.error}`);
    return r.result;
  });
}

// ── In-memory fallback (development only) ────────────────────────────────────
// Implements just the commands used by the room manager, with Redis semantics.

type Entry = { value: string | Set<string>; expiresAt?: number };

const g = globalThis as typeof globalThis & { __rescho_store__?: Map<string, Entry> };
const memory = (g.__rescho_store__ ??= new Map<string, Entry>());

function live(key: string): Entry | undefined {
  const entry = memory.get(key);
  if (entry?.expiresAt && entry.expiresAt < Date.now()) {
    memory.delete(key);
    return undefined;
  }
  return entry;
}

function set(key: string): Set<string> {
  const entry = live(key);
  if (entry?.value instanceof Set) return entry.value;
  const created = new Set<string>();
  memory.set(key, { value: created, expiresAt: entry?.expiresAt });
  return created;
}

function memoryExec([cmd, key, ...args]: Command): unknown {
  const k = String(key);
  switch (String(cmd).toUpperCase()) {
    case "GET": {
      const v = live(k)?.value;
      return typeof v === "string" ? v : null;
    }
    case "SET": {
      // Supports: SET key value [NX] [EX seconds]
      const [value, ...opts] = args.map(String);
      const nx = opts.includes("NX");
      const exIndex = opts.indexOf("EX");
      if (nx && live(k)) return null;
      memory.set(k, {
        value,
        expiresAt: exIndex >= 0 ? Date.now() + Number(opts[exIndex + 1]) * 1000 : undefined,
      });
      return "OK";
    }
    case "EXPIRE": {
      const entry = live(k);
      if (!entry) return 0;
      entry.expiresAt = Date.now() + Number(args[0]) * 1000;
      return 1;
    }
    case "SADD": {
      const s = set(k);
      let added = 0;
      for (const m of args.map(String)) {
        if (s.has(m)) continue;
        s.add(m);
        added++;
      }
      return added;
    }
    case "SREM": {
      const s = set(k);
      let removed = 0;
      for (const m of args.map(String)) if (s.delete(m)) removed++;
      return removed;
    }
    case "SISMEMBER":
      return set(k).has(String(args[0])) ? 1 : 0;
    case "SCARD":
      return set(k).size;
    case "SMEMBERS":
      return [...set(k)];
    default:
      throw new Error(`Unsupported command in memory store: ${cmd}`);
  }
}
