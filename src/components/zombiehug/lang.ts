import type { Lang } from './types';

/** Map paraglide locale → landing/copy Lang (fallback en). */
export function zhLang(locale: string): Lang {
  const base = locale.split('-')[0]?.toLowerCase() ?? 'en';
  if (base === 'zh') return 'zh';
  if (base === 'es') return 'es';
  if (base === 'pt') return 'pt';
  if (base === 'fr') return 'fr';
  return 'en';
}

export const resolveLang = zhLang;
