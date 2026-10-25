import type { ComponentType, SVGProps } from 'react';

import { Link } from '@/core/i18n/navigation';
import { getLocale } from '@/paraglide/runtime.js';
import { envConfigs } from '@/config';
import { cn } from '@/lib/utils';
import { LocaleSelector } from '@/components/locale-selector';

export interface FooterColumn {
  title: string;
  /** external: open in a new tab. Off-site (http) hrefs always open in a new tab. */
  links: { label: string; href: string; external?: boolean }[];
}

/** Off-site URLs render as plain <a>; internal paths use the locale-aware Link. */
const isExternalHref = (href: string) => /^https?:\/\//.test(href);

export interface FooterSocial {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  label: string;
}

/** Free-listing directory badges (dofollow). Hosted under /badges/. */
export const DIRECTORY_BADGES = [
  {
    href: 'https://findaifor.me/?utm_source=wywmysweetie.run&utm_medium=badge&utm_campaign=footer',
    src: 'https://findaifor.me/badge.svg',
    alt: 'Featured on FindAIForMe',
    width: 120,
    height: 30,
  },
  {
    href: 'https://www.toolpilot.ai',
    src: '/badges/toolpilot.png',
    alt: 'Featured on ToolPilot.ai',
    width: 140,
    height: 31,
  },
  {
    href: 'https://dang.ai/',
    src: '/badges/dang-ai.png',
    alt: 'Verified on DANG!',
    width: 89,
    height: 32,
  },
  {
    href: 'https://startupfa.me/',
    src: 'https://startupfa.me/badges/featured-badge-small.webp',
    alt: 'Featured on Startup Fame',
    width: 224,
    height: 36,
  },
  {
    href: 'https://twelve.tools',
    src: '/badges/twelve-tools.svg',
    alt: 'Featured on Twelve Tools',
    width: 119,
    height: 32,
  },
  {
    href: 'https://findly.tools/',
    src: '/badges/findly-tools.svg',
    alt: 'Featured on Findly.tools',
    width: 101,
    height: 32,
  },
  {
    href: 'https://shanshenbuai.cc',
    src: '/badges/fazier.svg',
    alt: 'Launched on Fazier',
    width: 75,
    height: 32,
  },
  {
    href: 'https://nologin.tools/badge/huginheaven',
    src: '/badges/nologin.svg',
    alt: 'NoLogin Verified',
    width: 118,
    height: 20,
  },
] as const;

export function SiteFooter({
  tagline,
  columns,
  socials,
  copyright,
}: {
  tagline?: string;
  columns?: FooterColumn[];
  socials?: FooterSocial[];
  copyright?: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-6 sm:px-10 sm:pt-12 lg:px-16">
        {tagline && (
          <p className="mb-8 max-w-2xl font-serif text-3xl leading-[1.15] tracking-tight text-neutral-100 italic sm:text-4xl">
            {tagline}
          </p>
        )}

        {columns && columns.length > 0 && (
          <div
            className={cn(
              'grid gap-x-8 gap-y-8 sm:gap-x-12',
              columns.length <= 3
                ? 'grid-cols-1 sm:grid-cols-3'
                : columns.length === 4
                  ? 'grid-cols-2 sm:grid-cols-4'
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
            )}
          >
            {columns.map((col) => (
              <div key={col.title} className="space-y-5">
                <p className="text-[13px] font-semibold tracking-wide text-neutral-100">
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {isExternalHref(link.href) ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-balance break-words text-neutral-400 transition-colors hover:text-neutral-100"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          className="text-sm text-balance break-words text-neutral-400 transition-colors hover:text-neutral-100"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Socials + language row */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {socials && socials.length > 0 ? (
            <div className="flex items-center gap-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 transition-colors hover:text-neutral-100"
                >
                  <s.icon className="size-[18px]" />
                </a>
              ))}
            </div>
          ) : (
            <div />
          )}
          <LocaleSelector
            variant="pill"
            className="border-neutral-700 text-neutral-200 hover:bg-white/5 hover:text-neutral-50"
          />
        </div>

        {/* Bottom bar — Partners is an internal link; directory badges live on /partners */}
        <div className="mt-6 flex flex-col gap-3 border-t border-neutral-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/partners"
            className="text-sm text-balance break-words text-neutral-400 transition-colors hover:text-neutral-100"
          >
            {getLocale() === 'zh' || getLocale().startsWith('zh')
              ? '合作伙伴'
              : getLocale() === 'es' || getLocale().startsWith('es')
                ? 'Socios'
                : 'Partners'}
          </Link>
          <span className="text-sm text-balance text-neutral-400 sm:text-right">
            {copyright ||
              `© ${year} ${envConfigs.app_name}. All rights reserved.`}
          </span>
        </div>
      </div>
    </footer>
  );
}
