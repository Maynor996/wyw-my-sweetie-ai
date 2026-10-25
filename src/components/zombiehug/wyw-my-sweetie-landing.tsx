'use client';


import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutGrid, Menu, Sparkles, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { LocaleSelector } from '@/components/locale-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';
import { SiteUserMenu } from '@/components/site-user-menu';

import { CreatePanel } from './create-panel';
import { getEffectCopy } from './effect-copies';
import { WC_GALLERY } from './wyw-my-sweetie-gallery';
import { getLandingUi } from './landing-ui';
import { zhLang } from './lang';
import { SampleGalleryGrid } from './sample-gallery-grid';

const SCENE_COUNT = WC_GALLERY.length;
const MARKETING_FROM = '$8.88';
const PRIMARY = 'wyw-my-sweetie';
const SECONDARY = null as string | null;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goCreateWithTemplate(slug = PRIMARY) {
  const url = new URL(window.location.href);
  url.searchParams.set('template', slug);
  url.hash = 'create';
  window.history.replaceState(
    {},
    '',
    url.pathname + '?' + url.searchParams.toString() + '#create'
  );
  window.dispatchEvent(
    new CustomEvent('wyw-my-sweetie:template', { detail: { slug } })
  );
  scrollToId('create');
}

export function WywMySweetieLanding() {
  const lang = zhLang(getLocale());
  const ui = getLandingUi(lang);
  const t = getEffectCopy(PRIMARY, lang);
  const { data: session } = useSession();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  async function onBuy(productId: string) {
    if (buyingId) return;
    setBuyingId(productId);
    try {
      const res = await fetch('/api/zombie/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, effectSlug: PRIMARY }),
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
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNewFace, setShowNewFace] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeSlug = PRIMARY;

  function kickHeroPlayback() {
    const v = heroVideoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }
  useEffect(() => {
    kickHeroPlayback();
    const v = heroVideoRef.current;
    if (!v) return;
    const onVis = () => {
      if (document.visibilityState === 'visible') kickHeroPlayback();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [showNewFace]);
  const navLinks = useMemo(
    () => [
      { href: '#create', label: ui.navMake },
      { href: '#gallery', label: ui.navExamples },
      { href: '/guides', label: ui.navGuides },
      { href: '#who', label: ui.navWho },
      { href: '/pricing', label: ui.navPricing },
    ],
    [ui]
  );

  const footerColumns: FooterColumn[] = [
    {
      title: t.footerProduct,
      links: [
        { label: ui.footerMakeVideo, href: '#create' },
        { label: ui.footerSamples, href: '#gallery' },
        { label: t.navPricing, href: '/pricing' },
        { label: t.navEffects, href: '/effects' },
      ],
    },
    {
      title: lang === 'zh' ? '探索' : 'Explore',
      links: [
        { label: 'Effects', href: '/effects' },
        { label: 'Guides', href: '/guides' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: t.footerLegal,
      links: [
        { label: ui.footerPrivacy, href: '/privacy-policy' },
        { label: ui.footerTerms, href: '/terms-of-service' },
      ],
    },
  ];

  function onPhotoCta() {
    goCreateWithTemplate(PRIMARY);
  }

  return (
    <div
      className="bg-background text-foreground min-h-screen overflow-x-hidden"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <header className="sticky top-0 z-50 border-border bg-background/95 border-b backdrop-blur-md">
        <div className="mx-auto flex h-[4.25rem] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src="/logo.svg"
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full object-cover shadow-sm ring-1 ring-foreground/20"
            />
            <span className="font-serif text-[1.05rem] leading-none tracking-tight">
              {ui.brandName}
            </span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            <ThemeToggle />
            <LocaleSelector
              variant="pill"
              className="h-8 border-border bg-transparent px-3 text-xs text-muted-foreground"
            />
            {user ? (
              <SiteUserMenu
                name={user.name || 'User'}
                email={user.email}
                image={user.image}
              />
            ) : (
              <Link
                href="/sign-in?callbackUrl=%2Fsettings"
                className="text-[0.8125rem] text-muted-foreground hover:text-foreground"
              >
                {ui.signIn}
              </Link>
            )}
            <button
              type="button"
              onClick={onPhotoCta}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#e9b824] px-3.5 text-[0.8rem] font-semibold text-foreground shadow-[inset_0_-2px_#0000001f] hover:bg-[#f2c53a]"
            >
              <Upload className="size-3.5" />
              {ui.makeVideo}
            </button>
          </div>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border md:hidden"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {mobileOpen ? (
          <div className="border-t border-border px-4 py-3 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <ThemeToggle />
                <LocaleSelector variant="pill" className="h-8 text-xs" />
              </div>
              {user ? (
                <SiteUserMenu
                  name={user.name || 'User'}
                  email={user.email}
                  image={user.image}
                />
              ) : (
                <Link
                  href="/sign-in?callbackUrl=%2Fsettings"
                  className="text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {ui.signIn}
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <section className="relative overflow-hidden px-4 pt-10 pb-6 sm:pt-14 sm:pb-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-auto -right-[10%] -bottom-[40%] h-[120%] w-[55%] bg-[radial-gradient(closest-side,#e9b82452,transparent_70%)]"
        />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <p className="mb-3 hidden items-center gap-2 text-[0.7rem] font-medium tracking-[0.14em] text-muted-foreground uppercase sm:flex">
              <span className="inline-block size-1.5 rounded-full bg-[#e9b824]" />
              {ui.eyebrow}
            </p>

            <h1 className="font-serif text-[2.15rem] leading-[1.15] tracking-tight sm:text-[2.75rem] lg:text-[3.1rem]">
              {ui.heroTitle}
            </h1>
            <p className="mt-2 font-serif text-[1.35rem] text-muted-foreground sm:text-[1.65rem]">
              {ui.heroSub}
            </p>

            <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
              {ui.heroBody}
            </p>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={onPhotoCta}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[20px] border-[1.5px] border-border bg-card px-4 py-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/40 sm:gap-4"
              >
                <span className="flex items-center gap-1.5">
                  <img
                    src={`/samples/wyw-my-sweetie/poster.jpg`}
                    alt=""
                    width={540}
                    height={960}
                    className="h-14 w-10 rounded-lg object-cover ring-1 ring-foreground/15"
                  />
                  <span className="text-muted-foreground" aria-hidden>
                    →
                  </span>
                  <img
                    src={`/samples/wyw-my-sweetie/frame-3.jpg`}
                    alt=""
                    width={540}
                    height={960}
                    className="h-14 w-10 rounded-lg object-cover ring-1 ring-foreground/15"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.95rem] font-semibold">
                    {ui.ctaPhotoTitle}
                  </span>
                  <span className="mt-0.5 block text-[0.75rem] leading-snug text-muted-foreground">
                    {ui.ctaPhotoHint}
                  </span>
                  <span className="mt-1 block text-[0.8rem] font-medium text-amber-700 dark:text-amber-400">
                    {ui.ctaFrom} {MARKETING_FROM}
                  </span>
                </span>
                <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#e9b824] px-3.5 text-[0.8rem] font-semibold text-foreground shadow-[inset_0_-2px_#0000001f] group-hover:bg-[#f2c53a]">
                  <Upload className="size-3.5" />
                  {ui.upload}
                </span>
              </button>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => scrollToId('gallery')}
                className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-border bg-card px-4 py-2.5 text-center text-[0.8125rem] font-medium leading-snug text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/40 sm:text-[0.875rem]"
              >
                <LayoutGrid className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <span>{ui.scenesCta(SCENE_COUNT)}</span>
              </button>
              <Link
                href="/effects"
                className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-border bg-card px-4 py-2.5 text-center text-[0.8125rem] font-medium leading-snug text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/40 sm:text-[0.875rem]"
              >
                <Sparkles className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <span>{ui.describeCta}</span>
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[330px] lg:justify-self-center">
            <div className="relative mx-auto mt-8 aspect-[9/19] max-h-[50vh] w-full max-w-[min(100%,220px)] rotate-[2.5deg] rounded-[44px] bg-stone-950 p-[10px] shadow-2xl ring-1 ring-white/10 sm:mt-0 sm:max-h-none sm:max-w-[300px]">
              <div className="relative size-full overflow-hidden rounded-[34px] bg-stone-900">
                <video
                  key={activeSlug}
                  ref={heroVideoRef}
                  className="absolute inset-0 size-full cursor-pointer object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onClick={() => setShowNewFace((v) => !v)}
                  onLoadedData={kickHeroPlayback}
                  onCanPlay={kickHeroPlayback}
                  poster={showNewFace
                    ? '/samples/wyw-my-sweetie/poster.jpg'
                    : '/samples/wyw-my-sweetie/poster.jpg'}
                  src={showNewFace
                    ? '/samples/wyw-my-sweetie/sample.mp4'
                    : '/samples/wyw-my-sweetie/sample.mp4'}
                />
                <span
                  className={cn(
                    'absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase backdrop-blur-sm',
                    showNewFace ? 'bg-emerald-700/80' : 'bg-foreground/70'
                  )}
                >
                  {'Demo'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowNewFace((v) => !v)}
                  className="absolute right-3 bottom-3 left-3 inline-flex items-center justify-center rounded-full bg-[#e9b824] px-3 py-2.5 text-[0.8rem] font-semibold text-foreground shadow-md transition hover:bg-[#f2c53a]"
                >
                  {ui.putNewFace}
                </button>
              </div>
            </div>
            <p className="mt-5 max-w-[300px] text-center text-[0.8rem] leading-relaxed text-muted-foreground lg:mx-auto">
              {ui.phoneCaption}
            </p>
          </div>
        </div>

        <ul
          className="mx-auto mt-12 grid max-w-[1200px] grid-cols-2 border-t border-border pt-6 sm:grid-cols-4"
          aria-label={ui.statsAria}
        >
          {ui.stats.map((s, i) => (
            <li
              key={s.n}
              className={cn(
                'px-3 py-2 sm:px-5',
                i > 0 && 'sm:border-l sm:border-border',
                i % 2 === 1 && 'border-l border-border sm:border-l'
              )}
            >
              <b className="font-serif text-2xl tracking-tight sm:text-[1.75rem]">
                {s.n}
              </b>
              <span className="mt-1 block text-[0.75rem] leading-snug text-muted-foreground">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="who" className="scroll-mt-20 border-t border-border px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-[0.7rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {ui.character}
          </p>
          <h2 className="font-serif text-3xl tracking-tight">{ui.whoTitle}</h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground">
            {ui.whoBody}
          </p>
          <div className="mt-6 space-y-4 text-[0.98rem] leading-relaxed text-muted-foreground">
            {t.whatParas.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-20 border-t border-border bg-muted/30 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl tracking-tight">{t.howH}</h2>
          <ol className="mt-6 space-y-4">
            {t.howSteps.map(([title, body], i) => (
              <li key={title} className="rounded-xl border border-border bg-card px-4 py-3">
                <p className="font-medium">
                  <span className="text-muted-foreground mr-2">{i + 1}.</span>
                  {title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 border-t border-border px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl tracking-tight">{t.featuresH}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {t.features.map(([title, body]) => (
              <li key={title} className="rounded-xl border border-border bg-card px-4 py-3">
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="create" className="scroll-mt-20 border-t border-border bg-muted/40 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-[0.7rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {ui.createEyebrow}
          </p>
          <h2 className="font-serif text-3xl tracking-tight">{ui.createTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {ui.createHint(MARKETING_FROM)}
          </p>
          <div className="mt-8">
            <CreatePanel t={getEffectCopy(activeSlug, lang)} effectSlug={activeSlug} mediaSlug={activeSlug} />
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-20 border-t border-border px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <SampleGalleryGrid
            items={WC_GALLERY}
            lang={lang}
            heading={ui.galleryHeading(SCENE_COUNT)}
            subheading={ui.gallerySub}
            outputLabel={t.resultsOutputLabel ?? 'Output'}
          />
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 border-t border-border bg-muted/35 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-3xl tracking-tight">{t.pricingH}</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t.pricingP}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {t.packs.map((pack) => (
              <li
                key={pack.id}
                className={cn(
                  'flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm',
                  pack.featured && 'ring-2 ring-[#e9b824]/80'
                )}
              >
                {pack.badge ? (
                  <p className="mb-2 text-[10px] font-semibold tracking-wide text-amber-700 dark:text-amber-400 uppercase">
                    {pack.badge}
                  </p>
                ) : null}
                <p className="font-serif text-xl">{pack.name}</p>
                <p className="mt-1 text-2xl font-semibold">{pack.price}</p>
                <p className="mt-2 text-sm text-muted-foreground">{pack.desc}</p>
                <p className="mt-1 text-xs text-muted-foreground">{pack.unitPrice}</p>
                <button
                  type="button"
                  onClick={() => onBuy(pack.id)}
                  disabled={buyingId !== null}
                  data-testid={`buy-${pack.id}`}
                  className={cn(
                    'relative z-10 mt-5 h-11 w-full rounded-full text-sm font-semibold transition-colors disabled:opacity-70',
                    pack.featured
                      ? 'bg-foreground text-background hover:opacity-90'
                      : 'border border-foreground/30 bg-transparent text-foreground hover:bg-muted'
                  )}
                >
                  {buyingId === pack.id ? '…' : `${t.buyPlaceholder} · ${pack.price}`}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">{t.pricingNote}</p>
          <p className="mt-2 text-xs text-muted-foreground">{ui.stripeNote}</p>
        </div>
      </section>

      <section id="privacy" className="scroll-mt-20 border-t border-border px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl tracking-tight">{t.privacyH}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {(t.privacySteps ?? []).map(([title, body]) => (
              <li key={title} className="rounded-xl border border-border bg-card px-4 py-3">
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
          <h2 className="mt-10 font-serif text-2xl tracking-tight">{t.disclaimerH}</h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-muted-foreground">
            {t.disclaimerLead}
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {(t.disclaimerBullets ?? []).map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t.disclaimerNote}
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 border-t border-border px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl tracking-tight">{ui.faqTitle}</h2>
          <div className="mt-6 space-y-3">
            {t.faqs.slice(0, 10).map(([q, a]) => (
              <details
                key={q}
                className="group rounded-xl border border-border bg-card px-4 py-3"
              >
                <summary className="cursor-pointer list-none font-medium">{q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter
        tagline={t.footerTagline}
        columns={footerColumns}
        copyright={`© ${new Date().getFullYear()} Wyw My Sweetie AI · independent fan tool`}
      />
    </div>
  );
}
