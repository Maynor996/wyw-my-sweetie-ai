import { createFileRoute, notFound } from '@tanstack/react-router';

import { EffectPage } from '@/components/zombiehug/effect-page';
import {
  getEffectCopy,
  hasEffectCopy,
} from '@/components/zombiehug/effect-copies';
import { EFFECT_BY_SLUG, samplePaths } from '@/components/zombiehug/effects';
import { zhLang } from '@/components/zombiehug/lang';
import { getLocale } from '@/paraglide/runtime.js';
import { absUrl, buildSeoHead, ldJson } from '@/lib/seo';

const PATH_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.values(EFFECT_BY_SLUG)
    .filter((e) => !e.home && e.path)
    .map((e) => [e.path, e.slug])
);

export const Route = createFileRoute('/effects/$slug')({
  loader: ({ params }) => {
    const slug = PATH_TO_SLUG[params.slug];
    if (!slug || !hasEffectCopy(slug)) {
      throw notFound();
    }
    return { slug };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { slug } = loaderData;
    const t = getEffectCopy(slug, zhLang(getLocale()));
    const meta = EFFECT_BY_SLUG[slug];
    const media = samplePaths(meta.mediaSlug);
    const path = `/effects/${meta.path}`;
    const ogImage = absUrl(media.poster);

    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: t.metaTitle,
          description: t.metaDescription,
          url: absUrl(path),
        },
        {
          '@type': 'SoftwareApplication',
          name: t.effectBadge || t.metaTitle,
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          url: absUrl(path),
          description: t.metaDescription,
          offers: {
            '@type': 'Offer',
            price: '8.88',
            priceCurrency: 'USD',
            category: 'one-time',
          },
        },
      ],
    };

    if (t.faqs?.length) {
      (jsonLd['@graph'] as unknown[]).push({
        '@type': 'FAQPage',
        mainEntity: t.faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        })),
      });
    }

    return buildSeoHead({
      path,
      title: t.metaTitle,
      description: t.metaDescription,
      ogImage,
      extraMeta: [ldJson(jsonLd)],
    });
  },
  component: EffectRoute,
});

function EffectRoute() {
  const { slug } = Route.useLoaderData();
  return <EffectPage slug={slug} />;
}
