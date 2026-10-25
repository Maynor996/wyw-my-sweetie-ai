'use client';

import { Link } from '@/core/i18n/navigation';

import { SisterPromptLinksSection } from '@/components/zombiehug/sister-prompt-links';
import { zhLang } from '@/components/zombiehug/lang';
import type { Lang } from '@/components/zombiehug/types';
import { getLocale } from '@/paraglide/runtime.js';
import { buildSeoHead } from '@/lib/seo';

/** Product guides for Shan Shen Bu (闪身步) flash-step AI dance. */
export type HihGuideSlug = 'how-to-make-shan-shen-bu-ai-video';

type GuideCopy = {
  h1: string;
  lead: string;
  sections: {
    h2: string;
    paras?: string[];
    list?: string[];
    steps?: [string, string][];
    faq?: [string, string][];
  }[];
  cta: string;
  relatedLabel: string;
  footer: string;
  back: string;
};

const HOW_TO: Record<Lang, GuideCopy> = {
  en: {
    back: '← Back to create',
    h1: 'How to Make a Shan Shen Bu (闪身步) Flash-Step AI Dance Video',
    lead:
      'On shanshenbuai.cc you upload one clear photo (person or pet) and generate a ~13–15s 9:16 Shan Shen Bu flash-step AI dance short with sound. Pay with a one-time credit pack from $8.88. No subscription required. Independent AI dance tool — not affiliated with any social app.',
    sections: [
      {
        h2: 'What is Shan Shen Bu?',
        paras: [
          '闪身步 (Shan Shen Bu / flash step) is a Huagudeng folk-dance move from Anhui that went viral as a teaching clip, then as AI remakes of people and pets dodging and stepping in rhythm.',
          'This site locks the trend choreography (spin → flash step → ball kick → shiver → head wobble) so you do not need CapCut templates or a long prompt.',
        ],
      },
      {
        h2: 'How the video is generated',
        paras: [
          'Pipeline: (1) upload one clear full-body likeness — human facing camera, or pet with the whole animal and a sharp face; (2) we place it in the Shan Shen Bu flash-step template; (3) download a vertical MP4 with sound.',
          'Typical length is about 13–15 seconds at 9:16. Human takes keep your place and clothes (~13s). Pet puts your animal into a courtyard flash-step take (~15s).',
        ],
      },
      {
        h2: 'Credit packs (pricing)',
        paras: [
          'One-time packs (no subscription): Single $8.88 = 500 credits = one 720p render. Popular $16.99 = 1500 credits. Creator $29.90 = 5000 credits. Choose 480p to spend 375 credits per render instead of 500. Failed renders return credits when generation is live.',
        ],
      },
      {
        h2: 'Photo tips',
        list: [
          'One clear likeness only — person (18+) or pet.',
          'Human: stand facing the camera; full body works best for the dodge and kick.',
          'Pet: whole animal in frame, face sharp; avoid extreme crops.',
          'Use a photo you have the right to use.',
          'Avoid dark group shots or heavy filters that hide the face.',
        ],
      },
      {
        h2: 'Quick steps',
        steps: [
          [
            'Pick Human or Pet',
            'Home for a person · Pet effect for cat/dog.',
          ],
          ['Upload one photo', 'Clear full-body human or whole-animal pet shot.'],
          [
            'Buy credits if needed',
            'Single $8.88 unlocks one 720p render (500 credits).',
          ],
          [
            'Generate and download',
            'Wait for the render; download the MP4. Keep an AI label when you post.',
          ],
        ],
      },
      {
        h2: 'Safety note',
        paras: [
          'The real flash step can strain knees — media reported injuries from copying without training. Prefer the AI version for fun posts; warm up if you try the moves yourself.',
        ],
      },
      {
        h2: 'FAQ',
        faq: [
          [
            'Do I need a prompt?',
            'No. The one-tap flash-step flow runs the trend moves for you.',
          ],
          [
            'How many photos?',
            'One. Single-photo create flow for Human or Pet.',
          ],
          [
            'How long is the video?',
            'About 13–15 seconds, vertical 9:16 MP4, with sound.',
          ],
          [
            'How much does it cost?',
            'Packs: Single $8.88 / Popular $16.99 / Creator $29.90. Each 720p uses 500 credits.',
          ],
        ],
      },
    ],
    cta: 'Create Shan Shen Bu flash-step video',
    relatedLabel: 'Related',
    footer:
      'Shan Shen Bu AI Dance — independent AI dance tool on shanshenbuai.cc. Adults 18+ for human photos. Always label AI-generated content.',
  },
  zh: {
    back: '← 返回创作',
    h1: '如何制作闪身步（Shan Shen Bu）AI 舞蹈短视频',
    lead:
      '在 shanshenbuai.cc 上传一张清晰照片（真人或宠物），生成约 13–15 秒竖屏 9:16 闪身步 AI 舞蹈短视频并带声音。一次购买积分包自 $8.88 起，无需订阅。独立 AI 舞蹈工具，与任何社交平台无关。',
    sections: [
      {
        h2: '什么是闪身步？',
        paras: [
          '闪身步来自安徽花鼓灯，教学视频走红后，全球用 AI 把人或宠物做成同款闪身、踢球、哆嗦毛短视频。',
          '本站锁定趋势编排（转镜 → 闪身步 → 踢球 → 哆嗦 → 摇头），无需找剪辑模板或写长提示词。',
        ],
      },
      {
        h2: '视频如何生成',
        paras: [
          '流程：（1）上传一张清晰全身形象 — 真人正面站立，或宠物全身、脸部清晰；（2）放入闪身步模板；（3）下载竖屏 MP4 成片。',
          '成片时长通常约 13–15 秒（9:16）。真人保留场景与服装（约 13 秒）；宠物放入庭院闪身步（约 15 秒）。',
        ],
      },
      {
        h2: '积分包与定价',
        paras: [
          '一次购买（无订阅）：单次 $8.88 = 500 积分 = 一条 720p；三件套 $16.99 = 1500 积分；创作者 $29.90 = 5000 积分。选 480p 则每条 375 积分。生成上线后失败会退还积分。',
        ],
      },
      {
        h2: '拍照建议',
        list: [
          '只需一个清晰形象 — 真人（18+）或宠物。',
          '真人：正面站立，全身更利于闪身与踢球。',
          '宠物：全身入镜、脸部清晰；避免过度裁切。',
          '请使用你有权使用的照片。',
          '避免昏暗合影或重度滤镜挡脸。',
        ],
      },
      {
        h2: '快速步骤',
        steps: [
          ['选择真人或宠物', '首页做人 · 宠物效果做猫狗。'],
          ['上传一张照片', '真人全身或宠物全身清晰。'],
          ['按需购买积分', '单次 $8.88 可解锁一条 720p（500 积分）。'],
          ['生成并下载', '等待成片；下载 MP4。发布时请标注 AI。'],
        ],
      },
      {
        h2: '安全提示',
        paras: [
          '真人闪身步可能伤膝。玩梗发帖优先用 AI 版；自己练请先热身。',
        ],
      },
      {
        h2: '常见问题',
        faq: [
          ['需要写提示词吗？', '不需要。一键闪身步流程已锁定动作。'],
          ['需要几张照片？', '一张。真人或宠物均为单图流程。'],
          ['视频多长？', '约 13–15 秒竖屏 9:16 MP4，带声音。'],
          [
            '多少钱？',
            '积分包：单次 $8.88 / 三件套 $16.99 / 创作者 $29.90。每条 720p 用 500 积分。',
          ],
        ],
      },
    ],
    cta: '创建闪身步 AI 舞蹈视频',
    relatedLabel: '相关',
    footer:
      'Shan Shen Bu AI Dance — shanshenbuai.cc 上的独立 AI 舞蹈工具。真人照片仅限 18+。请标注 AI 生成内容。',
  },
  es: {
    back: '← Volver a crear',
    h1: 'Cómo hacer un video de baile Shan Shen Bu (闪身步) con IA',
    lead:
      'En shanshenbuai.cc subes una foto clara (persona o mascota) y generas un corto de baile flash-step ~13–15s 9:16 con sonido. Packs de créditos desde $8.88, sin suscripción. Herramienta de baile IA independiente.',
    sections: [
      {
        h2: '¿Qué es Shan Shen Bu?',
        paras: [
          '闪身步 (flash step) es un paso de Huagudeng de Anhui que se viralizó; luego IA remakes de personas y mascotas haciendo el dodge rítmico.',
          'Este sitio fija la coreografía (giro → flash step → patada → temblor → cabeceo) sin plantillas largas ni prompts.',
        ],
      },
      {
        h2: 'Cómo se genera el video',
        paras: [
          'Flujo: (1) sube una foto cuerpo entero clara; (2) la plantilla Shan Shen Bu; (3) descarga el MP4 vertical con sonido.',
          'Duración típica ~13–15s a 9:16. Humano ~13s; mascota en patio ~15s.',
        ],
      },
      {
        h2: 'Packs y precios',
        paras: [
          'Pago único: Single $8.88 = 500 créditos = un render 720p. Popular $16.99 = 1500. Creator $29.90 = 5000. 480p usa 375 créditos. Los renders fallidos reembolsan créditos cuando la generación está activa.',
        ],
      },
      {
        h2: 'Consejos de foto',
        list: [
          'Una sola imagen clara — persona (18+) o mascota.',
          'Humano: de frente, cuerpo entero.',
          'Mascota: animal completo, cara nítida.',
          'Usa una foto que tengas derecho a usar.',
        ],
      },
      {
        h2: 'Pasos rápidos',
        steps: [
          ['Elige Humano o Mascota', 'Inicio para persona · efecto Pet para gato/perro.'],
          ['Sube una foto', 'Cuerpo entero o mascota completa.'],
          ['Compra créditos si hace falta', 'Single $8.88 = un render 720p (500 créditos).'],
          ['Genera y descarga', 'Espera el MP4. Etiqueta contenido IA al publicar.'],
        ],
      },
      {
        h2: 'FAQ',
        faq: [
          ['¿Necesito prompt?', 'No. El flujo flash-step está bloqueado.'],
          ['¿Cuántas fotos?', 'Una.'],
          ['¿Cuánto dura?', 'Unos 13–15s, 9:16, con sonido.'],
          [
            '¿Cuánto cuesta?',
            'Single $8.88 / Popular $16.99 / Creator $29.90. 720p = 500 créditos.',
          ],
        ],
      },
    ],
    cta: 'Crear video flash-step Shan Shen Bu',
    relatedLabel: 'Relacionado',
    footer:
      'Shan Shen Bu AI Dance — herramienta independiente en shanshenbuai.cc. Adultos 18+ para fotos humanas. Etiqueta contenido IA.',
  },
};

export const HIH_GUIDE_PATH: Record<HihGuideSlug, string> = {
  'how-to-make-shan-shen-bu-ai-video':
    '/guides/how-to-make-shan-shen-bu-ai-video',
};

const COPY_BY_SLUG: Record<HihGuideSlug, Record<Lang, GuideCopy>> = {
  'how-to-make-shan-shen-bu-ai-video': HOW_TO,
};

export const HIH_GUIDE_SLUGS = Object.keys(COPY_BY_SLUG) as HihGuideSlug[];

function relatedLinks(
  _slug: HihGuideSlug,
  lang: Lang
): { href: string; label: string }[] {
  const labels = {
    es: {
      effects: 'Efectos',
      pet: 'Efecto mascota',
      videos: 'Videos de muestra',
      tools: 'Herramientas relacionadas',
      privacy: 'Privacidad',
    },
    en: {
      effects: 'Effects',
      pet: 'Pet effect',
      videos: 'Sample videos',
      tools: 'Related tools',
      privacy: 'Privacy',
    },
    zh: {
      effects: '效果',
      pet: '宠物效果',
      videos: '样片',
      tools: '相关工具',
      privacy: '隐私',
    },
  }[lang];

  return [
    { href: '/effects', label: labels.effects },
    { href: '/effects/shan-shen-bu-pet', label: labels.pet },
    { href: '/videos', label: labels.videos },
    { href: '/tools', label: labels.tools },
    { href: '/privacy-policy', label: labels.privacy },
  ];
}

export function hihGuideHead(slug: HihGuideSlug) {
  const lang = zhLang(getLocale());
  const t = COPY_BY_SLUG[slug][lang] ?? COPY_BY_SLUG[slug].en;
  return buildSeoHead({
    path: HIH_GUIDE_PATH[slug],
    title: `${t.h1} | Shan Shen Bu AI Dance`,
    description: t.lead,
    ogType: 'article',
    keywords:
      'shan shen bu, 闪身步, flash step, AI dance, how to, shanshenbuai, photo to dance video',
  });
}

export function HihGuidePage({ slug }: { slug: HihGuideSlug }) {
  const lang = zhLang(getLocale());
  const t = COPY_BY_SLUG[slug][lang] ?? COPY_BY_SLUG[slug].en;
  const more = relatedLinks(slug, lang);

  return (
    <main className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm">
        <Link href="/#create">{t.back}</Link>
      </p>
      <h1>{t.h1}</h1>
      <p>{t.lead}</p>
      {t.sections.map((sec) => (
        <section key={sec.h2}>
          <h2>{sec.h2}</h2>
          {sec.paras?.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
          {sec.list ? (
            <ul>
              {sec.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {sec.steps ? (
            <ol>
              {sec.steps.map(([title, body]) => (
                <li key={title}>
                  <strong>{title}</strong> — {body}
                </li>
              ))}
            </ol>
          ) : null}
          {sec.faq?.map(([q, a]) => (
            <div key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </section>
      ))}
      <p>
        <Link href="/#create">{t.cta}</Link>
      </p>
      <h2>{t.relatedLabel}</h2>
      <ul>
        {more.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <SisterPromptLinksSection
        selfId="shan-shen-bu"
        variant="list"
        zh={lang === 'zh'}
      />
      <p className="text-sm opacity-80">{t.footer}</p>
    </main>
  );
}

/** @deprecated use HihGuidePage + hihGuideHead */
export function HihHowToGuidePage() {
  return <HihGuidePage slug="how-to-make-shan-shen-bu-ai-video" />;
}
export function hihHowToGuideHead() {
  return hihGuideHead('how-to-make-shan-shen-bu-ai-video');
}
