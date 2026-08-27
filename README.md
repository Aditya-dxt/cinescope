# CineScope — Movie Discovery App

Independent React app for **FlyRank AI Internship — Frontend AI Engineering (Week 3)**
Track: *React app development with AI* — built with AI as a development assistant.

Live: _(add Vercel URL after deploy)_ · Repo: `Aditya-dxt/cinescope`

Reference session: Ishak — *React Frontend Development with AI: From Prompt to Working Feature* (https://www.youtube.com/watch?v=pYhYlcmFOwU) — Movie search demo with Vite + React + TS + MVVM + OMDb + Firebase. This app is an **independent rebuild** with distinct design, data flow, and improvements — not a clone.

## Stack
Vite + React + TypeScript + React Router · MVVM (Model / useViewModel / View) · OMDb API · Firebase Auth + Firestore (with localStorage fallback) · No UI library

## Features
- Header with Home / Favourites / Auth + global search (desktop pill + mobile sheet)
- Home: random 20-movie discovery on load (seed keywords → parallel fetches → dedupe → shuffle), search, loading/error/empty states, poster fallback
- MovieCard reusable (poster, year, type, favourite action)
- Favourites per-user: `users/{uid}/favourites/{imdbID}` in Firestore when configured, otherwise localStorage `cinescope_favs_{uid}` — works in demo without Firebase keys
- Auth: email/password (register/login/logout), AuthContext with `onAuthStateChanged`, protected `/favourites` → redirect to `/auth`, `/auth` → redirect to `/` when already signed in
- Home reload bugfix: clearing search or revisiting Home reloads random movies
- Demo mode: if `VITE_OMDB_API_KEY` missing, uses curated mock titles so the app is reviewable without keys

## Run locally
```bash
npm install
cp .env.example .env   # add VITE_OMDB_API_KEY and optionally VITE_FIREBASE_* 
npm run dev            # http://localhost:5173
npm run build && npm run preview
```
Get OMDb key: https://www.omdbapi.com/apikey.aspx (free). Firebase: create project → enable Email/Password Auth + Firestore.

## Env
```
VITE_OMDB_API_KEY=your_key
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Prompts used (in order)

1. **Scaffold**
> Initialize Vite React TypeScript app (functional components only). No UI library. Clean default content.

2. **Types & services shell**
> Create types/Movie, OmdbSearchResponse. Create empty services/omdbService.ts with comment that it will talk to OMDb.

3. **OMDb service**
> Implement searchMovies(query): use OMDb API, read VITE_OMDB_API_KEY, encode query, use Movie types, throw readable errors for network and Response: "False". Do not use hooks. Also add hasOmdbKey() and mock fallback when key missing.

4. **Firebase config**
> Create services/firebaseService.ts: initialize Firebase from Vite env, export auth, db, hasFirebase flag. Do not add favourites yet.

5. **Auth service**
> Create services/authService.ts with registerUser, loginUser, logoutUser, subscribeToAuthChanges using modular Firebase SDK. Map Firebase errors to readable messages. No hooks.

6. **Favourites service (Firestore + LS fallback)**
> Implement addFavourite(userId, movie), removeFavourite(userId, imdbID), getFavourites(userId) using users/{uid}/favourites/{imdbID}. If Firebase not configured, fall back to localStorage. Throw when userId missing in strict mode.

7. **MVVM scaffolds**
> Create empty HomeModel/useHomeViewModel/HomeView and FavouritesModel/useFavouritesViewModel/FavouritesView and AuthModel/useAuthViewModel/AuthView with placeholder exports so app compiles.

8. **HomeModel**
> Implement getMovies(query) (trim, validate >=2 chars, call searchMovies) and initialMovies() (pick 4 random seeds, Promise.all parallel, merge, dedupe by imdbID, pad, shuffle, return 20). No hooks.

9. **useHomeViewModel**
> Manage query/movies/loading/initialLoading/error/favFeedback. Implement handleSearch, clearSearch, loadInitial (initialMovies on mount), handleFavourite (redirect to /favourites if unauth, else addFavourite).

10. **MovieCard**
> Reusable MovieCard({movie, onFavourite, onRemove}) — poster with fallback, title/year/type, favourite/remove buttons, presentational only.

11. **HomeView + Header**
> Header with Home, Favourites, search input + button, user chip + logout. HomeView shows hero, banner when demo mode, toolbar count, grid, skeletons, error/toast/empty states.

12. **Favourites MVVM**
> FavouritesModel wrapper, useFavouritesViewModel (load on mount via useEffect, removeMovie updates local state), FavouritesView (loading/error/empty + grid, unauth card with CTA).

13. **Auth MVVM + Context**
> AuthModel validates email/password, AuthView controlled inputs + mode toggle, AuthContext with onAuthStateChanged + logout + loading screen, wrap App.

14. **Routing**
> BrowserRouter: / → Home, /favourites → Favourites (redirect to /auth if guest), /auth → Auth (redirect to / if authed), preserve Header everywhere.

15. **Styling**
> Dark cinematic theme, glass header, pill search, responsive grid (5-col), hover lift, shimmer skeletons, toast.

---

## How AI assisted

- **Scaffolding & boilerplate:** AI generated initial Vite clean-up, type definitions, service shells, and MVVM folder structure from concise prompts — saved ~2h of manual typing.
- **API wiring:** AI drafted `searchMovies` with proper encoding, error handling, and the seed-based `initialMovies` parallel logic. I reviewed and added mock fallback and curated poster URLs.
- **Firebase isolation:** AI kept Firebase out of components (services only) per MVVM prompt; I added the localStorage fallback so reviewers can test without env keys.
- **MVVM discipline:** AI was instructed to keep Models hook-free and Views hook-only — I enforced this by rejecting AI suggestions that mixed concerns (e.g., fetching inside View).
- **Iteration:** Used AI to style Header and MovieCard, then manually tuned CSS variables, responsive breakpoints, and accessibility (poster fallback, aria, keyboard form submit).

Workflow: prompt → AI output → manual review in editor → run `npm run build` + manual click-through → fix → repeat. Every AI block was read, tested, and committed by me.

## Manual improvements / corrections after reviewing AI code

1. **Demo-mode fallback:** AI initially threw hard error when `VITE_OMDB_API_KEY` missing. I added `hasOmdbKey()` + `getMockMovies()` and filtered mock search so the app is demoable for reviewers.
2. **Per-user favourites fallback:** AI assumed Firestore always available. I added dual-write (Firestore + localStorage) and read-through fallback, plus `LS_GUEST` handling, so guest flow doesn't crash.
3. **Home reload bug:** AI left stale `movies` after search → Home showed empty on revisit. I added `clearSearch()` → `loadInitial()` and toolbar "Clear → random" so empty query repopulates 20 random titles.
4. **Poster N/A handling:** AI rendered broken `<img>` for `Poster: "N/A"`. I added `N/A` check + `onError` fallback to placeholder and `loading="lazy"`.
5. **Header ↔ Home state:** AI put search only in Header with no wiring. I introduced custom events (`cinescope:search` / `cinescope:clear`) and `HomeViewWrapper` to bridge Header input to Home's ViewModel without lifting all state.
6. **Security & bundle:** AI imported entire Firebase in one chunk. I kept modular imports and noted chunk warning; verified `tsc -b && vite build` passes with `hasOmdbKey` banner logic.
7. **Auth UX:** AI didn't redirect authed user from `/auth`. I added `<Navigate to="/" replace />` when `user` exists and success → auto-navigate after 600ms.
8. **CSS polish:** AI's header was flat; I added sticky glass (`backdrop-filter`), pill search, 5-col grid, shimmer skeletons, and toast for favourite feedback — additive only, no logic change.

## Submission
- Live app: _(Vercel link)_
- Repo: https://github.com/Aditya-dxt/cinescope
- Video reference: https://www.youtube.com/watch?v=pYhYlcmFOwU
- Assignment: `internship.flyrank.ai/intern/assignments/CUSTOM-MRC9R0VW-1B5749AA`
