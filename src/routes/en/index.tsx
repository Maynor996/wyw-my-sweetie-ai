import { createFileRoute } from '@tanstack/react-router';

import { ZombieHugHome } from '@/components/zombiehug-home';
import { copy } from '@/components/zombiehug/copy';
import { buildSeoHead } from '@/lib/seo';

/** Physical /en/ route (Paraglide usually rewrites /en → /). Keep SEO consistent. */
export const Route = createFileRoute('/en/')({
  head: () => {
    const t = copy('en');
    return buildSeoHead({
      path: '/',
      title: t.metaTitle,
      description: t.metaDescription,
    });
  },
  component: ZombieHugHome,
});
