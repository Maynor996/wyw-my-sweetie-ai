'use client';

import { Link } from '@/core/i18n/navigation';

import { zhLang } from '@/components/zombiehug/lang';
import { samplePaths } from '@/components/zombiehug/effects';
import {
  WATCH_VIDEOS,
  watchPath,
  type WatchVideo,
} from '@/components/zombiehug/video-watch';
import { getLocale } from '@/paraglide/runtime.js';
import { absUrl, buildSeoHead, ldJson } from '@/lib/seo';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const UI = {
  es: {
    back: '← Todas las muestras',
    aiBadge: 'Video generado por IA',
    inputs: 'Foto de entrada',
    inputA: 'Foto (persona o mascota)',
    inputB: '',
    output: 'Resultado',
    cta: 'Crear el mío con una foto',
    ctaHint: 'Mismo efecto flash-step · desde $8.88 · shanshenbuai.cc',
    more: 'Más ejemplos',
    note: 'Estas páginas muestran demos del producto con archivos reales del sitio. No son testimonios ni tasas de éxito.',
  },
  en: {
    back: '← All samples',
    aiBadge: 'AI-generated video',
    inputs: 'Input photo',
    inputA: 'Photo (person or pet)',
    inputB: '',
    output: 'Output',
    cta: 'Create mine from one photo',
    ctaHint: 'Same flash-step effect · from $8.88 · shanshenbuai.cc',
    more: 'More samples',
    note: 'These pages show product demos using real on-site assets. They are not testimonials or success rates.',
  },
  zh: {
    back: '← 全部样片',
    aiBadge: 'AI 生成视频',
    inputs: '输入照片',
    inputA: '照片（真人或宠物）',
    inputB: '',
    output: '成片',
    cta: '用一张照片创建我的',
    ctaHint: '同一闪身步效果 · 自 $8.88 · shanshenbuai.cc',
    more: '更多示例',
    note: '这些页面使用站点内真实素材展示产品演示，不是用户评价或成功率。',
  },
} as const;

export function watchVideoHead(video: WatchVideo) {
  const lang = zhLang(getLocale());
  const media = samplePaths(video.mediaSlug);
  const title = video.title[lang] ?? video.title.es;
  const description = video.description[lang] ?? video.description.es;
  const contentUrl = absUrl(media.video);
  const thumbnail = absUrl(media.poster);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description,
    thumbnailUrl: thumbnail,
    contentUrl,
    uploadDate: video.uploadDate,
    duration: video.durationIso,
    encodingFormat: 'video/mp4',
    inLanguage: lang === 'zh' ? 'zh' : lang === 'en' ? 'en' : 'es',
    isFamilyFriendly: true,
    publisher: {
      '@type': 'Organization',
      name: 'Shan Shen Bu AI Dance',
      url: absUrl('/'),
    },
  };

  return buildSeoHead({
    path: watchPath(video.slug),
    title: `${title} | Shan Shen Bu AI Dance`,
    description,
    ogImage: thumbnail,
    ogType: 'video.other',
    extraMeta: [ldJson(jsonLd)],
  });
}

export function videosIndexHead() {
  const lang = zhLang(getLocale());
  const title =
    lang === 'zh'
      ? '样片视频 | Shan Shen Bu AI Dance'
      : lang === 'es'
        ? 'Videos de muestra | Shan Shen Bu AI Dance'
        : 'Sample videos | Shan Shen Bu AI Dance';
  const description =
    lang === 'zh'
      ? '查看 Shan Shen Bu AI Dance 真实样片：输入照片与闪身步成片对比。AI 生成舞蹈短视频。'
      : lang === 'es'
        ? 'Mira muestras reales de Shan Shen Bu AI Dance: fotos de entrada y el corto flash-step generado. Video IA · baile.'
        : 'Watch real Shan Shen Bu AI Dance samples: input photos and the generated flash-step short. AI-generated dance.';
  return buildSeoHead({ path: '/videos', title, description });
}

export function VideoWatchPage({ video }: { video: WatchVideo }) {
  const lang = zhLang(getLocale());
  const ui = UI[lang] ?? UI.es;
  const media = samplePaths(video.mediaSlug);
  const title = video.title[lang] ?? video.title.es;
  const description = video.description[lang] ?? video.description.es;
  const others = WATCH_VIDEOS.filter((v) => v.slug !== video.slug);

  return (
    <main className="bg-background text-foreground mx-auto min-h-screen max-w-4xl px-4 py-10 sm:py-14">
      <p className="text-muted-foreground mb-6 text-sm">
        <Link href="/videos" className="hover:text-foreground underline-offset-2 hover:underline">
          {ui.back}
        </Link>
      </p>

      <header className="mb-8">
        <p className="mb-3 inline-flex items-center rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          {ui.aiBadge}
        </p>
        <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">{title}</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
          {description}
        </p>
      </header>

      <section aria-label={ui.output} className="mb-10">
        <div className="border-border overflow-hidden rounded-2xl border bg-stone-950 shadow-lg">
          <video
            className="mx-auto aspect-[9/16] max-h-[75vh] w-full max-w-[420px] bg-black object-contain"
            controls
            playsInline
            preload="metadata"
            poster={media.poster}
            src={media.video}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          ~{video.durationSec}s · 9:16 · MP4 · {ui.aiBadge}
        </p>
      </section>

      <section aria-label={ui.inputs} className="mb-10">
        <h2 className="font-serif text-xl tracking-tight sm:text-2xl">{ui.inputs}</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:max-w-xs sm:gap-4">
          {[
            { src: media.inputA, label: ui.inputA },
            ...(ui.inputB && media.inputB
              ? [{ src: media.inputB, label: ui.inputB }]
              : []),
          ].map((slot) => (
            <figure
              key={slot.label}
              className="border-border bg-card overflow-hidden rounded-xl border shadow-sm"
            >
              <div className="bg-muted aspect-[3/4] overflow-hidden">
                <img
                  src={slot.src}
                  alt={slot.label}
                  className="size-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="text-muted-foreground px-2.5 py-2 text-[11px] font-medium sm:text-xs">
                {slot.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="mb-12 rounded-2xl border border-rose-400/30 bg-rose-500/5 p-5 sm:p-6">
        <Link
          href="/#create"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'inline-flex h-11 rounded-full px-6'
          )}
        >
          {ui.cta}
        </Link>
        <p className="text-muted-foreground mt-3 text-sm">{ui.ctaHint}</p>
      </div>

      {others.length > 0 ? (
        <section className="mb-10">
          <h2 className="font-serif text-xl tracking-tight">{ui.more}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {others.map((v) => {
              const m = samplePaths(v.mediaSlug);
              return (
                <li key={v.slug}>
                  <Link
                    href={watchPath(v.slug)}
                    className="border-border bg-card hover:border-rose-400/50 group block overflow-hidden rounded-xl border shadow-sm transition"
                  >
                    <img
                      src={m.poster}
                      alt=""
                      className="aspect-[9/14] w-full object-cover transition group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-foreground block px-3 py-2 text-xs font-medium leading-snug">
                      {v.caption[lang] ?? v.caption.es}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <p className="text-muted-foreground text-xs leading-relaxed">{ui.note}</p>
    </main>
  );
}

export function VideosIndexPage() {
  const lang = zhLang(getLocale());
  const ui = UI[lang] ?? UI.es;
  const heading =
    lang === 'zh'
      ? '样片视频'
      : lang === 'es'
        ? 'Videos de muestra'
        : 'Sample videos';
  const lead =
    lang === 'zh'
      ? '以下为站点内真实素材的 AI 生成样片。点击查看输入照片与成片。'
      : lang === 'es'
        ? 'Muestras reales del producto (archivos en el sitio). Abre una para ver fotos de entrada y el resultado IA.'
        : 'Real product samples (on-site assets). Open one to see input photos and the AI output.';

  return (
    <main className="bg-background text-foreground mx-auto min-h-screen max-w-5xl px-4 py-10 sm:py-14">
      <p className="text-muted-foreground mb-6 text-sm">
        <Link href="/#create" className="hover:text-foreground underline-offset-2 hover:underline">
          {lang === 'zh' ? '← 去创建' : lang === 'es' ? '← Ir a crear' : '← Go to create'}
        </Link>
      </p>
      <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">{heading}</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm sm:text-base">{lead}</p>
      <p className="mt-2 inline-flex rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
        {ui.aiBadge}
      </p>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {WATCH_VIDEOS.map((v) => {
          const m = samplePaths(v.mediaSlug);
          return (
            <li key={v.slug}>
              <Link
                href={watchPath(v.slug)}
                className="border-border bg-card hover:border-rose-400/50 group flex h-full flex-col overflow-hidden rounded-2xl border shadow-md transition"
              >
                <div className="relative aspect-[9/14] overflow-hidden bg-stone-900 sm:aspect-video">
                  <img
                    src={m.poster}
                    alt=""
                    className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
                    {ui.aiBadge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 px-4 py-3">
                  <h2 className="text-foreground font-serif text-lg leading-snug tracking-tight">
                    {v.title[lang] ?? v.title.es}
                  </h2>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {v.caption[lang] ?? v.caption.es}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="text-muted-foreground mt-8 text-xs leading-relaxed">{ui.note}</p>
    </main>
  );
}
