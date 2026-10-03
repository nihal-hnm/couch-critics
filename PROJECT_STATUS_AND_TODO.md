# 🎬 Cinema Journal — Project Status & Roadmap (What's Left)

> **Generated:** October 3, 2026  
> **Status:** Backend Migration to Next.js App Router in Progress  
> **Target Deployment:** Vercel (Unified Next.js Full-Stack App)

---

## 📌 Executive Summary

Cinema Journal started as a client-side Next.js 16 app with localStorage and TMDB integration. To support multi-device sync, cloud persistence, user accounts, and media attachments, a backend with PostgreSQL (Supabase) was designed and implemented as an Express 5 service.

Because hosting a separate Express server alongside Next.js on Vercel caused deployment and routing friction, **we are consolidating the architecture into a unified full-stack Next.js application** using native Next.js App Router Route Handlers (`src/app/api/*`).

---

## ✅ 1. What Has Been Done Till Now

### A. Frontend Application (v1.0 Core)
- [x] **Cinematic UI & Layout**: Responsive dark aesthetic with Tailwind CSS v4 and Lucide icons (`src/app/globals.css`, `src/app/layout.tsx`).
- [x] **Three Shelves**:
  - `WatchingShelf.tsx`: Current watch progress, episode counter, seasonal tracking.
  - `ToWatchShelf.tsx`: Watchlist backlog with priority sorting.
  - `WatchedShelf.tsx`: Completed archive with personal ratings, review view, and rewatch count.
- [x] **TMDB Search Integration**: Debounced modal search (`SearchModal.tsx`, `tmdb.ts`) with live poster preview, genre tags, and metadata auto-fill.
- [x] **Analytics Dashboard**: Statistics engine (`stats.ts`, `StatsDashboard.tsx`) computing watch time, genre distribution, rating breakdowns, and monthly viewing trends.
- [x] **Client State Management**: React Context + `useReducer` pipeline with local storage persistence (`journal-context.tsx`, `storage.ts`).

### B. Architecture & Database Design (v2.0)
- [x] **Comprehensive PRD (`prd.md`)**: Full documentation of product requirements, database schemas, API specs, risk mitigations, and milestones.
- [x] **PostgreSQL Schema (`backend/db/schema.sql`)**:
  - `profiles`: User preferences, display name, avatar, bio.
  - `entries`: Movies & TV shows with TMDB metadata, status, episode progress, dates.
  - `reviews`: Private 1-to-1 journal reviews with 10-point rating, markdown body, tags, rewatch flag.
  - `attachments`: File attachments with storage bucket keys and signed URL support.
  - **Security**: PostgreSQL Row Level Security (RLS) policies on all tables ensuring strict user data isolation.
  - **Triggers**: Auto-provisioning profile on Supabase auth signup (`handle_new_user`), automatic `updated_at` timestamps.

### C. Backend Prototype & Controller Logic
- [x] Built out Express 5 controllers and services:
  - `entriesService.ts` / `entriesController.ts`: CRUD, shelf transitions.
  - `reviewsService.ts` / `reviewsController.ts`: Entry review management.
  - `profilesService.ts` / `profilesController.ts`: Profile management.
  - `attachmentsService.ts` / `attachmentsController.ts`: Attachments metadata.
  - `storageService.ts`: Supabase Storage signed upload/download URL generation.
  - Zod validation schemas for all requests.

### D. Migration to Next.js Root (In Progress)
- [x] Installed required backend dependencies in root `package.json`:
  - `@supabase/supabase-js`
  - `zod`
- [x] Created server core utilities under `src/app/api/_lib/` and `src/lib/api/`:
  - `env.ts`: Next.js native environment variable validation (Supabase URL, anon key, service role key).
  - `database.types.ts`: Supabase generated database types.
  - `supabase.ts`: Dual-client pattern (`createScopedClient(jwt)` enforcing RLS, `supabaseAdmin` for system hooks).
  - `errors.ts`: `AppError` and uniform error payload handlers.
  - `auth.ts`: Bearer token extraction and verification helper via Supabase Auth.

---

## 📋 2. What's Left To Do (Action Plan)

### 🔹 Phase 1: Port Validation Schemas & Service Layer to Root
The business logic from Express services must be ported to Next.js server-side modules (in `src/lib/server/` or `src/app/api/_lib/services/`).

- [ ] **Port Zod Schemas**:
  - `entries.schemas.ts` (create, update, shelf transition, query params)
  - `reviews.schemas.ts` (upsert review)
  - `profiles.schemas.ts` (update profile)
  - `attachments.schemas.ts` (register attachment)
- [ ] **Port Services**:
  - `entriesService.ts`: Database queries using the request-scoped Supabase client.
  - `reviewsService.ts`: Review fetch and upsert logic.
  - `profilesService.ts`: Profile fetch and update.
  - `attachmentsService.ts`: Attachment records and storage key management.
  - `storageService.ts`: Signed URL generation for Supabase Storage.

---

### 🔹 Phase 2: Create Next.js API Route Handlers (`src/app/api/...`)
Implement App Router `route.ts` handlers returning standard `Response.json()` with JWT auth protection:

| Method | Next.js Route Path | Purpose | Status |
|---|---|---|---|
| `GET` | `src/app/api/health/route.ts` | Service health check | ⏳ Pending |
| `GET`, `POST` | `src/app/api/entries/route.ts` | List user entries (with shelf filter) & add entry | ⏳ Pending |
| `GET`, `PATCH`, `DELETE` | `src/app/api/entries/[id]/route.ts` | Get single entry with review, update details, or delete | ⏳ Pending |
| `PATCH` | `src/app/api/entries/[id]/shelf/route.ts` | Move entry between shelves (watching, want_to_watch, watched) | ⏳ Pending |
| `POST` | `src/app/api/entries/[id]/upload-url/route.ts` | Create signed upload URL for attachments | ⏳ Pending |
| `POST` | `src/app/api/entries/[id]/download-url/route.ts` | Create signed download URL for attachments | ⏳ Pending |
| `GET`, `POST`, `PATCH` | `src/app/api/entries/[id]/review/route.ts` | Manage entry reviews and ratings | ⏳ Pending |
| `GET`, `POST` | `src/app/api/entries/[id]/attachments/route.ts` | List and register attachments for an entry | ⏳ Pending |
| `DELETE` | `src/app/api/attachments/[id]/route.ts` | Delete an attachment and storage object | ⏳ Pending |
| `GET`, `PATCH` | `src/app/api/profiles/me/route.ts` | Get and update current user profile | ⏳ Pending |

---

### 🔹 Phase 3: Frontend API Integration & Authentication UI
Currently, the frontend reads and writes to `localStorage` via `journal-context.tsx`.

- [ ] **Auth State & UI**:
  - Add Supabase Auth provider / hook for client-side auth (`useUser()`, `useSession()`).
  - Add Login / Sign-up dialog or dedicated auth page (Email/Password or Magic Link / Google OAuth).
- [ ] **API Client (`src/lib/api-client.ts`)**:
  - Centralized fetch wrapper that automatically attaches `Authorization: Bearer <session.access_token>`.
  - Type-safe responses with error handling.
- [ ] **Update `journal-context.tsx`**:
  - Fetch user entries on initial load from `/api/entries`.
  - Dispatch asynchronous updates to `/api/entries` when adding, updating, or deleting entries.
  - Keep optimistic UI updates for instant feedback with rollback on error.
- [ ] **Optional LocalStorage Fallback**:
  - Allow unauthenticated "guest mode" using localStorage, with a "Sync to Cloud" option when logging in.

---

### 🔹 Phase 4: Supabase Cloud Setup & Configuration
- [ ] **Run Migration Script**: Execute [`backend/db/schema.sql`](file:///C:/Users/harsh/.gemini/antigravity-ide/cinema-journal/backend/db/schema.sql) in the Supabase SQL Editor.
- [ ] **Create Storage Bucket**: Create a private storage bucket named `attachments` in Supabase Storage with size limits (e.g., 10MB per file).
- [ ] **Set Environment Variables**:
  - In `.env.local` for local dev:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
    SUPABASE_SERVICE_ROLE_KEY=eyJ...
    NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key
    ```
  - In Vercel Project Settings for production deployment.

---

### 🔹 Phase 5: Cleanup, Build Verification & Vercel Deployment
- [ ] **Remove/Archive `backend/` Folder**:
  - Remove obsolete Express dependencies and files from git tracking to prevent build conflicts.
  - Clean up `vercel.json` rewrites (Next.js automatically serves `/api/*` routes without special rewrites).
- [ ] **Build Check**:
  - Run `npm run build` locally to verify TypeScript types, linting, and Next.js route bundling.
- [ ] **Deploy**:
  - Push to GitHub and deploy to Vercel with zero extra serverless configuration required.

---

## 🗺️ Next Steps Priority Order

1. **Step 1 (Immediate)**: Port the Zod schemas and Service files into `src/lib/server/` or `src/app/api/_lib/`.
2. **Step 2**: Create the Next.js API Route Handlers in `src/app/api/` matching all Express endpoints.
3. **Step 3**: Clean up `vercel.json` and remove the legacy `backend/` references.
4. **Step 4**: Test `npm run build` and route responses locally.
5. **Step 5**: Wire frontend authentication and API sync into `journal-context.tsx`.
