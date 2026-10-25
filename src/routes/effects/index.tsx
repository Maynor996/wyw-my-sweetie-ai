import { createFileRoute } from '@tanstack/react-router';

import { EffectsIndex } from '@/components/zombiehug/effects-index';
import { zhLang } from '@/components/zombiehug/copy';
import { getLocale } from '@/paraglide/runtime.js';
import { buildSeoHead } from '@/lib/seo';

export const Route = createFileRoute('/effects/')({
  head: () => {
    const lang = zhLang(getLocale());
    const title =
      lang === 'zh'
        ? '更多效果 | Shan Shen Bu AI Dance'
        : lang === 'es'
          ? 'Más efectos | Shan Shen Bu AI Dance'
          : 'More Effects | Shan Shen Bu AI Dance';
    const description =
      lang === 'zh'
        ? '浏览 Shan Shen Bu AI Dance 闪身步模板：真人与宠物庭院闪身步短视频。'
        : lang === 'es'
          ? 'Explora plantillas Shan Shen Bu AI Dance: flash-step humano y mascota.'
          : 'Browse Shan Shen Bu AI Dance flash-step templates — human and pet courtyard shorts.';
    return buildSeoHead({
      path: '/effects',
      title,
      description,
      keywords: 'shan shen bu effects, 闪身步, flash step, pet dance AI',
    });
  },
  component: EffectsIndex,
});
