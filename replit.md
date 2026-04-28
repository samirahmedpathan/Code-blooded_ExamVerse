# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: Gemini via Replit AI Integrations (`lib/integrations-gemini-ai`); used by `POST /api/mentor/chat` to power the Examverse AI Mentor (model: `gemini-2.5-flash`).

## Authentication

Real database-backed auth lives in `lib/db/src/schema/users.ts` (`users` and `password_resets` tables) and `artifacts/api-server/src/routes/auth.ts`. Passwords are hashed with **bcryptjs (cost 12)**; sessions are stateless **JWTs** signed with `SESSION_SECRET` (HS256, 30-day TTL). The frontend calls the API through a Vite dev proxy (`/api → http://localhost:8080`) and stores the token in `localStorage` under `examverse:token`. On boot, `AuthProvider` calls `GET /api/auth/me` to validate the token. Routes:
- `POST /api/auth/signup` — creates user (email must be unique, case-insensitive), returns `{ token, user }`.
- `POST /api/auth/login` — verifies bcrypt hash, returns `{ token, user }`. Both unknown user and wrong password return the same generic message `"Invalid username or password."` to avoid user enumeration.
- `GET /api/auth/me` — bearer-protected, returns the current user.
- `POST /api/auth/forgot-password` — generates a SHA-256-hashed 32-byte reset token (stored in `password_resets`, expires in 30 min). Always returns `{ ok: true }` to avoid leaking which emails are registered. In dev (`NODE_ENV !== "production"`) the raw token is also returned so the user can preview the reset link without an email service.
- `POST /api/auth/reset-password` — accepts `{ token, password }`, validates against the hashed token, marks it `usedAt`, updates the bcrypt hash. Reset rows are single-use.

Frontend pages: `/login`, `/signup`, `/forgot-password`, `/reset-password?token=…`. The login form remembers credentials locally (`examverse:remembered`) for auto-fill — that's separate from the JWT and is cleared on logout.

## Examverse Domain Modules

- **Schemes** (`artifacts/examverse/src/lib/schemes.ts` + `pages/app/schemes.tsx`): Curated yearly Government of India schemes (PM-KISAN, Ayushman Bharat, PLI, Digital India, Agnipath, etc.) tagged with `launchedYear`, `lastUpdatedYear` (auto-rolls to current year) and a `yearlyUpdate` note. Filterable by exam relevance and category. Top 2 schemes also surface on the dashboard.
- **Careers** (`artifacts/examverse/src/lib/careers.ts` + `pages/app/careers.tsx`): Per-exam career pathway map (e.g. UPSC → IAS/IPS/IFS, GATE → PSU + IISc/DRDO, BANK → PO/SBI/RBI Grade B). Each job has title, category, description and pay band. Surfaced as a sidebar tab and a top-3 quick card on the dashboard.
- **Analytics DB** (`lib/db/src/schema/analytics.ts`): Three Postgres tables — `quiz_attempts`, `study_sessions`, `daily_metrics` — with composite indexes on `(user_id, date)` and `(user_id, exam_code)`. Mutations done via API endpoints `POST /api/analytics/attempts`, `POST /api/analytics/sessions`. Read endpoint `GET /api/analytics/summary/:userId` returns 7-day trend, per-subject aggregates and 30 days of daily metrics computed with SQL `GROUP BY` + `SUM`. Run `pnpm --filter @workspace/db run push` after any schema change.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
