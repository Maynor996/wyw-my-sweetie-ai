import { createFileRoute } from '@tanstack/react-router';

import { getLocale } from '@/paraglide/runtime.js';
import { ZombieHugHome } from '@/components/zombiehug-home';
import { copy, zhLang } from '@/components/zombiehug/copy';
import { absUrl, buildSeoHead, ldJson, localizedAbsoluteUrl } from '@/lib/seo';

export const Route = createFileRoute('/')({
  head: () => {
    const t = copy(zhLang(getLocale()));
    const title = t.metaTitle;
    const description = t.metaDescription;
    const url = localizedAbsoluteUrl('/');
    const ogImage = absUrl('/samples/wyw-my-sweetie/poster.jpg');
    const videoUrl = absUrl('/samples/wyw-my-sweetie/sample.mp4');
    const brandName = 'wywmysweetie AI';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: brandName,
          url,
          description,
          inLanguage: ['es', 'en', 'zh'],
        },
        {
          '@type': 'SoftwareApplication',
          name: brandName,
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          url,
          description,
          offers: {
            '@type': 'Offer',
            price: '8.88',
            priceCurrency: 'USD',
            category: 'one-time',
          },
        },
        {
          '@type': 'VideoObject',
          name: 'wywmysweetie AI — demo',
          description,
          thumbnailUrl: ogImage,
          contentUrl: videoUrl,
          uploadDate: '2026-10-25T00:00:00+08:00',
          duration: 'PT13S',
        },
        {
          '@type': 'FAQPage',
          mainEntity: t.faqs.map(([question, answer]) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: answer,
            },
          })),
        },
      ],
    };

    return buildSeoHead({
      path: '/',
      title,
      description,
      ogImage,
      keywords: "wywmysweetie, WywMySweetie, wywmysweetie.run, wyw my sweetie dance, come back and back, my sweetie trend, jersey club dance, AI dance, photo to video, Seedance, from $8.88",
      extraMeta: [ldJson(jsonLd)],
    });
  },
  component: ZombieHugHome,
});
