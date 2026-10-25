/**
 * Curated sample watch pages — only real assets under /public/samples/.
 */
import type { Lang } from './types';

export type WatchVideo = {
  slug: string;
  mediaSlug: string;
  durationIso: string;
  durationSec: number;
  uploadDate: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  caption: Record<Lang, string>;
};

export const WATCH_VIDEOS: WatchVideo[] = [
  {
    slug: 'flash-step-blue-stage',
    mediaSlug: 'shan-shen-bu-shrimp',
    durationIso: 'PT10S',
    durationSec: 10,
    uploadDate: '2026-10-18T00:00:00+08:00',
    title: {
      en: 'AI Flash Step on the blue stage — Shan Shen Bu sample',
      zh: '蓝台 AI 闪身步 — 闪身步样片',
      es: 'Flash Step IA en escenario azul — muestra Shan Shen Bu',
    },
    description: {
      en: 'AI-generated sample of the Chinese flash-step (闪身步) routine on the classic blue teaching-stage look. Product demo on shanshenbuai.cc — not a testimonial.',
      zh: '经典蓝台教学风的中式闪身步 AI 样片。产品演示：shanshenbuai.cc——非用户评价。',
      es: 'Muestra IA del flash-step chino en estilo escenario azul. Demo en shanshenbuai.cc — no es testimonio.',
    },
    caption: {
      en: 'Blue stage · ~10s · AI',
      zh: '蓝台 · 约 10 秒 · AI',
      es: 'Escenario azul · ~10s · IA',
    },
  },
  {
    slug: 'pet-flash-step-courtyard',
    mediaSlug: 'shan-shen-bu-pet',
    durationIso: 'PT15S',
    durationSec: 15,
    uploadDate: '2026-10-18T00:00:00+08:00',
    title: {
      en: 'Pet flash step in the courtyard — Shan Shen Bu sample',
      zh: '庭院宠物闪身步 — 闪身步样片',
      es: 'Mascota flash-step en el patio — muestra Shan Shen Bu',
    },
    description: {
      en: 'AI sample: upright pet does the flash step, kick and shiver in a sunny courtyard (~15s, 9:16). Product demo — not a testimonial.',
      zh: 'AI 样片：宠物直立完成闪身步、踢球与哆嗦毛，阳光庭院（约 15 秒，9:16）。产品演示——非用户评价。',
      es: 'Muestra IA: mascota de pie hace flash-step, patada y temblor en patio (~15s, 9:16). Demo de producto.',
    },
    caption: {
      en: 'Courtyard pet · ~15s · AI',
      zh: '庭院宠物 · 约 15 秒 · AI',
      es: 'Mascota patio · ~15s · IA',
    },
  },
  {
    slug: 'vault-costume-world-swap',
    mediaSlug: 'vault-costume-world-swap',
    durationIso: 'PT7S',
    durationSec: 7,
    uploadDate: '2026-10-18T00:00:00+08:00',
    title: {
      en: 'Vault → Costume World-Swap — 3-image sample',
      zh: '翻越换装 · 古装世界切换 — 三图样片',
      es: 'Salto → cambio de vestuario — muestra 3 fotos',
    },
    description: {
      en: 'Demo of the independent 3-image vault→costume world-swap template (~7s). Selfie locks frame 0, action is a one-hand side vault, target is a red traditional dance look. Product demo on shanshenbuai.cc — not a testimonial.',
      zh: '独立三图翻越换装世界切换模板演示（约 7 秒）。自拍锁首帧、单手侧向翻越、红衣古装目标。产品演示：shanshenbuai.cc——非用户评价。',
      es: 'Demo de la plantilla 3 fotos vault→traje (~7s). Producto en shanshenbuai.cc — no es testimonio.',
    },
    caption: {
      en: 'Vault world-swap · ~7s · AI',
      zh: '翻越换装 · 约 7 秒 · AI',
      es: 'Vault world-swap · ~7s · IA',
    },
  },
  {
    slug: 'skirt-ad-text',
    mediaSlug: 'skirt-ad-text',
    durationIso: 'PT7S',
    durationSec: 7,
    uploadDate: '2026-10-18T00:00:00+08:00',
    title: {
      en: 'Skirt-Ad Text — plaza hanfu spin sample',
      zh: '甩裙广告字 — 广场汉服甩裙样片',
      es: 'Texto en falda — muestra giro hanfu',
    },
    description: {
      en: 'Demo of the independent 1-photo skirt-ad-text template (~6.6s). Your face, hanfu spin on a real street plaza, custom text painted on the flared skirt disc. Product demo on shanshenbuai.cc — not a testimonial.',
      zh: '独立一张照片甩裙广告字模板演示（约 6.6 秒）。你的脸、真实街景广场汉服甩裙、自定义文案印在裙摆圆盘上。产品演示：shanshenbuai.cc——非用户评价。',
      es: 'Demo de la plantilla 1 foto texto-en-falda (~6.6s). Producto en shanshenbuai.cc — no es testimonio.',
    },
    caption: {
      en: 'Skirt-ad text · ~6.6s · AI',
      zh: '甩裙广告字 · 约 6.6 秒 · AI',
      es: 'Texto en falda · ~6.6s · IA',
    },
  },
];

export function watchBySlug(slug: string): WatchVideo | undefined {
  return WATCH_VIDEOS.find((v) => v.slug === slug);
}

export const WATCH_BY_SLUG: Record<string, WatchVideo> = Object.fromEntries(
  WATCH_VIDEOS.map((v) => [v.slug, v])
);

export function watchPath(slug: string): string {
  return `/videos/${slug}`;
}
