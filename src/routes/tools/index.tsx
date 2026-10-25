import { createFileRoute } from '@tanstack/react-router';

import { ToolsIndex } from '@/components/zombiehug/tools-index';
import { zhLang } from '@/components/zombiehug/copy';
import { getLocale } from '@/paraglide/runtime.js';
import { buildSeoHead } from '@/lib/seo';

export const Route = createFileRoute('/tools/')({
  head: () => {
    const lang = zhLang(getLocale());
    const title =
      lang === 'zh'
        ? '相关工具 | Shan Shen Bu AI Dance'
        : lang === 'es'
          ? 'Herramientas relacionadas | Shan Shen Bu AI Dance'
          : 'Related tools | Shan Shen Bu AI Dance';
    const description =
      lang === 'zh'
        ? '浏览与 Shan Shen Bu AI Dance 同系列的 AI 短视频工具介绍，再前往对应官网创作。'
        : lang === 'es'
          ? 'Explora herramientas hermanas de video corto con IA relacionadas con Shan Shen Bu AI Dance y crea en cada sitio oficial.'
          : 'Browse sibling AI short-video tools related to Shan Shen Bu AI Dance, then create on each official site.';
    return buildSeoHead({ path: '/tools', title, description });
  },
  component: () => <ToolsIndex siteId="wyw-my-sweetie" />,
});
