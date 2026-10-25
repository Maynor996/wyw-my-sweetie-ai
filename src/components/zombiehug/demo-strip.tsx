'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import { samplePaths } from './effects';
import { SAMPLE_GALLERY } from './sample-gallery';
import { SampleGalleryGrid } from './sample-gallery-grid';
import type { Copy, Lang } from './types';

export function DemoStrip({
  t,
  mediaSlug,
  lang = 'en',
}: {
  t: Copy;
  mediaSlug: string;
  lang?: Lang;
}) {
  const media = samplePaths(mediaSlug);
  const [demoReady, setDemoReady] = useState(false);
  const demoVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setDemoReady(false);
    const video = demoVideoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, [mediaSlug]);

  const resultsH = t.resultsH ?? t.demoMadeWith;
  const resultsP = t.resultsP;
  const inputLabel = t.resultsInputLabel ?? 'Input';
  const outputLabel = t.resultsOutputLabel ?? 'Output';
  const placeholderNote = t.resultsPlaceholderNote;
  return (
    <section id="demo" className="cmm-demo scroll-mt-20 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm text-[color:var(--cmm-muted,#6d6d78)]">
            {t.demoMadeWith}
          </p>
          <h2 className="cmm-h2 mt-2 !mb-0">{resultsH}</h2>
          {resultsP ? (
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
              {resultsP}
            </p>
          ) : null}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="mx-auto w-full max-w-lg">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-200/90">
              <Volume2 className="size-4" />
              <span>{t.demoSoundOn}</span>
            </div>
            <div className="border-border relative mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl border bg-stone-900 shadow-xl sm:max-w-[360px]">
              <div className="relative aspect-[9/16] w-full overflow-hidden">
                <img
                  src={media.poster}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 size-full object-contain"
                  decoding="async"
                />
                <video
                  ref={demoVideoRef}
                  className={cn(
                    'absolute inset-0 size-full bg-transparent object-contain transition-opacity duration-300',
                    demoReady ? 'opacity-100' : 'opacity-0'
                  )}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={media.poster}
                  src={media.video}
                  onLoadedData={() => setDemoReady(true)}
                  onPlaying={() => setDemoReady(true)}
                >
                  Your browser does not support the video tag.
                </video>
                <span className="absolute top-2.5 left-2.5 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
                  {outputLabel}
                </span>
              </div>
            </div>
            <div className="mt-4 grid max-w-xs grid-cols-1 gap-3">
              <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
                <div className="bg-muted relative aspect-[3/4] max-h-[50vh] overflow-hidden">
                  <img
                    src={media.inputA}
                    alt={inputLabel}
                    className="size-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="text-muted-foreground px-2.5 py-2 text-[11px] font-medium">
                  {inputLabel}
                </p>
              </div>
            </div>
          </div>

          <ol className="grid grid-cols-2 gap-3 sm:gap-4">
            {t.beats.map(([label], i) => (
              <li
                key={label}
                className="border-border bg-card group relative overflow-hidden rounded-2xl border shadow-sm dark:bg-stone-950"
              >
                <div className="bg-muted aspect-[9/16] dark:bg-stone-900">
                  <img
                    src={media.frames[i]}
                    alt={label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-10">
                  <span className="mb-1 block text-[10px] tracking-wider text-white/50 uppercase">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-serif text-base text-white sm:text-lg">
                    {label}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <SampleGalleryGrid
          className="mt-14"
          items={SAMPLE_GALLERY}
          lang={lang}
          heading={
            lang === 'zh'
              ? `全部样片预览 · ${SAMPLE_GALLERY.length} 支`
              : `All sample previews · ${SAMPLE_GALLERY.length} clips`
          }
          subheading={
            lang === 'zh'
              ? '每张卡片说明场景与时长。文件不重复；点「去做同款」跳到上传区。'
              : 'Each blurb explains scene + length. No duplicate files. Tap “Make this look” to start.'
          }
          outputLabel={outputLabel}
        />

        {placeholderNote ? (
          <p className="text-muted-foreground mt-8 rounded-xl border border-dashed px-4 py-3 text-xs leading-relaxed sm:text-sm">
            {placeholderNote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
