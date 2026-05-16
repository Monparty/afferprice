# Afferprice Design System

Thai-language auction marketplace. UI layer: **Ant Design 6** + **Tailwind CSS 4**, volcano color palette, full dark-mode support.

---

## Color Tokens

### Primary — Volcano (Ant Design)

| Token | Value | Usage |
|---|---|---|
| `volcano[5]` | `#fa541c` | Primary buttons, HolyLoader bar, active accents |
| `volcano[2]` | `#ffbb96` | Input focus ring (Ant Design override) |
| `orange-600` | `#ea580c` | Active nav border, live price text, badge highlights |
| `orange-500/25` | transparent orange | Admin sidebar active bg, hover bg |

### Neutral

| Token | Light | Dark |
|---|---|---|
| Background | `#ffffff` | `#0f0f0f` |
| Foreground | `#171717` | `#ededed` |
| Card bg | `bg-white` | `bg-zinc-800` |
| Card border | `border-slate-200` | `border-zinc-700` |
| Header bg | `bg-white` | `bg-zinc-900` |
| Admin sidebar | `bg-slate-800` | — |
| Footer bg | `bg-slate-900` | — |

### Semantic CSS Variables

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}
.dark {
  --background: #0f0f0f;
  --foreground: #ededed;
}
```

### Text Selection

```css
::selection { color: white; background: oklch(75% 0.183 55.934); }
```

---

## Typography

| Role | Font | Class / Style |
|---|---|---|
| Body | Geist Sans (Google) | `--font-geist-sans`, `antialiased` |
| Mono | Geist Mono | `--font-geist-mono` |
| Fallback | Arial, Helvetica, sans-serif | `globals.css body` |
| App name / Logo | `text-xl font-semibold` | header |
| Footer brand | `text-xl font-extrabold tracking-tight` | |
| Card category | `text-xs font-bold uppercase tracking-widest text-slate-400` | |
| Card title | `text-base font-bold line-clamp-1` | |
| Live price | `text-lg font-bold text-primary` | `text-primary` = volcano primary |

---

## Spacing & Layout

| Token | Value |
|---|---|
| Page max-width | `max-w-360` (360 × 4px = 1440px) |
| Page padding | `px-4 md:px-10` |
| Header height | `h-15` (60px) |
| Admin sidebar width | `w-1/6` (fixed) |
| Admin content width | `w-5/6` |
| Card border radius | `rounded-xl` |
| Button / input radius | `rounded-lg` (Ant Design default) |

---

## Theme System

- **Provider**: `ThemeProvider` → context `{ isDark, toggleTheme }`
- **Toggle**: writes `"dark"` / `"light"` to `localStorage` key `"theme"`; falls back to `prefers-color-scheme`
- **Applied via**: `.dark` class on `<html>` — Tailwind's `@custom-variant dark (&:where(.dark, .dark *))`
- **Ant Design sync**: `ThemeAwareConfig` switches `defaultAlgorithm` ↔ `darkAlgorithm` based on `isDark`
- **Toggle icon**: `SunOutlined` (dark mode) / `MoonOutlined` (light mode)

---

## Motion & Animation

| Interaction | Spec |
|---|---|
| Theme transition | `transition: background-color 0.2s ease, color 0.2s ease` |
| Header scroll-hide | `transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` |
| Header scroll threshold | 50px — hides on scroll-down, shows on scroll-up |
| Page transition bar | HolyLoader: `color=volcano[5]`, `height=3`, `speed=250`, `easing=ease` |
| Card hover | `hover:shadow-xl hover:-translate-y-1 transition-all` |

---

## Component Patterns

### Navigation (AppHeader)

- Fixed top, `z-50`, `shadow-sm`
- Desktop: logo + search (underlined variant, 208px) + nav links + actions
- Mobile: hamburger → dropdown overlay at `top-15`
- Active link: `text-orange-600 border-b-3 border-orange-600`
- Idle link: `hover:text-orange-600 hover:border-orange-600`
- User avatar → `UsePopover` (bottomRight) with profile/admin/logout options

### Admin Sidebar

- Fixed, `bg-slate-800 text-white`, `h-dvh`
- Active item: `bg-orange-500/25 text-orange-500`
- Hover: same as active
- Bottom: avatar + name + role via `UsePopover` (topLeft)

### Product Card (CardProduct)

- `bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700`
- Image: `aspect-square`, `h-90`, `object-cover`
- Favorite button: top-right, `bg-white/80 backdrop-blur-sm`, heart toggle
- Time badge: bottom-left, white bg, orange border + text
- Price: realtime via `useRealtimePrice` hook

### Footer

- `bg-slate-900 text-slate-400`, `mt-20 border-t border-slate-200 py-12`
- 4-column grid (responsive → 1-col mobile)
- Newsletter input row inline
- Bottom strip: copyright + policy links, `border-t border-slate-800`

---

## Input Components (Wrappers)

All inputs in `app/components/inputs/` wrap Ant Design:

| Component | Ant Design base |
|---|---|
| `UseButton` | `Button` |
| `UseSelect` | `Select` |
| `UseUpload` | `Upload` |
| `UseAutoComplete` | `AutoComplete` |
| `UseTextArea` | `Input.TextArea` |
| `UseSwitch` | `Switch` |
| `UseRadio` | `Radio.Group` |
| `UseCheckbox` | `Checkbox` |
| `UseDatePicker` | `DatePicker` |
| `UseSegmented` | `Segmented` |
| `UseReactQuill` | `react-quill` |

All forms use **React Hook Form** + `controller` pattern + **Yup** validation via `@hookform/resolvers`.

---

## Notification Style

- **Library**: Ant Design `notification` API
- **Helpers**: `notifyError(error)` / `notifySuccess(message)` from `NotificationProvider`
- `notifyError` auto-translates Supabase error messages to Thai via `supabaseErrorMap.js`

---

## Locale

- Ant Design locale: `th_TH` (Thai)
- App language: Thai (`<html lang="th">`)
- Date formatting: `dayjs` (Thai locale applied globally via Ant Design config)
