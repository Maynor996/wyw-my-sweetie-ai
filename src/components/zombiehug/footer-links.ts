import type { FooterColumn } from '@/components/site-footer';
import type { Lang } from './types';

const HOW_TO_PATH = '/guides/how-to-make-shan-shen-bu-ai-video';

/** Shared product + legal footer columns (Guides, Videos, How-to, Effects, Blog, Compare). */
export function productFooterColumns(
  lang: Lang,
  labels: {
    footerProduct: string;
    footerLegal: string;
    navCreate: string;
    navEffects: string;
  },
  opts?: { createHref?: string; pricingHref?: string; faqHref?: string }
): FooterColumn[] {
  const createHref = opts?.createHref ?? '/#create';
  const productLinks = [
    { label: labels.navCreate, href: createHref },
    { label: labels.navEffects, href: '/effects' },
    {
      label: lang === 'zh' ? '教程' : lang === 'es' ? 'Guías' : 'Guides',
      href: '/guides',
    },
    {
      label: lang === 'zh' ? '样片' : lang === 'es' ? 'Videos' : 'Videos',
      href: '/videos',
    },
    {
      label: lang === 'zh' ? '怎么做' : lang === 'es' ? 'Cómo hacerlo' : 'How-to',
      href: HOW_TO_PATH,
    },
    {
      label: lang === 'zh' ? '博客' : 'Blog',
      href: '/blog',
    },
    {
      label:
        lang === 'zh'
          ? '一键模板 vs 手动'
          : lang === 'es'
            ? 'Plantilla vs manual'
            : 'One-click vs manual',
      href: '/compare/one-click-vs-manual',
    },
    {
      label:
        lang === 'zh'
          ? '相关工具'
          : lang === 'es'
            ? 'Herramientas'
            : 'Related tools',
      href: '/tools',
    },
  ];
  if (opts?.pricingHref) {
    productLinks.push({
      label: lang === 'zh' ? '价格' : lang === 'es' ? 'Precios' : 'Pricing',
      href: opts.pricingHref,
    });
  }
  if (opts?.faqHref) {
    productLinks.push({
      label: lang === 'zh' ? '问答' : 'FAQ',
      href: opts.faqHref,
    });
  }
  return [
    { title: labels.footerProduct, links: productLinks },
    {
      title: labels.footerLegal,
      links: [
        {
          label:
            lang === 'zh'
              ? '隐私政策'
              : lang === 'es'
                ? 'Política de privacidad'
                : 'Privacy Policy',
          href: '/privacy-policy',
        },
        {
          label:
            lang === 'zh'
              ? '服务条款'
              : lang === 'es'
                ? 'Términos del servicio'
                : 'Terms of Service',
          href: '/terms-of-service',
        },
        {
          label:
            lang === 'zh'
              ? '退款政策'
              : lang === 'es'
                ? 'Política de reembolso'
                : 'Refund Policy',
          href: '/refund-policy',
        },
      ],
    },
  ];
}
