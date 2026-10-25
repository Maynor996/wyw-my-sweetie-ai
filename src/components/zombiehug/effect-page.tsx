'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Film,
  Heart,
  Images,
  Smartphone,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { buttonVariants } from '@/components/ui/button';

import '@/styles/zombiehug-home.css';

import { CreatePanel } from './create-panel';
import { DemoStrip } from './demo-strip';
import { getEffectCopy } from './effect-copies';
import { EFFECT_BY_SLUG, samplePaths } from './effects';
import { zhLang } from './lang';
import { productFooterColumns } from './footer-links';
import { MoreEffects } from './more-effects';
import { RelatedTools } from './related-tools';

const FEATURE_ICONS = [Film, Sparkles, Heart, Users] as const;

const HERO_SAMPLES = [
  {
    slug: 'wyw-my-sweetie',
    effectSlug: 'wyw-my-sweetie',
    label: { en: 'Wyw My Sweetie', es: 'Wyw My Sweetie', zh: 'Wyw My Sweetie' },
  },
] as const;

/** Create URL for a sample's real template (never keep homepage create for skirt/vault/pet). */
function createHrefForEffect(effectSlug: string, currentPageSlug: string): string {
  if (effectSlug === currentPageSlug) return '#create';
  if (effectSlug === 'wyw-my-sweetie') return '/#create';
  return `/effects/${effectSlug}#create`;
}

export function EffectPage({ slug }: { slug: string }) {
  const lang = zhLang(getLocale());
  const t = getEffectCopy(slug, lang);
  const meta = EFFECT_BY_SLUG[slug];
  const mediaSlug = meta?.mediaSlug ?? slug;
  const [openFaq, setOpenFaq] = useState(0);
  const [sampleIdx, setSampleIdx] = useState(() =>
    slug === 'wyw-my-sweetie' ? 1 : 0
  );
  const activeSample = HERO_SAMPLES[sampleIdx] ?? HERO_SAMPLES[0];
  const sampleMedia = samplePaths(activeSample.slug);

  const navLinks = useMemo(
    () => [
      { href: '#create', label: t.navCreate },
      { href: '#samples', label: t.navDemo },
      { href: '#what', label: t.navWhat },
      { href: '#how', label: lang === 'zh' ? '怎么做' : lang === 'es' ? 'Cómo' : 'How to' },
      { href: '#pricing', label: t.navPricing },
      { href: '#faq', label: t.navFaq },
      { href: '/effects', label: t.navEffects },
    ],
    [t, lang]
  );

  const footerColumns: FooterColumn[] = productFooterColumns(
    lang,
    {
      footerProduct: t.footerProduct,
      footerLegal: t.footerLegal,
      navCreate: t.navCreate,
      navEffects: t.navEffects,
    },
    { createHref: '#create', pricingHref: '#pricing', faqHref: '#faq' }
  );

  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const isHomeFlash = slug === 'wyw-my-sweetie';
  const activeCreateHref = createHrefForEffect(
    activeSample.effectSlug,
    slug
  );
  const previewIsOtherTemplate = activeSample.effectSlug !== slug;

  const facts = useMemo(() => {
    const dur =
      meta?.durationSec ??
      (slug === 'skirt-ad-text' || slug === 'vault-costume-world-swap' ? 7 : 13);
    if (lang === 'zh') {
      const photoN =
        slug === 'vault-costume-world-swap'
          ? '3 张照片'
          : '1 张照片';
      return [
        { icon: Images, strong: photoN, rest: '你上传' },
        { icon: Video, strong: `${dur} 秒短片`, rest: '带声音' },
        {
          icon: Smartphone,
          strong: slug === 'vault-costume-world-swap' ? '16:9 / 9:16' : '9:16',
          rest: '适配短视频平台',
        },
        { icon: BadgeCheck, strong: '无水印', rest: '一次付费' },
      ];
    }
    if (lang === 'es') {
      const photoN =
        slug === 'vault-costume-world-swap' ? '3 fotos' : '1 foto';
      return [
        { icon: Images, strong: photoN, rest: 'que añades' },
        { icon: Video, strong: `Clip de ~${dur} s`, rest: 'con sonido' },
        {
          icon: Smartphone,
          strong: slug === 'vault-costume-world-swap' ? '16:9 / 9:16' : '9:16',
          rest: 'para shorts',
        },
        { icon: BadgeCheck, strong: 'Sin marca de agua', rest: 'pago único' },
      ];
    }
    const photoN =
      slug === 'vault-costume-world-swap' ? '3 photos' : '1 photo';
    return [
      { icon: Images, strong: photoN, rest: 'you add' },
      { icon: Video, strong: `~${dur}s clip`, rest: 'with sound' },
      {
        icon: Smartphone,
        strong: slug === 'vault-costume-world-swap' ? '16:9 / 9:16' : '9:16',
        rest: 'for TikTok, Reels, Shorts',
      },
      { icon: BadgeCheck, strong: 'No watermark', rest: 'pay once' },
    ];
  }, [lang, slug, meta?.durationSec]);

  const heroRest = isHomeFlash
    ? lang === 'zh'
      ? '起价 $8.88 · 约 13–15 秒 · 9:16'
      : lang === 'es'
        ? 'Desde $8.88 · ~13–15s · 9:16'
        : 'From $8.88 · ~13–15s · 9:16'
    : t.durationBadge;

  const eyebrow = isHomeFlash
    ? lang === 'zh'
      ? '可立即制作 · 1 张照片 · 闪身步'
      : lang === 'es'
        ? 'Listo para crear · 1 foto · Flash Step'
        : 'Ready to make · 1 photo · Flash Step'
    : t.effectBadge;

  const compareNote =
    lang === 'zh'
      ? '站内真实样片。点选标签预览；点「用这个做 / 开始创作」会进入对应模板页（甩裙广告字不会误走闪身步）。'
      : lang === 'es'
        ? 'Demos reales. La pestaña solo previsualiza; «Usar este estilo» abre la plantilla correcta.'
        : 'Real demos. Tabs preview only — “Use this style / Create” opens that template’s create page (skirt-ad never silently uses flash-step).';

  const akaLine =
    slug === 'skirt-ad-text'
      ? lang === 'zh'
        ? '甩裙广告字 · Skirt-Ad Text · 汉服甩裙'
        : 'Skirt-Ad Text · 甩裙广告字 · hanfu spin'
      : slug === 'vault-costume-world-swap'
        ? lang === 'zh'
          ? '翻越换装 · Vault World-Swap'
          : 'Vault → Costume World-Swap'
        : lang === 'zh'
          ? 'Flash step · Dodge step · Body-dodging step · 閃身步'
          : 'Flash step · Dodge step · Body-dodging step · 閃身步';

  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { rootMargin: '-64px 0px 0px 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setHeroReady(false);
    const video = heroVideoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, [activeSample.slug]);

  async function onBuy(productId: string) {
    if (buyingId) return;
    setBuyingId(productId);
    try {
      const res = await fetch('/api/zombie/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, effectSlug: slug }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json || json.code !== 0 || !json.data?.checkout_url) {
        toast.message(json?.message || t.toastSoon);
        setBuyingId(null);
        return;
      }
      window.location.href = json.data.checkout_url as string;
    } catch (err: any) {
      toast.message(err?.message || t.toastSoon);
      setBuyingId(null);
    }
  }

  return (
    <div className="cmm-page bg-background text-foreground min-h-screen">
      <SiteHeader navLinks={navLinks} />

      {showSticky ? (
        <div className="cmm-sticky-bar sticky top-0 z-40">
          <div className="cmm-shell flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0 truncate text-sm text-[color:var(--cmm-muted)]">
              <span className="font-medium text-[color:var(--cmm-ink)]">
                {t.effectBadge}
              </span>
              <span className="mx-2 opacity-40">·</span>
              <span>{t.durationBadge}</span>
            </div>
            <a
              href="#create"
              className={cn(
                buttonVariants({ size: 'sm' }),
                'cmm-cta-primary h-8 shrink-0 rounded-full px-4 text-xs font-semibold'
              )}
            >
              {t.stickyCreate}
            </a>
          </div>
        </div>
      ) : null}

      <section ref={heroRef} className="cmm-shell cmm-tpl-hero">
        <div className="cmm-tpl-main">
          <p className="cmm-eyebrow">
            <Sparkles className="size-3.5" aria-hidden />
            {eyebrow}
          </p>

          <h1>
            <span className="cmm-grad-text">{t.heroH}</span>
            <span className="cmm-h1-rest">{heroRest}</span>
          </h1>

          <p className="cmm-lead">{t.heroP}</p>

          <div className="cmm-compare">
            <div className="cmm-compare-stage">
              <div className="cmm-compare-phone">
                <img
                  className={cn(
                    'cmm-poster transition-opacity duration-300',
                    heroReady ? 'opacity-0' : 'opacity-100'
                  )}
                  src={sampleMedia.poster}
                  alt=""
                  aria-hidden
                  decoding="async"
                  fetchPriority="high"
                />
                <video
                  ref={heroVideoRef}
                  className={cn(
                    'transition-opacity duration-300',
                    heroReady ? 'opacity-100' : 'opacity-0'
                  )}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={sampleMedia.poster}
                  src={sampleMedia.video}
                  onLoadedData={() => setHeroReady(true)}
                  onPlaying={() => setHeroReady(true)}
                />
              </div>
              <span className="cmm-compare-badge">{t.heroSampleLabel}</span>
            </div>
            <div className="cmm-compare-bar">
              <div className="cmm-compare-tabs" role="tablist">
                {HERO_SAMPLES.map((s, i) => (
                  <button
                    key={s.slug}
                    type="button"
                    role="tab"
                    aria-selected={sampleIdx === i}
                    className={cn('cmm-compare-tab', sampleIdx === i && 'on')}
                    onClick={() => setSampleIdx(i)}
                  >
                    {s.label[lang] ?? s.label.en}
                  </button>
                ))}
              </div>
              <div className="cmm-compare-inputs" aria-hidden>
                <img src={sampleMedia.inputA} alt="" />
                <span className="text-xs font-medium text-[color:var(--cmm-muted)]">
                  {t.resultsInputLabel ?? 'Input'}
                </span>
              </div>
            </div>
            <p className="cmm-compare-note">{compareNote}</p>
          </div>

          <ul className="cmm-facts">
            {facts.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.strong}>
                  <Icon className="size-5" aria-hidden />
                  <span>
                    <strong>{f.strong}</strong> {f.rest}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="cmm-buy">
            <p className="cmm-noprompt">
              <Check aria-hidden />
              <span>
                <strong>
                  {lang === 'zh'
                    ? '无需写提示词'
                    : lang === 'es'
                      ? 'Sin prompt que escribir'
                      : 'No prompt to write'}
                </strong>
                <span className="cmm-noprompt-sub">
                  {lang === 'zh'
                    ? '添加照片，点一下即可'
                    : lang === 'es'
                      ? 'Añade tu foto y toca una vez'
                      : 'Add your photo and tap once'}
                </span>
              </span>
            </p>
            {previewIsOtherTemplate ? (
              <p className="mb-2 rounded-xl border border-[color:var(--cmm-accent)]/30 bg-[color:var(--cmm-accent-soft)] px-3 py-2 text-xs leading-relaxed text-[color:var(--cmm-ink)] sm:text-sm">
                {lang === 'zh'
                  ? `正在预览「${activeSample.label.zh}」— 右侧创作区仍是本页模板「${t.effectBadge}」。要点这个样片请点下方按钮进入对应模板。`
                  : lang === 'es'
                    ? `Vista previa de «${activeSample.label.es || activeSample.label.en}». El panel de creación sigue en esta plantilla. Usa el botón para abrir la plantilla correcta.`
                    : `Previewing “${activeSample.label.en}” — the create panel is still “${t.effectBadge}”. Tap below to open that template’s create page.`}
              </p>
            ) : null}
            <a
              href={activeCreateHref}
              className={cn(buttonVariants({ size: 'lg' }), 'cmm-cta-big')}
            >
              <span>
                {previewIsOtherTemplate
                  ? lang === 'zh'
                    ? `去做${activeSample.label.zh}`
                    : lang === 'es'
                      ? `Crear: ${activeSample.label.es || activeSample.label.en}`
                      : `Create: ${activeSample.label.en}`
                  : lang === 'zh'
                    ? '开始创作'
                    : lang === 'es'
                      ? 'Crea el tuyo'
                      : 'Create your own'}
              </span>
              <span className="cmm-cta-big-chip" aria-hidden>
                <ArrowRight className="size-5" />
              </span>
            </a>
            <p className="cmm-price-note">
              {lang === 'zh' ? (
                <>
                  几分钟出片 · 起价 <strong>$8.88</strong>
                </>
              ) : lang === 'es' ? (
                <>
                  Listo en <strong>unos minutos</strong> · Desde{' '}
                  <strong>$8.88</strong>
                </>
              ) : (
                <>
                  Ready in <strong>a few minutes</strong> · From{' '}
                  <strong>$8.88</strong>
                </>
              )}
            </p>
          </div>

          <p className="cmm-instruction">{t.heroInstruction}</p>
          <p className="text-sm font-medium text-[color:var(--cmm-ink-2)]">
            <Video className="mr-1.5 inline size-3.5 text-[color:var(--cmm-accent)]" />
            {t.brandChip}
          </p>
        </div>

        <aside className="cmm-tpl-side space-y-3" id="create-aside">
          {previewIsOtherTemplate ? (
            <div className="cmm-tool border-border rounded-3xl border bg-[color:var(--cmm-accent-soft)] p-5 shadow-xl">
              <p className="cmm-tool-eyebrow">
                {lang === 'zh'
                  ? '预览中的模板'
                  : lang === 'es'
                    ? 'Plantilla en vista previa'
                    : 'Previewing template'}
              </p>
              <h2 className="cmm-tool-title mt-1">
                {activeSample.label[lang] ?? activeSample.label.en}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--cmm-ink-2)]">
                {lang === 'zh'
                  ? '本页右侧原先会继续走「闪身步」跟舞（短裤运动动作）。甩裙广告字 / 翻越换装 / 宠物版是独立模板，必须进入对应页面才会带上正确的 prompt 与参考素材。'
                  : lang === 'es'
                    ? 'Crear aquí seguiría el flash-step. Abre la plantilla correcta para prompt y referencias.'
                    : 'Creating here would still run flash-step motion. Open the matching template so Seedance gets the right prompt and refs (skirt-ad is image-only + your ad text).'}
              </p>
              <a
                href={activeCreateHref}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'cmm-cta-primary mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full font-semibold'
                )}
              >
                {lang === 'zh'
                  ? `进入「${activeSample.label.zh}」创作`
                  : lang === 'es'
                    ? `Abrir ${activeSample.label.es || activeSample.label.en}`
                    : `Open ${activeSample.label.en} create`}
                <ArrowRight className="size-4" />
              </a>
              <button
                type="button"
                className="mt-3 w-full text-center text-xs text-[color:var(--cmm-muted)] underline-offset-2 hover:underline"
                onClick={() =>
                  setSampleIdx(slug === 'wyw-my-sweetie' ? 1 : 0)
                }
              >
                {lang === 'zh'
                  ? `回到本页「${t.effectBadge}」创作`
                  : lang === 'es'
                    ? 'Volver a la plantilla de esta página'
                    : `Back to this page’s create (${t.effectBadge})`}
              </button>
            </div>
          ) : (
            <>
              {t.previewBanner ? (
                <div className="cmm-promo">
                  <p className="font-medium text-[color:var(--cmm-ink)]">
                    {t.previewBanner}
                  </p>
                </div>
              ) : null}
              <div className="cmm-promo">
                <p>
                  <span className="cmm-promo-badge">{t.promoBadge}</span>
                  {t.promoBanner}
                </p>
              </div>
              <CreatePanel
                t={t}
                effectSlug={slug}
                mediaSlug={mediaSlug}
                toolChrome
              />
            </>
          )}
        </aside>
      </section>

      <section id="what" className="cmm-section scroll-mt-20">
        <div className="cmm-shell cmm-prose">
          <span className="cmm-eyebrow-sec">
            {lang === 'zh' ? '趋势介绍' : lang === 'es' ? 'La tendencia' : 'The trend'}
          </span>
          <h2 className="cmm-h2">{t.whatH}</h2>
          {t.whatParas.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
          <p className="cmm-aka">
            <span className="cmm-aka-label">
              {lang === 'zh' ? '也叫' : 'Also called'}
            </span>
            {akaLine}
          </p>
        </div>
      </section>

      <section id="samples" className="cmm-section cmm-section-band scroll-mt-20">
        <div className="cmm-shell">
          <span className="cmm-eyebrow-sec">
            {lang === 'zh' ? '样片' : lang === 'es' ? 'Muestras' : 'Samples'}
          </span>
          <h2 className="cmm-h2">
            {slug === 'skirt-ad-text'
              ? t.resultsH
              : slug === 'vault-costume-world-swap'
                ? t.resultsH
                : lang === 'zh'
                  ? 'What the wywmysweetie AI video looks like'
                  : lang === 'es'
                    ? 'What the wywmysweetie AI video looks like'
                    : 'What the wywmysweetie AI video looks like'}
          </h2>
          <p className="cmm-sub">
            {slug === 'skirt-ad-text' || slug === 'vault-costume-world-swap'
              ? t.resultsP
              : lang === 'zh'
                ? '这是站内样片。你的照片替换角色，镜头节奏保持一致。每次生成都不一样。'
                : lang === 'es'
                  ? 'Demos de este sitio. Tus fotos reemplazan a los personajes; el ritmo se mantiene. Cada toma es distinta.'
                  : 'These are our on-site demos. Your photos replace the characters, so your video follows the same shots with your faces. No two runs come out the same.'}
          </p>
          <div className="cmm-examples">
            {HERO_SAMPLES.map((s) => {
              const media = samplePaths(s.slug);
              return (
                <article key={s.slug} className="cmm-example">
                  <div className="cmm-example-pair">
                    <figure>
                      <img src={media.inputA} alt="" loading="lazy" />
                    </figure>
                    <figure>
                      <video
                        src={media.video}
                        poster={media.poster}
                        controls
                        playsInline
                        preload="metadata"
                        muted
                        loop
                      />
                    </figure>
                  </div>
                  <figcaption className="mt-3 block text-[13px] text-[color:var(--cmm-muted)]">
                    {s.label[lang] ?? s.label.en}
                    {false /* retired */
                      ? lang === 'zh'
                        ? ' · 约 15 秒'
                        : ' · ~15 s'
                      : s.effectSlug === 'skirt-ad-text' ||
                          s.effectSlug === 'vault-costume-world-swap'
                        ? lang === 'zh'
                          ? ' · 约 7 秒'
                          : ' · ~7 s'
                        : lang === 'zh'
                          ? ' · 约 13 秒'
                          : ' · ~13 s'}
                  </figcaption>
                  <p>
                    {false /* retired */
                      ? lang === 'zh'
                        ? '宠物版：阳光庭院里后腿直立，闪身步、踢球、哆嗦毛，收尾近景脸部。'
                        : lang === 'es'
                          ? 'Mascota: patio soleado, de pie, flash-step, patada y temblor, cierre en primer plano.'
                          : 'Pet take: sunny courtyard, upright flash-step, kick and shiver, ending on a face close-up.'
                      : s.effectSlug === 'skirt-ad-text'
                        ? lang === 'zh'
                          ? '甩裙广告字：真实街景广场换汉服，甩裙圆盘上印自定义广告文案（约 6.6 秒）。独立模板，不是闪身步。'
                          : lang === 'es'
                            ? 'Texto en falda: plaza real, hanfu, anuncio en el disco de falda (~6.6s). Plantilla independiente.'
                            : 'Skirt-ad text: real plaza, hanfu spin, your copy on the flared skirt disc (~6.6s). Standalone — not flash-step.'
                        : s.effectSlug === 'vault-costume-world-swap'
                          ? lang === 'zh'
                            ? '翻越换装：三图世界切换，约 7 秒，红衣古装收尾。'
                            : lang === 'es'
                              ? 'Vault world-swap: 3 fotos, ~7s, traje rojo al final.'
                              : 'Vault world-swap: 3 images, ~7s, red traditional dance finish.'
                          : lang === 'zh'
                            ? 'AI 虾版：蓝色教学舞台上闪身步再踢球 — 最早走红的无人像 AI 样片之一。'
                            : lang === 'es'
                              ? 'Versión AI shrimp: flash-step y patada en el escenario azul de la clase.'
                              : 'AI shrimp take: flash step then ball kick on the blue teaching stage — an early viral AI cut with no real person.'}
                  </p>
                  <a
                    className="cmm-example-use"
                    href={createHrefForEffect(s.effectSlug, slug)}
                  >
                    {lang === 'zh' ? '用这个做' : lang === 'es' ? 'Usar este estilo' : 'Use this style'}
                    <ArrowRight className="size-4" />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <DemoStrip t={t} mediaSlug={mediaSlug} lang={lang} />

      <section id="how" className="cmm-section scroll-mt-20">
        <div className="cmm-shell">
          <span className="cmm-eyebrow-sec">
            {lang === 'zh' ? '一步步' : lang === 'es' ? 'Paso a paso' : 'Step by step'}
          </span>
          <h2 className="cmm-h2">{t.howH}</h2>
          <p className="cmm-sub">
            {lang === 'zh'
              ? '全程浏览器完成。无需剪辑 App，无需写提示词，无水印。'
              : lang === 'es'
                ? 'Todo en el navegador. Sin app de edición, sin prompt, sin marca de agua.'
                : 'Everything runs in the browser. No editing app, no prompt to write, no watermark.'}
          </p>
          <ol className="cmm-steps">
            {t.howSteps.map(([title, body]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cmm-section cmm-section-band">
        <div className="cmm-shell">
          <h2 className="cmm-h2 text-center">{t.featuresH}</h2>
          <div className="cmm-feature-grid">
            {t.features.map(([title, body], i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              return (
                <div key={title} className="cmm-feature-card">
                  <div className="cmm-feature-icon">
                    <Icon className="size-5" />
                  </div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <MoreEffects t={t} lang={lang} excludeSlug={slug} />

      {t.previewCtaH ? (
        <section id="preview" className="cmm-section scroll-mt-20 !pt-0">
          <div className="cmm-shell">
            <div className="cmm-cta-band !text-left">
              <h2 className="cmm-h2 !mb-3">{t.previewCtaH}</h2>
              {t.previewCtaP ? (
                <p className="max-w-3xl text-[15.5px] leading-relaxed text-[color:var(--cmm-ink-2)]">
                  {t.previewCtaP}
                </p>
              ) : null}
              <a
                href="#create"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'cmm-cta-primary mt-6 inline-flex h-11 gap-2 rounded-full px-6'
                )}
              >
                {t.stickyCreate}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </section>
      ) : null}

      {t.privacyH && t.privacySteps ? (
        <section className="cmm-section cmm-section-band">
          <div className="cmm-shell">
            <h2 className="cmm-h2 text-center">{t.privacyH}</h2>
            <ol className="cmm-steps !grid-cols-2 lg:!grid-cols-4">
              {t.privacySteps.map(([title, body]) => (
                <li key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section id="pricing" className="cmm-section cmm-section-band scroll-mt-20">
        <div className="cmm-shell">
          <div className="mb-10 text-center">
            <h2 className="cmm-h2 !mb-3">{t.pricingH}</h2>
            <p className="mx-auto max-w-2xl text-[16px] text-[color:var(--cmm-ink-2)]">
              {t.pricingP}
            </p>
          </div>
          <div className="cmm-packs mx-auto max-w-5xl">
            {t.packs.map((pack) => (
              <div
                key={pack.id}
                className={cn('cmm-pack', pack.featured && 'featured')}
              >
                {pack.badge ? (
                  <span className="cmm-pack-badge">{pack.badge}</span>
                ) : null}
                <h3 className="text-lg font-bold text-[color:var(--cmm-ink)]">
                  {pack.name}
                </h3>
                <p className="text-sm text-[color:var(--cmm-muted)]">{pack.desc}</p>
                <p className="cmm-pack-amount">{pack.price}</p>
                <p className="text-sm text-[color:var(--cmm-muted)]">{pack.videos}</p>
                {pack.unitPrice ? (
                  <p className="text-sm font-medium text-[color:var(--cmm-ink)]">
                    {pack.unitPrice}
                    <span className="font-normal text-[color:var(--cmm-muted)]">
                      {' '}
                      · 720p
                    </span>
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={buyingId === pack.id}
                  onClick={() => onBuy(pack.id)}
                  className={cn(
                    buttonVariants({
                      variant: pack.featured ? 'default' : 'outline',
                      size: 'lg',
                    }),
                    'mt-auto h-11 w-full rounded-full',
                    pack.featured && 'cmm-cta-primary',
                    buyingId === pack.id && 'pointer-events-none opacity-80'
                  )}
                >
                  {buyingId === pack.id ? '…' : t.buyPlaceholder}
                </button>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-[color:var(--cmm-muted)]">
            {t.pricingNote}
          </p>
        </div>
      </section>

      {t.disclaimerH ? (
        <section id="respect" className="cmm-section scroll-mt-20">
          <div className="cmm-shell">
            <div className="cmm-respect">
              <h2 className="cmm-h2 !mb-3">{t.disclaimerH}</h2>
              {t.disclaimerLead ? (
                <p className="text-[15.5px] leading-relaxed text-[color:var(--cmm-ink-2)]">
                  {t.disclaimerLead}
                </p>
              ) : null}
              {t.disclaimerBullets?.length ? (
                <ul className="mt-5 space-y-3 text-[14.5px] leading-relaxed text-[color:var(--cmm-ink)]">
                  {t.disclaimerBullets.map((item) => (
                    <li key={item.slice(0, 48)} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--cmm-accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {t.disclaimerNote ? (
                <p className="mt-5 text-xs leading-relaxed text-[color:var(--cmm-muted)] sm:text-sm">
                  {t.disclaimerNote}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section id="faq" className="cmm-section scroll-mt-20">
        <div className="cmm-shell">
          <h2 className="cmm-h2 text-center">{t.faqH}</h2>
          <div className="cmm-faq">
            {t.faqs.map(([q, a], i) => (
              <div key={q} className="cmm-faq-item">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                >
                  {q}
                  <span className="cmm-faq-mark" aria-hidden>
                    +
                  </span>
                </button>
                {openFaq === i ? <p>{a}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cmm-section !pt-0">
        <div className="cmm-shell">
          <div className="cmm-cta-band">
            <h2 className="cmm-h2 !mb-3">{t.ctaH}</h2>
            <p className="mx-auto max-w-xl text-[16px] text-[color:var(--cmm-ink-2)]">
              {t.ctaP}
            </p>
            <a
              href="#create"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'cmm-cta-primary mt-7 inline-flex h-12 gap-2 rounded-full px-8'
              )}
            >
              {t.ctaBtn}
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <RelatedTools
        excludeId="wyw-my-sweetie"
        lang={lang}
        limit={3}
        preferIds={['burning-bridges', 'alorsondanse', 'remix-meme', 'corpse-bride', 'white-chicks', 'wyw-my-sweetie', 'melodygift']}
      />

      <SiteFooter
        tagline={t.footerTagline}
        columns={footerColumns}
        copyright={`© ${new Date().getFullYear()} ${t.footerDomain}`}
      />
    </div>
  );
}
