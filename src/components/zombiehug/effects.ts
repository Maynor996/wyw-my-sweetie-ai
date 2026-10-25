import type { EffectMeta } from './types';
import { PRIMARY_EFFECT } from '@/core/ai/zombie-prompts';

export const EFFECTS: EffectMeta[] = [
  {
    slug: 'wyw-my-sweetie',
    path: '',
    mediaSlug: 'wyw-my-sweetie',
    cardTitle: { en: 'Wyw My Sweetie', zh: 'Wyw My Sweetie', es: 'Wyw My Sweetie' },
    cardBlurb: {
      en: '1 photo · ~13s',
      zh: '1 photo · ~13s',
      es: '1 photo · ~13s',
    },
    durationSec: 13,
    shots: 4,
    price720: '$8.88',
    featured: true,
    home: true,
  },
];

export const EFFECT_BY_SLUG = Object.fromEntries(
  EFFECTS.map((e) => [e.slug, e])
) as Record<string, EffectMeta>;

export function effectHref(effect: EffectMeta): string {
  return effect.home ? '/' : `/effects/${effect.path}`;
}

export function samplePaths(mediaSlug: string = 'wyw-my-sweetie') {
  const base = `/samples/${mediaSlug}`;
  return {
    base,
    poster: `${base}/poster.jpg`,
    video: `${base}/sample.mp4`,
    inputA: `${base}/input-a.jpg`,
    inputB: `${base}/input-a.jpg`,
    frames: [
      `${base}/frame-1.jpg`,
      `${base}/frame-2.jpg`,
      `${base}/frame-3.jpg`,
      `${base}/frame-4.jpg`,
    ] as [string, string, string, string],
    frame1: `${base}/frame-1.jpg`,
    frame2: `${base}/frame-2.jpg`,
    frame3: `${base}/frame-3.jpg`,
    frame4: `${base}/frame-4.jpg`,
  };
}

export function listMoreEffects(excludeSlug?: string): EffectMeta[] {
  return EFFECTS.filter((e) => e.slug !== excludeSlug);
}

export { PRIMARY_EFFECT };
