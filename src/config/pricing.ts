/**
 * Authoritative pricing catalog.
 *
 * wywmysweetie AI: credit packs (one-time).
 * 720p = 500 credits = $8.88 · 480p = 375 credits.
 * Checkout API uses this as SOURCE OF TRUTH.
 */

import { PaymentType } from '@/core/payment/types';

export type PricingPlanInfo = {
  name: string;
  interval: import('@/core/payment/types').PaymentInterval;
  intervalCount: number;
};

export type PricingProduct = {
  productId: string;
  productName: string;
  planName: string;
  description: string;
  type: PaymentType;
  priceInCents: number;
  currency: string;
  credits: number;
  creditsValidDays?: number;
  plan?: PricingPlanInfo;
};

/** Credits charged per render resolution. */
export const CREDITS_720P = 500;
export const CREDITS_480P = 375;

/** Display prices for the Create button (USD). */
export const PRICE_720P_USD = 8.88;
export const PRICE_480P_USD = 6.66; // ~375/500 of $8.88

/** Credit packs — one-time, no subscription. */
export const pricingCatalog: Record<string, PricingProduct> = {
  pack_1: {
    productId: 'pack_1',
    productName: 'Single',
    planName: 'Single',
    description: '500 credits · one 720p wywmysweetie AI video',
    type: PaymentType.ONE_TIME,
    priceInCents: 888,
    currency: 'usd',
    credits: 500,
  },
  pack_3: {
    productId: 'pack_3',
    productName: 'Popular',
    planName: 'Popular',
    description: '1500 credits · three 720p videos · save vs 3×Single',
    type: PaymentType.ONE_TIME,
    priceInCents: 1699,
    currency: 'usd',
    credits: 1500,
  },
  pack_10: {
    productId: 'pack_10',
    productName: 'Creator',
    planName: 'Creator',
    description: '5000 credits · ten 720p videos',
    type: PaymentType.ONE_TIME,
    priceInCents: 2990,
    currency: 'usd',
    credits: 5000,
  },
};

export function getPricingProduct(productId: string): PricingProduct | null {
  if (!productId) return null;
  return pricingCatalog[productId] ?? null;
}

export function listPricingProducts(): PricingProduct[] {
  return Object.values(pricingCatalog);
}

export function formatCreatePrice(resolution: '720p' | '480p'): string {
  const n = resolution === '720p' ? PRICE_720P_USD : PRICE_480P_USD;
  return `$${n.toFixed(2)}`;
}

/** 720p videos included in a credit pack (floor). */
export function packVideoCount(productId: string): number {
  const p = pricingCatalog[productId];
  if (!p) return 0;
  return Math.floor(p.credits / CREDITS_720P);
}

/** Per-720p-video unit price in USD for a pack. */
export function packUnitPriceUsd(productId: string): number | null {
  const p = pricingCatalog[productId];
  const videos = packVideoCount(productId);
  if (!p || videos <= 0) return null;
  return p.priceInCents / 100 / videos;
}

export function formatPackUnitPrice(productId: string): string {
  const n = packUnitPriceUsd(productId);
  if (n == null) return '';
  return `$${n.toFixed(2)}`;
}
