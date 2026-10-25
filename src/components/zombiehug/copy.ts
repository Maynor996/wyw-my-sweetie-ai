import { getEffectCopy } from './effect-copies';
import type { Copy, Lang } from './types';
export type { Copy, Lang, Pack } from './types';
export { zhLang } from './lang';
export { getEffectCopy as copyForEffect } from './effect-copies';
export function copy(lang: Lang): Copy {
  return getEffectCopy('wyw-my-sweetie', lang);
}
