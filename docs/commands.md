# Commands & Scripts

```bash
npm run dev      # Start Next.js dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint (Next.js Core Web Vitals)
npm start        # Run production build
```

- No test runner is configured.
- **⚠️ `npm run lint` reports errors internally but exits 0** — it cannot be trusted to fail CI. Verify real breakage with `npm run build`.

## Local Omise webhook

- Webhook needs a public URL. Run `ngrok http 3000`, then set the forwarding URL as the endpoint in the Omise Dashboard.
- Webhook route: `POST /api/payment/webhook` (see [architecture.md](architecture.md#payment-omise)).
