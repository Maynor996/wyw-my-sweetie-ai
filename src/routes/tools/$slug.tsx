import { createFileRoute, notFound } from '@tanstack/react-router';

import { ToolPage } from '@/components/zombiehug/tool-page';
import { zhLang } from '@/components/zombiehug/copy';
import {
  siblingTools,
  TOOL_BY_SLUG,
} from '@/components/zombiehug/related-tools';
import { getLocale } from '@/paraglide/runtime.js';
import { buildSeoHead } from '@/lib/seo';

const ALLOWED = new Set(siblingTools('wyw-my-sweetie').map((t) => t.slug));

export const Route = createFileRoute('/tools/$slug')({
  loader: ({ params }) => {
    if (!ALLOWED.has(params.slug) || !TOOL_BY_SLUG[params.slug]) {
      throw notFound();
    }
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const tool = TOOL_BY_SLUG[loaderData.slug];
    if (!tool) return {};
    const lang = zhLang(getLocale());
    const title =
      lang === 'zh'
        ? `${tool.name} | 相关工具 | Shan Shen Bu AI Dance`
        : lang === 'es'
          ? `${tool.name} | Herramientas relacionadas | Shan Shen Bu AI Dance`
          : `${tool.name} | Related tools | Shan Shen Bu AI Dance`;
    const description =
      lang === 'zh' ? tool.description.zh : tool.description.en;
    return buildSeoHead({
      path: `/tools/${tool.slug}`,
      title,
      description,
      noindex: true, // sister-tool stubs — keep off sitemap / soft noindex
    });
  },
  component: ToolRoute,
});

function ToolRoute() {
  const { slug } = Route.useLoaderData();
  return <ToolPage siteId="wyw-my-sweetie" slug={slug} />;
}
