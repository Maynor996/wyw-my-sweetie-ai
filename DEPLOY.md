# wywmysweetie AI — deploy notes

## Live (2026-10-25 Asia/Shanghai)
- Primary Site: https://wywmysweetie.run (+ www) — **CF zone pending until Spaceship NS update**
- Worker fallback (live now): https://wyw-my-sweetie.chatgpt-plus.workers.dev
- Worker name: `wyw-my-sweetie`
- CF account: 1002569303@qq.com (QQ) — NOT Bgnwd15 · account id `1d6a0776f498b7c9655139c212cdd69b`
- Zone id: `205b8ca22b446e5f584a84f98c762e46` · status pending · NS `noor.ns.cloudflare.com` / `renan.ns.cloudflare.com`
- GitHub: https://github.com/Maynor996/wyw-my-sweetie-ai (About homepage → https://wywmysweetie.run)
- Local path: `/workspace/wywmysweetie-web`

## Spaceship NS (required for custom domain SSL)
Registrar currently: `launch1.spaceship.net` / `launch2.spaceship.net`.
Update both domains at Spaceship → Nameservers:
1. `noor.ns.cloudflare.com`
2. `renan.ns.cloudflare.com`
Disable DNSSEC at Spaceship if enabled. Then wait for CF zone → Active.

## Pricing
- Single $8.88 / Popular $16.99 / Creator $29.90

## Stripe (wired like whitechicks.cc / venommakeup.cc)
- Hub webhook: `https://aizombie.app/api/payment/notify/stripe` (no new Dashboard endpoint)
- `STRIPE_APP_METADATA=wyw-my-sweetie` (wrangler var)
- Secrets on Worker: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SIGNING_SECRET` (= `AIZOMBIE_STRIPE_SIGNING_SECRET`), plus `AUTH_SECRET`, `CONFIG_ENCRYPTION_KEY`, `KIE_API_KEY`, `TRYALLAPI_API_KEY`
- Hub map entry: `wyw-my-sweetie` → `https://wywmysweetie.run/api/payment/notify/stripe` (zombiehug redeployed 2026-10-25 Asia/Shanghai; schedules trigger API may warn — script upload OK)
- Verified 2026-10-25 Asia/Shanghai: `POST /api/zombie/checkout` `{"productId":"pack_1"}` → `code:0` + `checkout.stripe.com` live session on workers.dev

## D1
- DB: `seedream-studio-db` (`32cc6711-e4f8-4e8f-9342-cbbb3ac2739c`)
- Prefix: `wys_` · Migrations table: `wys_d1_migrations` · 0000–0003 applied ✅

## Samples
- `public/samples/wyw-my-sweetie/` (first-party; no MakeViral CDN)

## Video provider
- Primary Kie Seedance 2 Fast · Fallback TryAllAPI
