# RESCHO

A web app for two people to decide where to eat: both join a room with a 6-character code, swipe through nearby restaurants, and get a match when they both swipe right on the same place.

Personal project. Live at https://rescho.deepanshu.live, hosted on Render (see [Deploying](#deploying)).

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
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Serverless only | Shared room storage. Without it, rooms live in process memory. `KV_REST_API_URL` / `KV_REST_API_TOKEN` are also accepted. |

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
| `npm run start:render` | Same as `start`; the start command configured on Render |
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
| `GET /health` | Health check used by Render |

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

## Deploying

### Render (current production)

A Render web service builds from `main` and runs:

| Setting | Value |
| --- | --- |
| Start command | `npm run start:render` (alias for `next start`, which listens on Render's `PORT`) |
| Health check path | `/health` |
| Environment | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `FOURSQUARE_API_KEY` |

Render runs one long-lived Node process, so rooms work from process memory without Redis. They are lost whenever the service restarts or redeploys; adding the Upstash variables keeps them across restarts.

### Vercel

Vercel runs API routes as separate serverless functions that do not share memory, so it needs Upstash Redis:

1. Import the repository. The Next.js preset needs no build changes; `package-lock.json` is the only lockfile, so Vercel installs with npm.
2. In **Storage**, connect an **Upstash Redis** database. This sets the Redis REST credentials.
3. Add the Clerk keys (and optionally `FOURSQUARE_API_KEY`) under **Settings → Environment Variables**, then deploy.

## Limitations

- **Without Redis, rooms live in process memory.** That works for `npm run dev` or a single server process (as on Render), but rooms reset on restart and cannot be shared across serverless or multiple instances.
- **Location search depends on Nominatim**, a free public service with its own usage policy.
- **No tests or CI.**

## Not yet built

From the original proposal: choosing cuisine and meal type (breakfast, lunch, dinner) when creating a room, and fetching suggestions based on those choices.

`rescho-restaurant-matcher.md` is the original implementation plan. It describes a Socket.io server that was never built; the app uses the polling approach above instead.

## License

No license file is included.
