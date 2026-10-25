import { createFileRoute, notFound } from '@tanstack/react-router';

import {
  HihGuidePage,
  hihGuideHead,
  type HihGuideSlug,
} from '@/components/zombiehug/hih-guide-pages';

const GUIDE_SLUGS = new Set<string>(['how-to-make-shan-shen-bu-ai-video']);

export const Route = createFileRoute('/guides/$slug')({
  loader: ({ params }) => {
    if (!GUIDE_SLUGS.has(params.slug)) throw notFound();
    return { slug: params.slug as HihGuideSlug };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return hihGuideHead(loaderData.slug);
  },
  component: GuideRoute,
});

function GuideRoute() {
  const { slug } = Route.useLoaderData();
  return <HihGuidePage slug={slug} />;
}
