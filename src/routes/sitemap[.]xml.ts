import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { baseLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { EFFECTS, effectHref } from '@/components/zombiehug/effects';

const STATIC_PATHS = [
  '',
  '/effects',
  '/videos',
  '/privacy-policy',
  '/terms-of-service',
  '/refund-policy',
];

const EFFECT_PATHS = EFFECTS.filter((e) => !e.home).map((e) => effectHref(e));

type Entry = {
  path: string;
  locale: string;
  lastModified?: string;
};

function urlFor(path: string, locale: string): string {
  try {
    return localizeUrl(`${envConfigs.app_url}${path || '/'}`, {
      locale: locale as (typeof locales)[number],
    }).href;
  } catch {
    const base = (envConfigs.app_url || 'https://wyw-my-sweetie.chatgpt-plus.workers.dev').replace(/\/$/, '');
    return `${base}${path || '/'}`;
  }
}

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[character] ?? character
  );
}

function entryXml(e: Entry): string {
  const loc = urlFor(e.path, e.locale);
  const alternates = [
    ...locales.map(
      (locale) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(locale)}" href="${escapeXml(urlFor(e.path, locale))}" />`
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(urlFor(e.path, baseLocale))}" />`,
  ];
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    e.lastModified
      ? `    <lastmod>${escapeXml(e.lastModified)}</lastmod>`
      : null,
    ...alternates,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const paths = [...STATIC_PATHS, ...EFFECT_PATHS];
        const entries: Entry[] = [];
        for (const path of paths) {
          for (const locale of locales) {
            entries.push({ path, locale });
          }
        }
        const body = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
          ...entries.map(entryXml),
          '</urlset>',
          '',
        ].join('\n');
        return new Response(body, {
          headers: { 'Content-Type': 'text/xml; charset=UTF-8',
          'Cache-Control': 'private, no-store, no-transform' },
        });
      },
    },
  },
});
