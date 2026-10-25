import { createFileRoute } from '@tanstack/react-router';

import { Link } from '@/core/i18n/navigation';
import { zhLang } from '@/components/zombiehug/lang';
import { getLocale } from '@/paraglide/runtime.js';
import { buildSeoHead } from '@/lib/seo';
import { HIH_GUIDE_PATH } from '@/components/zombiehug/hih-guide-pages';

const LINKS = {
  es: [
    {
      href: HIH_GUIDE_PATH['how-to-make-shan-shen-bu-ai-video'],
      label: 'Cómo hacer un video de baile Shan Shen Bu (闪身步) con IA',
    },
    {
      href: '/effects/shan-shen-bu-pet',
      label: 'Efecto mascota — flash-step en el patio',
    },
    { href: '/videos', label: 'Videos de muestra' },
    { href: '/tools', label: 'Herramientas relacionadas' },
  ],
  en: [
    {
      href: HIH_GUIDE_PATH['how-to-make-shan-shen-bu-ai-video'],
      label: 'How to make a Shan Shen Bu (闪身步) flash-step AI dance video',
    },
    {
      href: '/effects/shan-shen-bu-pet',
      label: 'Pet effect — courtyard flash-step',
    },
    { href: '/videos', label: 'Sample videos' },
    { href: '/tools', label: 'Related tools' },
  ],
  zh: [
    {
      href: HIH_GUIDE_PATH['how-to-make-shan-shen-bu-ai-video'],
      label: '如何制作闪身步（Shan Shen Bu）AI 舞蹈短视频',
    },
    {
      href: '/effects/shan-shen-bu-pet',
      label: '宠物效果 — 庭院闪身步',
    },
    { href: '/videos', label: '样片' },
    { href: '/tools', label: '相关工具' },
  ],
} as const;

export const Route = createFileRoute('/guides/')({
  head: () => {
    const lang = zhLang(getLocale());
    const title =
      lang === 'zh'
        ? '教程 | Shan Shen Bu AI Dance'
        : lang === 'es'
          ? 'Guías | Shan Shen Bu AI Dance'
          : 'Guides | Shan Shen Bu AI Dance';
    const description =
      lang === 'zh'
        ? 'Shan Shen Bu AI Dance 教程：一张照片制作闪身步 AI 舞蹈短视频。'
        : lang === 'es'
          ? 'Guías Shan Shen Bu AI Dance: cómo hacer el video flash-step con una foto.'
          : 'Shan Shen Bu AI Dance guides: how to make a flash-step AI dance short from one photo.';
    return buildSeoHead({
      path: '/guides',
      title,
      description,
      keywords: 'shan shen bu, 闪身步, flash step, AI dance guide, tutorial',
    });
  },
  component: GuidesIndex,
});

function GuidesIndex() {
  const lang = zhLang(getLocale());
  const items = LINKS[lang] ?? LINKS.en;
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-3xl tracking-tight">
        {lang === 'zh' ? '教程' : lang === 'es' ? 'Guías' : 'Guides'}
      </h1>
      <ul className="mt-6 list-disc space-y-3 pl-5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-rose-600 underline-offset-2 hover:underline dark:text-rose-400"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
