'use client';

import { ArrowUpRight, Video } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { buttonVariants } from '@/components/ui/button';

import { copy, zhLang } from './copy';
import { productFooterColumns } from './footer-links';
import { effectHref, EFFECTS, samplePaths } from './effects';

export function EffectsIndex() {
  const lang = zhLang(getLocale());
  const t = copy(lang);

  const navLinks = [
    { href: '/', label: lang === 'zh' ? '首页' : lang === 'es' ? 'Inicio' : 'Home' },
    { href: '/#create', label: t.navCreate },
    { href: '/effects', label: t.navEffects },
    {
      href: '/guides',
      label: lang === 'zh' ? '教程' : lang === 'es' ? 'Guías' : 'Guides',
    },
    {
      href: '/videos',
      label: lang === 'zh' ? '样片' : lang === 'es' ? 'Videos' : 'Samples',
    },
    {
      href: '/tools',
      label: lang === 'zh' ? '相关工具' : lang === 'es' ? 'Herramientas' : 'Related tools',
    },
    { href: '/#pricing', label: t.navPricing },
  ];

  const footerColumns: FooterColumn[] = productFooterColumns(lang, {
    footerProduct: t.footerProduct,
    footerLegal: t.footerLegal,
    navCreate: t.navCreate,
    navEffects: t.navEffects,
  });

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader navLinks={navLinks} />
      <section className="relative overflow-hidden px-4 pt-14 pb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(244,63,94,0.12),_transparent_55%)]"
        />
        <div className="mx-auto max-w-6xl text-center">
          <span className="border-border bg-card text-muted-foreground mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs tracking-wide uppercase shadow-sm">
            <Video className="size-3.5 text-rose-500 dark:text-rose-400" />
            {t.footerDomain}
          </span>
          <h1 className="text-foreground font-serif text-4xl tracking-tight sm:text-5xl">
            {t.moreEffectsH}
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            {t.moreEffectsP}
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EFFECTS.map((effect) => {
            const media = samplePaths(effect.mediaSlug);
            const title = effect.cardTitle[lang] ?? effect.cardTitle.en;
            const blurb = effect.cardBlurb[lang] ?? effect.cardBlurb.en;
            return (
              <Link
                key={effect.slug}
                href={effectHref(effect)}
                className={cn(
                  'border-border bg-card group overflow-hidden rounded-2xl border shadow-md shadow-black/5 transition hover:border-rose-400/50 dark:bg-zinc-950'
                )}
              >
                <div className="bg-muted relative aspect-[9/14] overflow-hidden">
                  <img
                    src={media.poster}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] tracking-wide text-zinc-100 uppercase backdrop-blur">
                    {effect.durationSec}s · {effect.price720}
                  </div>
                  <div className="absolute right-3 bottom-3 left-3">
                    <h2 className="font-serif text-xl text-white drop-shadow">
                      {title}
                    </h2>
                    <p className="mt-1 text-xs text-zinc-200/95">{blurb}</p>
                    <span
                      className={cn(
                        buttonVariants({ size: 'sm' }),
                        'mt-3 inline-flex h-8 gap-1 rounded-full px-3 text-xs'
                      )}
                    >
                      {t.moreEffectsCta}
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <SiteFooter
        tagline={t.footerTagline}
        columns={footerColumns}
        copyright={`© ${new Date().getFullYear()} ${t.footerDomain}`}
      />
    </div>
  );
}
