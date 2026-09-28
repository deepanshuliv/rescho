# RESCHO

A web app for two people to decide where to eat: both join a room with a 6-character code, swipe through nearby restaurants, and get a match when they both swipe right on the same place.

Personal project. Runs locally with no external services beyond Clerk, and deploys to Vercel with an Upstash Redis store (see [Deploying to Vercel](#deploying-to-vercel)).

## Quick start

Requires Node.js 20.9 or later (the minimum for Next.js 16).

```bash
npm install
```

Copy the example env file and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Yes | Clerk sign-in, needed to create a room. The build fails without the publishable key. |
| `FOURSQUARE_API_KEY` | No | Real restaurant data. Without it, 15 built-in mock restaurants are served. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | On Vercel | Shared room storage. Locally, rooms fall back to process memory. `KV_REST_API_URL` / `KV_REST_API_TOKEN` are also accepted. |

```bash
npm run dev
```

Open http://localhost:3000. To try the full flow alone, use two browser windows (for example one normal, one private):

1. Window A: **Get Started** → sign in → pick a city → **Continue**. Note the room code, then **Start Swiping**.
2. Window B: **Join Room** → enter the code. No sign-in is needed to join.
3. Swipe right on the same restaurant in both windows to trigger a match.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

There is no test suite.

## How it works

The app is a single Next.js (App Router) project: pages plus API route handlers. Room state goes through a small key-value layer in `src/lib/room/store.ts`, which uses Upstash Redis over its REST API when credentials are set and in-process maps otherwise.

1. **Location.** `/location` uses the browser's geolocation or a city search. Both call the public [Nominatim](https://nominatim.openstreetmap.org) API directly from the browser. The chosen location is kept in `sessionStorage`.
2. **Create.** `/room/create` is the only route protected by Clerk (`src/proxy.ts`). It calls `POST /api/rooms/create`, which claims a unique 6-character code (`SET NX`) and stores the room. Rooms expire after two hours without activity. Codes use `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, so look-alike characters such as `0`/`O` and `1`/`I` are excluded.
3. **Restaurants.** On first request, the server fetches up to 15 restaurants near the room's location from Foursquare's `places/search` endpoint, sorted by distance with a 4-second timeout. It stores them on the room with a first-write-wins `SET NX`, so both people always swipe the same list, and the creator's page caches that same list for an instant start. If the key is missing, the request fails, or no results come back, it returns mock data from `src/lib/api/foursquare.ts`.
4. **Join.** `/room/join` posts the code to `POST /api/rooms/join`. A room holds at most two people. Share links take the form `/room/join?code=XXXXXX` and prefill the code.
5. **Swipe.** Each swipe is sent to `POST /api/rooms/swipe`. Right swipes go into a per-user Redis set. When the other person's set already contains the restaurant, it is added to the room's match set; only the request that adds it reports `isMatch`, so simultaneous swipes produce one match, not two.
6. **Sync.** There are no WebSockets. The swipe page polls `GET /api/rooms/[roomId]/state` every 2.5 seconds, and again 300 ms and 1.2 s after a right swipe, to pick up partner status and new matches.

Each browser tab identifies itself with a random UUID kept in `sessionStorage`. This ID is separate from the Clerk account.

### API routes

All routes are in `src/app/api/`.

| Route | Purpose |
| --- | --- |
| `POST /api/rooms/create` | Create a room from `{ location, userId? }` |
| `POST /api/rooms/join` | Join by `{ code, userId }` |
| `GET /api/rooms/[roomId]/state?userId=` | Room status, partner presence, restaurant list, match IDs |
| `POST /api/rooms/swipe` | Record `{ roomId, userId, restaurantId, direction }`, report a match |
| `GET /api/rooms/[roomId]/matches` | Matched restaurants as full objects |
| `GET /api/restaurants?lat=&lng=&limit=` | Restaurant search (Foursquare or mock) |
| `GET /api/rooms/list` | Debug listing of rooms (development only; 404 in production) |

The restaurant endpoint works without a Foursquare key, which makes it a quick way to check the server:

```bash
curl "http://localhost:3000/api/restaurants?lat=28.6139&lng=77.209&limit=3"
```

## Project structure

```
src/
  app/
    api/              route handlers listed above
    location/         city search and geolocation
    room/create/      create a room, share the code
    room/join/        enter a code
    room/[roomId]/    swipe screen, matches drawer
    sign-in/ sign-up/ Clerk pages
  components/
    landing/          navbar, hero, landing sections
    swipe/            card stack, swipe card, match modal
    ui/               shared button, header, page shell, logo, share sheet
  lib/
    api/foursquare.ts Foursquare client and mock data
    room/             room logic, Redis/in-memory store, code generator
  proxy.ts            Clerk middleware (protects /room/create)
```

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Clerk, axios.

## Deploying to Vercel

1. Import the repository in Vercel. The framework preset is detected as Next.js; no build settings need changing. `package-lock.json` is the only lockfile, so Vercel installs with npm.
2. In **Storage**, connect an **Upstash Redis** database to the project. This sets the Redis REST credentials. Without it, each serverless function has its own memory, and rooms created in one request are not found in the next.
3. In **Settings → Environment Variables**, add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` and, optionally, `FOURSQUARE_API_KEY`.
4. Redeploy.

## Limitations

- **Without Redis, rooms live in process memory.** That is fine for `npm run dev` or a single `npm run start` process, but not for serverless or multi-instance hosting.
- **Location search depends on Nominatim**, a free public service with its own usage policy.
- **No tests or CI.**

## Not yet built

From the original proposal: choosing cuisine and meal type (breakfast, lunch, dinner) when creating a room, and fetching suggestions based on those choices.

`rescho-restaurant-matcher.md` is the original implementation plan. It describes a Socket.io server that was never built; the app uses the polling approach above instead.

## License

No license file is included.
