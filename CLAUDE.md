# CLAUDE.md

When I say "จด" after finishing a feature or function, do the following:

1. Append a structured entry to @docs/functions-log.md in this format:
   ## [function/feature name] — [date]
   - **Purpose:** what it does
   - **Location:** file path & function name
   - **Inputs/Outputs:** key params and return values
   - **Gotchas:** non-obvious behavior, edge cases, or decisions made

2. If it introduces a new pattern or convention, also update @docs/conventions.md

3. If it changes system architecture, also update @docs/architecture.md

4. Never summarize or overwrite existing entries — always append.

Thai-language auction/marketplace on **Next.js 16 App Router** (`.jsx`/`.js`, `strict: false`). Stack: Supabase (Postgres + Auth + Storage + Realtime), Redux Toolkit, Ant Design 6 (Thai locale `th_TH`, volcano palette) + Tailwind 4. Mid-development: auth/DB/admin in place; payment & shipping flows still being built. No test runner.

## Response Rules

- Answer shortly. No unnecessary explanation. Code first. Bullet points only.
- Ask before giving long examples.

## Commands

- `npm run dev` (port 3000) · `npm run build` · `npm start` · `npm run lint`
- **⚠️ `npm run lint` prints errors but exits 0** — verify real breakage with `npm run build`. See @docs/commands.md

## Reference docs

- @docs/architecture.md — route groups, DB schema, and all flows: auction end, bid, checkout, payment/Omise, wallet, KYC, shipment, admin pages, realtime
- @docs/conventions.md — coding style, naming, forms, UI, admin page pattern
- @docs/security.md — auth helpers, RLS, rate limiting, storage, headers, XSS, the full iron-rules list

## Architecture essentials

### Route groups
- `app/(public)/` listings · `app/(auth)/` login/register · `app/(authenticated)/` checkout/orders/dashboard · `app/admin/` (role-gated)
- `proxy.js` (Next 16 names middleware `proxy`) guards `/admin/*` via `profiles.role === 'admin'`; redirects authed users off `/login`.

### Supabase clients
- Browser: `app/lib/supabase/client.js` (`ANON_KEY`)
- Server/admin: `app/lib/supabase/admin.js` (`SERVICE_ROLE_KEY`, `server-only` — **never import in a client component**)
- All queries go through `app/services/`; admin services in `app/services/admin/` (must call `await requireAdmin()` first line — they're auto-exposed as POST endpoints).

### State & data fetching
- Single Redux slice `app/features/user/userSlice.js`: `fetchUser`, `clearUser`, `setWalletBalance`.
- **⚠️ `fetchUser` is NOT dispatched on app load** — only some pages dispatch it. New pages needing the user id should call `supabase.auth.getUser()` directly (the checkout pattern).
- `notifyError()` auto-translates Supabase errors to Thai via `app/utils/supabaseErrorMap.js` — add new messages only to `errorMap` there.

### Database (Supabase / Postgres) — schema in `db/00_schema.sql`
- Core tables: `profiles` (extends `auth.users`; `role`, `is_kyc`), `products`, `bids`, `auction_results`, `payments`, `wallet_transactions`, `shipments`, `notifications`, `categories` (hierarchical via `parent_id`). Full table notes in @docs/architecture.md.
- **Product lifecycle**: `draft` → `pending_review` → `active` → `sold` (has winner) / `cancelled` (no bid); after payment seller sets shipping → `order`; `rejected` comes from `pending_review`. **No `ended` state.** Helper: `app/utils/mapProductState.js`.
- **`products.start_price` = current price / floor for the next bid** — updated on every successful bid via `updateProductPrice()`. There is no separate `current_price` column.
- `profiles` has no `email` column (it lives in `auth.users`) — query the `users_full` view (service_role only).

### Auction end (client-triggered)
- Timer in `CardProductBid` hits 0 → `POST /api/auction/end` (idempotent, uses `supabaseAdmin`): writes `auction_results`, marks winning bid, notifies, sets product `sold`/`cancelled`.
- **⚠️ No server cron** — if nobody opens the page, status sticks at `active`. `endExpiredActiveAuctions()` reconciles on `/user/selling` mount. Details in @docs/architecture.md.

### Realtime
- Supabase **Broadcast** (not Postgres replication). Channels: `bid-{productId}` (price/bid updates), `wallet-{userId}` (empty-payload refresh signal). Use the `supabase` singleton from `app/lib/supabase/client.js`.

## Key conventions

- `@/` alias → project root. PascalCase components (`CardProduct.jsx`), camelCase services (`*.service.js`).
- Forms: React Hook Form + Yup via custom wrappers (`UseButton`, `UseSelect`, `UseUpload`, …) in `app/components/`.
- **⚠️ Tailwind 4 + `sr-only`**: hidden radio/`has-checked:` visual states don't work — use `<div onClick>` + conditional className for selectable cards.
- Full patterns in @docs/conventions.md.

## Security rules (full detail @docs/security.md)

- **Admin Server Action** → `await requireAdmin()` as the first line.
- **Mutation route handler** → `requireUser()` + verify ownership from DB; **never trust `userId` from the body**.
- **Money/price math** → server-side from DB only (`final_price * 1.05`); clamp topup 20–100,000 ฿.
- **Omise webhook** → re-fetch the charge from Omise (don't trust the body); verify amount.
- **New POST endpoint** → add `rateLimit()`.
- **Inline JSON in `<script>`** → `jsonLdSafe()` only.
- **User-forbidden columns** → add to the `"update own profile"` `WITH CHECK` + transition via a SECURITY DEFINER RPC.
- **Promoting an admin** → update BOTH `profiles.role` AND `auth.users.raw_app_meta_data` (`{"role":"admin"}`).
- **DO NOT use the `omise` npm package** (ESM interop broken) — `fetch` via `omiseFetch`.

### Env vars (security-relevant)
- Server-only secrets: `SUPABASE_SERVICE_ROLE_KEY`, `OMISE_SECRET_KEY`, `OMISE_WEBHOOK_USER`/`OMISE_WEBHOOK_PASSWORD`.
- `NEXT_PUBLIC_*` is exposed to the client — never put a secret there.
