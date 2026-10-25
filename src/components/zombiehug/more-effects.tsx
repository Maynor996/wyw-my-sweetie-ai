'use client';

import { ArrowUpRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';

import { effectHref, listMoreEffects, samplePaths } from './effects';
import type { Copy, EffectMeta, Lang } from './types';

export function MoreEffects({
  t,
  lang,
  excludeSlug,
}: {
  t: Copy;
  lang: Lang;
  excludeSlug?: string;
}) {
  const items = listMoreEffects(excludeSlug);

  return (
    <section
      id="more-effects"
      className="border-border bg-muted/25 scroll-mt-20 border-y px-4 py-16 sm:py-24 dark:bg-white/[0.02]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-foreground font-serif text-3xl tracking-tight sm:text-4xl">
              {t.moreEffectsH}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              {t.moreEffectsP}
            </p>
          </div>
          <Link
            href="/effects"
            className="text-sm font-medium text-rose-600 hover:text-rose-500 dark:text-rose-300 dark:hover:text-rose-200"
          >
            {lang === 'zh' ? '查看全部' : 'View all'} →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((effect) => (
            <EffectCard
              key={effect.slug}
              effect={effect}
              lang={lang}
              cta={t.moreEffectsCta}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function EffectCard({
  effect,
  lang,
  cta,
}: {
  effect: EffectMeta;
  lang: Lang;
  cta: string;
}) {
  const media = samplePaths(effect.mediaSlug);
  const href = effectHref(effect);
  const title = effect.cardTitle[lang] ?? effect.cardTitle.en;
  const blurb = effect.cardBlurb[lang] ?? effect.cardBlurb.en;

  return (
    <Link
      href={href}
      className={cn(
        'border-border bg-card group overflow-hidden rounded-2xl border shadow-md shadow-black/5 transition hover:border-rose-400/50 hover:shadow-lg dark:bg-zinc-950 dark:shadow-black/30'
      )}
    >
      <div className="bg-muted relative aspect-[9/14] overflow-hidden">
        <img
          src={media.poster}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-3 left-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] tracking-wide text-zinc-100 uppercase backdrop-blur">
          {effect.durationSec}s · {effect.price720}
        </div>
        <div className="absolute right-3 bottom-3 left-3">
          <h3 className="font-serif text-xl text-white drop-shadow">{title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-zinc-200/95">{blurb}</p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
            {cta}
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
