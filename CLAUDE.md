# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build + type check
npm run lint     # ESLint
```

There are no tests configured.

## Architecture

Next.js 16 App Router project. All pages use the `app/` directory with file-based routing.

**Data flow:** All TMDB API calls go through internal API routes (`app/api/`) to keep `TMDB_API_KEY` server-side only. Client components never call TMDB directly.

**Streaming embed:** VidKing is used purely as an `<iframe>` embed — no SDK, no auth. URLs follow:
- Movies: `https://www.vidking.net/embed/movie/{tmdbId}`
- TV: `https://www.vidking.net/embed/tv/{tmdbId}/{season}/{episode}`

**Page types:**
- `app/page.tsx` — Client component. Search bar + results grid. Calls `/api/search`.
- `app/movie/[id]/page.tsx` — Server component. Fetches movie details directly from TMDB, renders VidKing iframe.
- `app/tv/[id]/page.tsx` — Client component (needs interactive season/episode switching). Uses `React.use(params)` for param unwrapping, calls `/api/tv/[id]` and `/api/tv/[id]/season/[season]`. Remounts iframe via `key` prop when episode changes.

**API routes** (`app/api/`):
- `search/route.ts` — Proxies `GET /api/search?q=&type=movie|tv` to TMDB search.
- `tv/[id]/route.ts` — TV show details + seasons list.
- `tv/[id]/season/[season]/route.ts` — Episode list for a season.

## Environment

Requires `.env.local` with:
```
TMDB_API_KEY=your_tmdb_api_key_here
```

Get a free key at themoviedb.org → Settings → API.

## Key conventions

- `params` is a `Promise` in Next.js 16 — always `await params` in server components, `use(params)` in client components.
- Tailwind v4 is used (`@import "tailwindcss"` in globals.css, no `tailwind.config`).
- Path alias `@/*` maps to the repo root.
- TMDB image base URL: `https://image.tmdb.org/t/p/w342` (configured in `next.config.ts` remotePatterns).
