# Conventions & Patterns

Project-specific coding style and reusable patterns. Standard library behavior is assumed — only deviations are documented here.

## Imports & Naming

- **Imports**: `@/` alias maps to the project root (`app/`, `db/`, etc.)
- **TypeScript**: `strict: false`; most files are `.jsx` / `.js`
- **Component naming**: PascalCase files (`CardProduct.jsx`)
- **Service naming**: camelCase ending in `.service.js`
- **Supabase admin client** must never be imported in client components (marked `server-only`)

## Forms & Validation

- React Hook Form + Yup + `@hookform/resolvers`.
- Custom wrapper components (`UseButton`, `UseSelect`, `UseUpload`, etc.) live in `app/components/` — use these instead of raw Ant Design inputs.

## UI Stack

- **Ant Design 6.3.5** — Thai locale (`th_TH`), volcano color palette
- **Tailwind CSS 4** — utility classes alongside Ant Design
- **HolyLoader** — page transition bar in root layout
- Max-width container: `360px` base with responsive padding
- **⚠️ Tailwind 4 + `sr-only` gotcha**: hidden radio/checkbox visual states (`has-checked:`) don't work. For selectable cards use `<div onClick>` + conditional className driven by state (see checkout payment-method picker and address card).

## Admin list page pattern

`"use client"` → `useEffect` fetch service → map → `UseTable` inside wrapper `bg-white rounded-xl shadow-sm border border-slate-100`.

- All admin pages use a service from `app/services/admin/*.service.js` (`"use server"`) — queries go through `supabaseAdmin` + manual join with the `users_full` view (no FK join because `auth.users` is untouchable).
- `UseTable` (`app/components/utils/UseTable.jsx`) supports the `onRow` prop (Ant Design pass-through) for row event handlers.

## Notifications

- Use `notifyError()` / `notifySuccess()` from `NotificationProvider.jsx`.
- `notifyError(error)` auto-translates Supabase `error.message` to Thai via `translateSupabaseError()` in `app/utils/supabaseErrorMap.js`. Add new messages **only** to `errorMap` there — never touch call sites.
