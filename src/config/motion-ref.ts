/**
 * Durations for wywmysweetie-web. No reference reel hosted.
 */
import type { ZombieEffectSlug } from '@/core/ai/zombie-prompts';

export const WORKERS_DEV_ORIGIN = 'https://wyw-my-sweetie.chatgpt-plus.workers.dev';

export const DURATIONS: Record<ZombieEffectSlug, number> = {
  'wyw-my-sweetie': 13,
};

/** No motion-control reference video — pure i2v. */
export function getChatGttReferenceVideoUrl(
  _slug: ZombieEffectSlug,
  _appUrl?: string
): string {
  return '';
}

export function getChatGttDuration(slug: ZombieEffectSlug): number {
  return DURATIONS[slug] ?? 13;
}
