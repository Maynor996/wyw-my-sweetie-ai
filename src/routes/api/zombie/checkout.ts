import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import {
  CREDITS_480P,
  CREDITS_720P,
  getPricingProduct,
} from '@/config/pricing';
import { PaymentType } from '@/core/payment/types';
import { getAuth } from '@/core/auth';
import { getAllConfigs } from '@/modules/config/service';
import { createCheckout } from '@/modules/payment/service';
import {
  createGuestSessionCookie,
  findOrCreateGuestUser,
  isGuestPlaceholderEmail,
} from '@/modules/zombie/guest';
import {
  attributionToMetadata,
  readAttributionFromRequest,
  readClientGeoFromRequest,
} from '@/modules/zombie/attribution';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

const APP_URL = process.env.VITE_APP_URL || process.env.APP_URL || 'https://shanshenbuai.cc';
const PACK_IDS = new Set(['pack_1', 'pack_3', 'pack_10']);

function safeEffectPath(effectSlug: string | undefined | null): string {
  const slug =
    typeof effectSlug === 'string' && /^[a-z0-9-]{1,80}$/i.test(effectSlug)
      ? effectSlug
      : 'shan-shen-bu';
  // Main effect lives on `/`; others under `/effects/:slug` if that route exists.
  // Keep success/cancel on the public site origin.
  if (slug === 'shan-shen-bu') return '/';
  return `/effects/${slug}`;
}

async function POST({ request }: { request: Request }) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 1500,
    keyPrefix: 'zombie-checkout',
  });
  if (limited) return limited;

  try {
    if (!envConfigs.stripe_secret_key) {
      return respErr('Stripe is not configured', { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    const kind = typeof body.kind === 'string' ? body.kind : '';
    const effectSlug =
      typeof body.effectSlug === 'string' ? body.effectSlug.trim() : '';
    const resolution =
      body.resolution === '480p' || body.resolution === '720p'
        ? body.resolution
        : '720p';
    const emailOpt =
      typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    let productId =
      typeof body.productId === 'string' ? body.productId.trim() : '';

    // Single-shot render → pack_1 (covers 720p=500; also covers 480p=375).
    if (!productId && (kind === 'render' || effectSlug)) {
      productId = 'pack_1';
    }

    if (!PACK_IDS.has(productId)) {
      return respErr('Unknown productId (use pack_1|pack_3|pack_10)');
    }

    const product = getPricingProduct(productId);
    if (!product) {
      return respErr('Unknown product');
    }

    // First-touch UTM/referrer cookies from landing (never overwrite with a
    // checkout marker — that lives in metadata.checkout_mode).
    const attribution = readAttributionFromRequest(request);
    const geo = readClientGeoFromRequest(request);

    // Logged-in user wins; otherwise mint/find a lightweight guest.
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    let userId: string;
    let userEmail: string;
    let setCookie: string | null = null;
    const isGuestCheckout = !session?.user?.id;

    if (session?.user?.id) {
      userId = session.user.id;
      userEmail = session.user.email || emailOpt || '';
    } else {
      const guest = await findOrCreateGuestUser({
        email: emailOpt || null,
        name: 'Guest',
        utmSource: attribution.utm_source,
        ip: geo.ip,
        locale: geo.locale,
      });
      userId = guest.id;
      userEmail = guest.email;
      const minted = await createGuestSessionCookie({
        userId,
        request,
      });
      setCookie = minted.setCookie;
    }

    const configs = await getAllConfigs();
    const appUrl = (configs.app_url || APP_URL).replace(/\/$/, '');
    // Always use the production app host for Stripe redirects.
    const publicApp = APP_URL;
    const effectPath = safeEffectPath(effectSlug || undefined);
    const successUrl = `${publicApp}${effectPath}?paid=1&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${publicApp}${effectPath}#create`;

    const realEmail =
      emailOpt && !isGuestPlaceholderEmail(emailOpt)
        ? emailOpt
        : userEmail && !isGuestPlaceholderEmail(userEmail)
          ? userEmail
          : undefined;

    const checkout = await createCheckout({
      userId,
      userEmail: realEmail || userEmail,
      productName: product.productName,
      planName: product.planName,
      credits: product.credits,
      creditsValidDays: product.creditsValidDays,
      paymentOrder: {
        productId: product.productId,
        price: {
          amount: product.priceInCents,
          currency: product.currency,
        },
        type: PaymentType.ONE_TIME,
        description: product.description,
        successUrl,
        cancelUrl,
        // Only attach a Stripe Customer when we have a real email; guests
        // without email use customer_creation: if_required in the provider.
        customer: realEmail
          ? { email: realEmail, name: session?.user?.name || 'Guest' }
          : undefined,
        metadata: {
          userId,
          productId: product.productId,
          effectSlug: effectSlug || '',
          resolution,
          credits: String(product.credits),
          kind: kind || 'pack',
          requiredCredits:
            resolution === '480p'
              ? String(CREDITS_480P)
              : String(CREDITS_720P),
          checkout_mode: isGuestCheckout ? 'zombie-checkout' : 'authenticated',
          ...attributionToMetadata(attribution),
          ...(geo.ip ? { ip: geo.ip } : {}),
          ...(geo.country ? { country: geo.country } : {}),
          ...(geo.locale ? { locale: geo.locale } : {}),
          ...(realEmail ? { customerEmail: realEmail } : {}),
        },
      },
      provider: 'stripe',
    });

    const headers = new Headers();
    if (setCookie) {
      headers.append('Set-Cookie', setCookie);
    }

    return respData(
      {
        checkout_url: checkout.checkoutInfo.checkoutUrl,
        session_id: checkout.checkoutInfo.sessionId,
        productId: product.productId,
        credits: product.credits,
        guest: isGuestCheckout,
      },
      { headers }
    );
  } catch (error: any) {
    console.error('zombie checkout error:', error);
    return respErr(error?.message || 'Checkout failed');
  }
}

export const Route = createFileRoute('/api/zombie/checkout')({
  server: {
    handlers: { POST },
  },
});
