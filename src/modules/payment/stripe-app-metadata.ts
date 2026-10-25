/**
 * Site id stamped into Stripe Checkout Session metadata.app so the shared
 * aizombie webhook hub can route fulfillment. Value comes from wrangler
 * var STRIPE_APP_METADATA (e.g. "hotel-lobby").
 */
import { serverEnv } from '@/lib/server-env';

export function getStripeAppMetadata(): string {
  const fromEnv =
    serverEnv('STRIPE_APP_METADATA') ||
    (typeof process !== 'undefined' ? process.env.STRIPE_APP_METADATA : '') ||
    '';
  return String(fromEnv || '').trim();
}
