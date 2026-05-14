# Palmara — Claude Code Instructions

## What this app is
Palmara is a palm reading web app. Users upload a palm photo, pick a reading category and up to 2 mentor personas, then get a Claude-powered reading + personalized growth plan. PDF export included.

## Stack
- **Next.js 16** (App Router), **React 19**, **Tailwind v4**, **TypeScript**
- Single-page app — all UI lives in `app/page.jsx` (client component)
- API proxy at `app/api/reading/route.ts` — forwards requests to Anthropic
- `ANTHROPIC_API_KEY` in `.env.local` — never commit this

## App flow
1. **Home** — pick category (Love / Business / Health / Full Soul)
2. **Persona** — pick up to 2 mentors (Kobe, Jobs, Tyson, Oprah, Ronaldo, Jordan, Musk, Martha, Tony)
3. **Upload** — choose hand (left/right), optional zodiac, upload palm photo
4. **Loading** → **Result** — reading displayed, growth plan pillars below
5. Optional: scan second hand for combined deeper reading (`firstHandReading` state)
6. **PDF export** — generates styled HTML blob, triggers download

## Key state variables (page.jsx)
- `step` — "home" | "persona" | "upload" | "loading" | "result"
- `category` — selected CATEGORY object
- `selectedPersonas` — array of persona IDs (max 2)
- `imageB64` / `imageMediaType` — palm photo as base64
- `reading` — Claude reading text
- `suggestions` — object keyed by pillar ID
- `freeUsed` — whether the free reading has been used (paywall trigger)
- `firstHandReading` — stores first hand reading text when doing dual-hand

## Paywall logic
- First reading is always free (any category)
- After `freeUsed = true`, "health" and "full" categories show `<Paywall>` modal
- Love and Business remain free after first use
- Paywall shows $9.99/mo CTA — payment not yet wired up

## API call pattern
All Claude calls go through `callClaude(messages, system)` which POSTs to `/api/reading`. The route forwards the full body to Anthropic. Model: `claude-sonnet-4-6`, max_tokens: 1000.

## Styling conventions
- All styles are inline (no Tailwind classes in JSX yet — Tailwind is in globals.css only)
- Dark theme: base background `#09070f`, accent gold `#c9a84c`, accent purple `#9b7fe8`
- Fonts: Cormorant Garamond (headings/logo), Crimson Text (body) — loaded via Google Fonts in `<style>` tag
- Animations via CSS keyframes injected in `<style>` tags inside components

## What NOT to do
- Do not split into multiple files unless the user asks — keeping it single-file is intentional for simplicity
- Do not add a database or auth — the app is intentionally stateless
- Do not change the model from `claude-sonnet-4-6` without being asked
- Do not add comments explaining what code does — only add comments for non-obvious WHY

## Public folder
`public/` — check here for any static assets (images, icons) before creating new ones

## Running locally
```
npm run dev   # starts on localhost:3000
npm run build # production build
```
