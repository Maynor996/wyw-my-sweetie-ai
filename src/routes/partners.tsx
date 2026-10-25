import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { DIRECTORY_BADGES } from '@/components/site-footer';
import { getLocale } from '@/paraglide/runtime.js';
import { buildSeoHead } from '@/lib/seo';

function partnersCopy(locale: string) {
  const zh = locale === 'zh' || locale.startsWith('zh');
  if (zh) {
    return {
      title: '合作伙伴',
      description: `${envConfigs.app_name} 的目录与合作伙伴展示页。`,
      back: '返回首页',
      intro:
        '我们出现在这些工具目录与启动平台中。以下徽章为对外合作/目录回链，集中展示在本页，而不铺满首页页脚。',
      aria: '合作伙伴与目录徽章',
    };
  }
  return {
    title: 'Partners',
    description: `Directory and partner badges for ${envConfigs.app_name}.`,
    back: 'Back to home',
    intro:
      'We are listed on these directories and launch platforms. Directory and partner badges live on this page instead of carpeting the homepage footer.',
    aria: 'Partner and directory badges',
  };
}

export const Route = createFileRoute('/partners')({
  head: () => {
    const locale = getLocale();
    const copy = partnersCopy(locale);
    return buildSeoHead({
      path: '/partners',
      title: `${copy.title} | ${envConfigs.app_name}`,
      description: copy.description,
    });
  },
  component: PartnersPage,
});

function PartnersPage() {
  const locale = getLocale();
  const copy = partnersCopy(locale);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-3xl px-6 pt-8 md:px-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          {copy.back}
        </Link>
      </div>
      <article className="mx-auto max-w-3xl px-6 pt-6 pb-16 md:px-8 md:pt-8">
        <header className="border-border mb-8 border-b pb-5">
          <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
            {copy.title}
          </h1>
          <p className="text-muted-foreground mt-3 text-[15px] leading-7">
            {copy.intro}
          </p>
        </header>
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-4"
          aria-label={copy.aria}
        >
          {DIRECTORY_BADGES.map((badge) => (
            <a
              key={badge.href}
              href={badge.href}
              target="_blank"
              rel="dofollow noopener"
              className="inline-flex opacity-90 transition-opacity hover:opacity-100"
            >
              <img
                src={badge.src}
                alt={badge.alt}
                width={badge.width}
                height={badge.height}
                loading="lazy"
                decoding="async"
                className={
                  'className' in badge && badge.className
                    ? String(badge.className)
                    : 'h-8 w-auto max-h-10 object-contain sm:h-9'
                }
              />
            </a>
          ))}
        </div>
      </article>
    </div>
  );
}
