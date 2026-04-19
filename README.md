# StreAnime — Mini anime streaming demo

Student-level full-stack app: React (Vite) + Express + MongoDB with JWT auth, watch history, and a simple favorites list.

## Prerequisites

- **Node.js** 18+ recommended  
- **MongoDB** running locally (or a connection string to Atlas)

## 1. Backend setup

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

- `MONGODB_URI` — default `mongodb://127.0.0.1:27017/streanime` works with local MongoDB  
- `JWT_SECRET` — any long random string for development  
- Optional: `CLIENT_ORIGIN` if the React app runs on a non-default URL  
- Optional: `PORT` (defaults to `5000`)

Install and run:

```bash
npm install
npm run dev
```

API base: `http://localhost:5000/api`

## 2. Frontend setup

In a **second terminal**:

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` to the Express server on port 5000.

For a **production build** of the client, set `VITE_API_URL` in `client/.env` to your deployed API URL (see `client/.env.example`).

## Features (quick map)

| Area | Behavior |
|------|-----------|
| Auth | Register / login stores JWT in `localStorage`; logout clears it |
| Catalog | Mock anime list in `server/src/data/animeCatalog.js` |
| Watch | HTML5 `<video>`; progress saved every few seconds + on pause |
| History | Logged-in users: MongoDB via `POST/GET /api/watch-history` |
| Guests | Optional `localStorage` fallback for continue watching |
| Favorites | `User.watchlistAnimeIds` in MongoDB; **My list** page (protected) |

## API overview

- `POST /api/auth/register` — `{ email, password }`  
- `POST /api/auth/login` — `{ email, password }`  
- `GET /api/auth/me` — Bearer JWT  
- `GET /api/anime?search=` — list (public)  
- `GET /api/anime/:id` — detail + episode `src` (demo sample MP4)  
- `GET/POST /api/watch-history` — Bearer JWT  
- `GET/POST/DELETE /api/watchlist/:animeId` — Bearer JWT  
- `GET /api/play/:animeId/episodes/:episodeId` — Bearer JWT (optional; UI uses catalog `src`)

## Project layout

```
client/src   — pages, components, context, services
server/src   — models, routes, controllers, middleware, data
```

## Notes

- Video URLs point to a **public sample MP4** (Big Buck Bunny) for every episode so the player works without hosting your own files.  
- This is **not** production streaming infrastructure — keep scope educational and simple.
