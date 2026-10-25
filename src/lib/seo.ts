/**
 * Shared SEO head helpers — self-canonical + per-page hreflang for every locale.
 * x-default → English (Paraglide baseLocale en, unprefixed).
 */
import { envConfigs } from '@/config';
import {
  baseLocale,
  getLocale,
  locales,
  localizeUrl,
  type Locale,
} from '@/paraglide/runtime.js';

export type SeoHeadOptions = {
  /** Path without locale prefix, e.g. `/pricing` or `/effects`. Use `` or `/` for home. */
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  extraMeta?: Record<string, unknown>[];
  keywords?: string;
};

function appOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return (envConfigs.app_url || 'https://wyw-my-sweetie.chatgpt-plus.workers.dev').replace(/\/$/, '');
}

/** Absolute URL for a path in a given locale (self-canonical when locale = current). */
export function localizedAbsoluteUrl(
  path: string,
  locale: string = getLocale()
): string {
  const origin = appOrigin();
  const bare =
    path === '/' || path === '' ? '/' : path.startsWith('/') ? path : `/${path}`;
  const absolute = bare === '/' ? `${origin}/` : `${origin}${bare}`;
  try {
    return localizeUrl(absolute, {
      locale: locale as Locale,
    }).href;
  } catch {
    if (locale === baseLocale) return absolute;
    const prefix = `/${locale}`;
    if (bare === '/') return `${origin}${prefix}`;
    return `${origin}${prefix}${bare}`;
  }
}

/** Canonical for current locale + alternate links for es/en/zh + x-default → English. */
export function localeAlternateLinks(
  path: string,
  locale: string = getLocale()
) {
  const canonical = localizedAbsoluteUrl(path, locale);
  const alternates = [
    ...locales.map((loc) => ({
      rel: 'alternate' as const,
      hrefLang: loc,
      href: localizedAbsoluteUrl(path, loc),
    })),
    {
      rel: 'alternate' as const,
      hrefLang: 'x-default',
      href: localizedAbsoluteUrl(path, baseLocale),
    },
  ];
  return {
    canonical,
    links: [{ rel: 'canonical' as const, href: canonical }, ...alternates],
  };
}

/** Build TanStack route `head()` meta + links for a public page. */
export function buildSeoHead(opts: SeoHeadOptions) {
  const locale = getLocale();
  const { canonical, links } = localeAlternateLinks(opts.path, locale);
  const ogImage = opts.ogImage || `${appOrigin()}/samples/wyw-my-sweetie/poster.jpg`;
  const ogType = opts.ogType || 'website';

  const meta: Record<string, unknown>[] = [
    { title: opts.title },
    { name: 'description', content: opts.description },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: canonical },
    { property: 'og:title', content: opts.title },
    { property: 'og:description', content: opts.description },
    { property: 'og:image', content: ogImage },
    { property: 'og:site_name', content: 'wywmysweetie AI' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: opts.title },
    { name: 'twitter:description', content: opts.description },
    { name: 'twitter:image', content: ogImage },
  ];

  if (opts.keywords) {
    meta.splice(2, 0, { name: 'keywords', content: opts.keywords });
  }
  if (opts.noindex) {
    meta.push({ name: 'robots', content: 'noindex, follow' });
  }
  if (opts.extraMeta?.length) {
    meta.push(...opts.extraMeta);
  }

  return { meta, links };
}

export function absUrl(path: string): string {
  const origin = appOrigin();
  if (path.startsWith('http')) return path;
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function ldJson(data: unknown): Record<string, unknown> {
  return { 'script:ld+json': data } as Record<string, unknown>;
}
