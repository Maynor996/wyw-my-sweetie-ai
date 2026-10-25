'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { samplePaths } from './effects';
import type { SampleGalleryItem } from './sample-gallery';
import type { Lang } from './types';

export function GalleryCard({
  slug,
  title,
  blurb,
  outputLabel,
  ctaLabel,
}: {
  slug: string;
  title: string;
  blurb: string;
  outputLabel: string;
  ctaLabel: string;
}) {
  const media = samplePaths(slug);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setReady(false);
    ref.current?.play().catch(() => {});
  }, [slug]);

  function goCreate() {
    document
      .getElementById('create')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <li className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm dark:bg-stone-950">
      <div className="relative mx-auto aspect-[9/16] w-full max-h-[480px] max-w-[280px] overflow-hidden bg-stone-900">
        <img
          src={media.poster}
          alt=""
          aria-hidden
          width={720}
          height={1280}
          className="absolute inset-0 size-full object-contain"
          loading="lazy"
          decoding="async"
        />
        <video
          ref={ref}
          className={cn(
            'absolute inset-0 size-full bg-transparent object-contain transition-opacity duration-300',
            ready ? 'opacity-100' : 'opacity-0'
          )}
          controls
          muted
          loop
          playsInline
          preload="metadata"
          poster={media.poster}
          src={media.video}
          onLoadedData={() => setReady(true)}
          onPlaying={() => setReady(true)}
        >
          Your browser does not support the video tag.
        </video>
        <span className="absolute top-2 left-2 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
          {outputLabel}
        </span>
      </div>
      <div className="space-y-2 px-3 py-2.5">
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed">{blurb}</p>
        <button
          type="button"
          onClick={goCreate}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold transition-colors"
        >
          {ctaLabel}
        </button>
      </div>
    </li>
  );
}

export function SampleGalleryGrid({
  items,
  lang = 'en',
  heading,
  subheading,
  outputLabel = 'Output',
  className,
}: {
  items: SampleGalleryItem[];
  lang?: Lang;
  heading: string;
  subheading?: string;
  outputLabel?: string;
  className?: string;
}) {
  const ctaLabel = lang === 'zh' ? '去做同款 →' : 'Make this look →';

  return (
    <div className={className}>
      <h3 className="text-foreground font-serif text-2xl tracking-tight sm:text-3xl">
        {heading}
      </h3>
      {subheading ? (
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          {subheading}
        </p>
      ) : null}
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <GalleryCard
            key={item.slug}
            slug={item.slug}
            title={item.title[lang] || item.title.en}
            blurb={item.blurb[lang] || item.blurb.en}
            outputLabel={outputLabel}
            ctaLabel={ctaLabel}
          />
        ))}
      </ul>
    </div>
  );
}
