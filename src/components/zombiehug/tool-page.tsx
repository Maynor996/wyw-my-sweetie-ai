'use client';

import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';
import { productFooterColumns } from '@/components/zombiehug/footer-links';
import { SiteHeader } from '@/components/site-header';
import { buttonVariants } from '@/components/ui/button';

import { copy, zhLang } from './copy';
import {
  TOOL_BY_ID,
  TOOL_BY_SLUG,
  siblingTools,
  toolLocalPath,
  ToolIcon,
  type RelatedToolId,
} from './related-tools';

export function ToolPage({
  siteId,
  slug,
}: {
  siteId: RelatedToolId;
  slug: string;
}) {
  const lang = zhLang(getLocale());
  const zh = lang === 'zh';
  const t = copy(lang);
  const site = TOOL_BY_ID[siteId];
  const tool = TOOL_BY_SLUG[slug];
  const others = siblingTools(siteId).filter((item) => item.slug !== slug);

  if (!tool) {
    return null;
  }

  const navLinks = [
    { href: '/', label: zh ? '首页' : 'Home' },
    { href: '/#create', label: t.navCreate },
    { href: '/tools', label: zh ? '相关工具' : 'Related tools' },
    { href: '/#pricing', label: t.navPricing },
  ];

  const footerColumns: FooterColumn[] = productFooterColumns(lang, {
    footerProduct: t.footerProduct,
    footerLegal: t.footerLegal,
    navCreate: t.navCreate,
    navEffects: t.navEffects,
  });

  const features = zh ? tool.features.zh : tool.features.en;
  const description = zh ? tool.description.zh : tool.description.en;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader navLinks={navLinks} />
      <section className="relative overflow-hidden px-4 pt-12 pb-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(244,63,94,0.12),_transparent_55%)]"
        />
        <div className="mx-auto max-w-3xl">
          <Link
            href="/tools"
            className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition"
          >
            <ArrowLeft className="size-3.5" />
            {zh ? '全部相关工具' : 'All related tools'}
          </Link>
          <p className="text-muted-foreground mb-2 text-xs tracking-[0.14em] uppercase">
            {zh ? `来自 ${site.name} 的介绍` : `Introduced on ${site.name}`}
          </p>
          <div className="mt-2 flex items-center gap-4">
            <ToolIcon tool={tool} size={48} />
            <div>
              <h1 className="text-foreground font-serif text-4xl tracking-tight sm:text-5xl">
                {tool.name}
              </h1>
              {tool.nameSecondary ? (
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  {zh ? tool.nameSecondary.zh : tool.nameSecondary.en}
                </p>
              ) : null}
            </div>
          </div>
          <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={tool.href}
              target="_blank"
              rel="noopener"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'inline-flex h-12 gap-2 rounded-full px-7 shadow-sm'
              )}
            >
              {zh ? `前往 ${tool.name}` : `Open ${tool.name}`}
              <ArrowUpRight className="size-4" />
            </a>
            <a
              href={tool.href}
              target="_blank"
              rel="noopener"
              className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition"
            >
              {tool.href.replace(/^https:\/\//, '')}
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="border-border bg-card mx-auto max-w-3xl rounded-2xl border p-6 shadow-sm dark:bg-zinc-950 sm:p-8">
          <h2 className="text-foreground font-serif text-2xl tracking-tight">
            {zh ? '亮点' : 'Highlights'}
          </h2>
          <ul className="mt-4 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm sm:text-base">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                  <Check className="size-3" />
                </span>
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-border border-t px-4 py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-foreground font-serif text-2xl tracking-tight">
              {zh ? '其他相关工具' : 'Other related tools'}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {others.map((item) => (
                <li key={item.id}>
                  <Link
                    href={toolLocalPath(item.slug)}
                    className="border-border bg-card hover:border-rose-400/50 flex items-start gap-3 rounded-xl border px-4 py-3 transition dark:bg-zinc-950"
                  >
                    <ToolIcon tool={item} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="text-foreground block font-semibold">
                        {item.name}
                      </span>
                      {item.nameSecondary ? (
                        <span className="text-muted-foreground block text-[11px]">
                          {zh ? item.nameSecondary.zh : item.nameSecondary.en}
                        </span>
                      ) : null}
                      <span className="text-muted-foreground mt-1 block text-xs sm:text-sm">
                        {zh ? item.pitch.zh : item.pitch.en}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <SiteFooter
        tagline={t.footerTagline}
        columns={footerColumns}
        copyright={`© ${new Date().getFullYear()} ${site.name} · ${t.footerDomain}`}
      />
    </div>
  );
}
