'use client';

import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { buttonVariants } from '@/components/ui/button';

import { copy, zhLang } from './copy';
import { productFooterColumns } from './footer-links';
import {
  siblingTools,
  toolLocalPath,
  TOOL_BY_ID,
  ToolIcon,
  type RelatedToolId,
} from './related-tools';

export function ToolsIndex({ siteId }: { siteId: RelatedToolId }) {
  const lang = zhLang(getLocale());
  const zh = lang === 'zh';
  const t = copy(lang);
  const site = TOOL_BY_ID[siteId];
  const items = siblingTools(siteId);

  const navLinks = [
    { href: '/', label: zh ? '首页' : 'Home' },
    { href: '/#create', label: t.navCreate },
    { href: '/effects', label: t.navEffects },
    { href: '/tools', label: zh ? '相关工具' : 'Related tools' },
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
        <div className="mx-auto max-w-5xl text-center">
          <span className="border-border bg-card text-muted-foreground mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs tracking-wide uppercase shadow-sm">
            <Sparkles className="size-3.5 text-rose-500 dark:text-rose-400" />
            {site.name}
            {site.nameSecondary
              ? ` · ${zh ? site.nameSecondary.zh : site.nameSecondary.en}`
              : ''}
          </span>
          <h1 className="text-foreground font-serif text-4xl tracking-tight sm:text-5xl">
            {zh ? '相关工具' : 'Related tools'}
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base sm:text-lg">
            {zh
              ? '同系列 AI 短视频工具。先阅读本地介绍，再前往对应官网创作。'
              : 'Sibling AI short-video tools from the same studio. Read the intro here, then create on each official site.'}
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {items.map((tool) => (
            <article
              key={tool.id}
              className="border-border bg-card flex flex-col rounded-2xl border p-5 shadow-md shadow-black/5 transition hover:border-rose-400/50 hover:shadow-lg dark:bg-zinc-950 dark:hover:border-rose-400/40"
            >
              <div className="flex items-start gap-3">
                <ToolIcon tool={tool} size={48} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-foreground font-serif text-xl tracking-tight sm:text-2xl">
                    {tool.name}
                  </h2>
                  {tool.nameSecondary ? (
                    <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                      {zh ? tool.nameSecondary.zh : tool.nameSecondary.en}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
                {zh ? tool.pitch.zh : tool.pitch.en}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href={toolLocalPath(tool.slug)}
                  className={cn(
                    buttonVariants({ size: 'sm' }),
                    'inline-flex h-9 justify-center gap-1.5 rounded-full'
                  )}
                >
                  {zh ? '了解更多' : 'Learn more'}
                  <ArrowRight className="size-3.5" />
                </Link>
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                    'inline-flex h-9 justify-center gap-1.5 rounded-full'
                  )}
                >
                  {zh ? '访问官网' : 'Visit site'}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter
        tagline={t.footerTagline}
        columns={footerColumns}
        copyright={`© ${new Date().getFullYear()} ${site.name} · ${t.footerDomain}`}
      />
    </div>
  );
}
