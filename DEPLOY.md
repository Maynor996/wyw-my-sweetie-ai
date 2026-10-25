# wywmysweetie AI — deploy notes

## Live (2026-10-25 Asia/Shanghai)
- Primary Site: https://wywmysweetie.run (+ www)
- Worker: `wyw-my-sweetie` (fallback https://wyw-my-sweetie.chatgpt-plus.workers.dev)
- CF account: 1002569303@qq.com (QQ) — NOT Bgnwd15
- Local path: `/workspace/wywmysweetie-web`

## Pricing
- Single $8.88 / Popular $16.99 / Creator $29.90

## Stripe webhook hub
`https://aizombie.app/api/payment/notify/stripe`
`STRIPE_APP_METADATA=wyw-my-sweetie`

## D1
- DB: `seedream-studio-db` · Prefix: `wys_` · Migrations: `wys_d1_migrations`

## Samples
- public/samples/wyw-my-sweetie/

## Video provider
- Primary Kie Seedance 2 Fast · Fallback TryAllAPI
