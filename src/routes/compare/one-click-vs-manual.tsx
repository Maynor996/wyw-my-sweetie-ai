import { createFileRoute } from '@tanstack/react-router';

import { Link } from '@/core/i18n/navigation';

import { getLocale } from '@/paraglide/runtime.js';
import { zhLang } from '@/components/zombiehug/lang';
import { buildSeoHead } from '@/lib/seo';

const COPY = {
  en: {
    title: 'One-Click Template vs Manual Edit & Prompt Tools — From $8.88 · 2026',
    description:
      'Compare Shan Shen Bu AI Dance workflows on shanshenbuai.cc: one-click locked templates vs manual timeline editing, freeform prompt tools, and subscription plans. Pay-per-video from $8.88 (2026). Own-product framing only.',
    h1: 'One-click template vs manual edit, prompt tools & subscriptions',
    lead:
      'On shanshenbuai.cc you pick a locked effect (flash-step, vault world-swap, or skirt-ad text), upload photos, and get a short MP4. From $8.88 per 720p video — pay once, no subscription. This page compares our own workflows only — not other product domains.',
    back: '← Back to create',
    tableH: 'Quick comparison (own-product framing)',
    factors: [
      ['Factor', 'One-click template (this site)', 'Manual timeline edit', 'Prompt-crafting tools', 'Subscription video apps'],
      [
        'Input',
        '1–3 photos (+ ad text for skirt-ad)',
        'Clips, cuts, overlays you assemble',
        'Long prompts + optional refs',
        'Account + credits or monthly plan',
      ],
      [
        'Output',
        'Locked trend short (~6–15s)',
        'Whatever you build',
        'Variable freeform clip',
        'Whatever the plan unlocks',
      ],
      [
        'Price model',
        'Pay-per-video from $8.88',
        'Your time (+ free/paid software)',
        'Often credits or trials',
        'Monthly fee + overage',
      ],
      [
        'Skill barrier',
        'No prompt, no timeline',
        'Editing skill required',
        'Prompt craft required',
        'App setup + plan choice',
      ],
      [
        'Best for',
        'Repeatable flash-step / vault / skirt-ad',
        'Full creative control',
        'Inventing new looks',
        'Heavy daily rendering',
      ],
    ],
    whenH: 'When to pick one-click on this site',
    when: [
      'You want Shan Shen Bu flash-step, vault costume swap, or skirt-ad text without writing a prompt.',
      'You have 1–3 clear photos and need a vertical (or 16:9 vault) MP4 in minutes.',
      'You prefer pay-per-video from $8.88 over a monthly subscription.',
    ],
    whenOtherH: 'When another approach may fit better',
    whenOther: [
      'Manual timeline edit — you need multi-clip cuts, custom text overlays, or brand packages beyond a locked template.',
      'Prompt-crafting tools — you want to invent new scenes every time, not a fixed choreography or skirt-ad layout.',
      'Subscription plans — you render dozens of videos every week and a flat monthly fee beats packs.',
    ],
    factsH: 'Product facts (shanshenbuai.cc)',
    facts: [
      'Flash-step: 1 photo → ~13–15s 9:16 dance short with sound',
      'Vault world-swap: 3 images → ~7s seamless costume swap',
      'Skirt-ad text: 1 photo + copy → ~6.6s hanfu skirt-disc ad',
      'Pricing: from $8.88 (500 credits / 720p) — no subscription required',
      'Independent AI dance tool (2026) — paid renders only; never pretend free',
    ],
    linksLabel: 'Create',
    footer:
      'Shan Shen Bu AI Dance — independent tool on shanshenbuai.cc. Compare page uses own-product framing only.',
  },
  zh: {
    title: '一键模板 vs 手动剪辑与提示词工具 — From $8.88 · 2026',
    description:
      '对比 shanshenbuai.cc 本站工作流：一键锁定模板 vs 手动时间线剪辑、自由提示词工具、订阅制。按次付费起 $8.88（2026）。仅本产品表述，不含竞品域名。',
    h1: '一键模板 vs 手动剪辑、提示词工具与订阅制',
    lead:
      '在 shanshenbuai.cc 选择锁定效果（闪身步、翻越换装或甩裙广告字），上传照片即可得到短视频 MP4。720p 起价 $8.88 — 按次付费，无订阅。本页只对比本站工作流，不出现其他产品域名。',
    back: '← 返回创作',
    tableH: '快速对比（仅本产品表述）',
    factors: [
      ['维度', '一键模板（本站）', '手动时间线剪辑', '提示词工具', '订阅制视频应用'],
      [
        '输入',
        '1–3 张照片（甩裙需广告文案）',
        '自行组装的素材与轨道',
        '长提示词 + 可选参考图',
        '账号 + 积分或月费',
      ],
      [
        '输出',
        '锁定趋势短片（约 6–15 秒）',
        '取决于你怎么剪',
        '开放式结果',
        '取决于套餐额度',
      ],
      [
        '计价',
        '按次付费起 $8.88',
        '时间成本（+免费/付费软件）',
        '常见为积分或试用',
        '月费 + 超额',
      ],
      [
        '门槛',
        '无需提示词、无需时间线',
        '需要剪辑技能',
        '需要提示词技巧',
        '需要装应用并选套餐',
      ],
      [
        '最适合',
        '重复做闪身步 / 翻越 / 甩裙广告字',
        '完全自定义创作',
        '每次发明新画面',
        '每周大量出片',
      ],
    ],
    whenH: '什么时候选本站一键模板',
    when: [
      '想做闪身步、翻越换装或甩裙广告字，不想写提示词。',
      '已有 1–3 张清晰照片，几分钟内要竖屏（或翻越 16:9）MP4。',
      '更想按次付费起 $8.88，而不是月费订阅。',
    ],
    whenOtherH: '什么时候其他方式可能更合适',
    whenOther: [
      '手动时间线剪辑 — 需要多轨剪辑、自定义字幕或超出锁定模板的包装。',
      '提示词工具 — 每次都要发明新场景，而不是固定舞步或甩裙版式。',
      '订阅制 — 每周大量出片，月费比积分包更划算。',
    ],
    factsH: '产品事实（shanshenbuai.cc）',
    facts: [
      '闪身步：1 张照片 → 约 13–15 秒 9:16 舞蹈短视频（含声音）',
      '翻越换装：3 张图 → 约 7 秒无缝换装世界切换',
      '甩裙广告字：1 张照片 + 文案 → 约 6.6 秒汉服裙摆广告',
      '价格：起价 $8.88（500 积分 / 720p）— 无需订阅',
      '独立 AI 舞蹈工具（2026）— 仅付费渲染；从不假装免费',
    ],
    linksLabel: '开始创作',
    footer:
      'Shan Shen Bu AI Dance — 独立工具 shanshenbuai.cc。对比页仅使用本产品表述。',
  },
  es: {
    title: 'Plantilla one-click vs edición manual y prompts — From $8.88 · 2026',
    description:
      'Compara flujos en shanshenbuai.cc: plantillas bloqueadas vs edición manual, prompts libres y suscripciones. Pago por video desde $8.88 (2026). Solo producto propio.',
    h1: 'Plantilla one-click vs edición manual, prompts y suscripciones',
    lead:
      'En shanshenbuai.cc eliges un efecto bloqueado, subes fotos y obtienes un MP4 corto. Desde $8.88 por 720p — pago único, sin suscripción. Esta página solo compara nuestros flujos.',
    back: '← Volver a crear',
    tableH: 'Comparación rápida (solo este producto)',
    factors: [
      ['Factor', 'Plantilla one-click (este sitio)', 'Edición manual', 'Herramientas de prompt', 'Apps con suscripción'],
      ['Entrada', '1–3 fotos (+ texto en falda)', 'Clips que armas tú', 'Prompts largos + refs', 'Cuenta + plan'],
      ['Salida', 'Corto de tendencia (~6–15s)', 'Lo que armes', 'Clip variable', 'Según el plan'],
      ['Precio', 'Por video desde $8.88', 'Tu tiempo', 'Créditos / pruebas', 'Cuota mensual'],
      ['Barrera', 'Sin prompt ni timeline', 'Skill de edición', 'Skill de prompt', 'App + plan'],
      ['Ideal para', 'Flash-step / vault / skirt-ad', 'Control total', 'Inventar looks', 'Muchos renders'],
    ],
    whenH: 'Cuándo elegir one-click aquí',
    when: [
      'Quieres flash-step, vault o texto en falda sin escribir prompt.',
      'Tienes 1–3 fotos claras y necesitas un MP4 en minutos.',
      'Prefieres pagar por video desde $8.88 antes que una suscripción.',
    ],
    whenOtherH: 'Cuándo otro enfoque puede convenir',
    whenOther: [
      'Edición manual — necesitas multi-clip y control total.',
      'Prompts — quieres inventar escenas nuevas cada vez.',
      'Suscripción — renders semanales intensos.',
    ],
    factsH: 'Hechos del producto (shanshenbuai.cc)',
    facts: [
      'Flash-step: 1 foto → ~13–15s 9:16',
      'Vault: 3 imágenes → ~7s',
      'Skirt-ad: 1 foto + texto → ~6.6s',
      'Desde $8.88 / 720p — sin suscripción',
      'Herramienta independiente (2026) — de pago, nunca fingir gratis',
    ],
    linksLabel: 'Crear',
    footer:
      'Shan Shen Bu AI Dance — herramienta independiente en shanshenbuai.cc.',
  },
} as const;

export const Route = createFileRoute('/compare/one-click-vs-manual')({
  head: () => {
    const lang = zhLang(getLocale());
    const c = COPY[lang] || COPY.en;
    return buildSeoHead({
      path: '/compare/one-click-vs-manual',
      title: c.title,
      description: c.description,
      ogType: 'article',
      keywords:
        'one-click AI dance template, pay per video, Shan Shen Bu, flash step, skirt-ad text, 2026',
    });
  },
  component: ComparePage,
});

function ComparePage() {
  const lang = zhLang(getLocale());
  const c = COPY[lang] || COPY.en;
  const headers = c.factors[0];
  const rows = c.factors.slice(1);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <p className="text-sm not-prose">
        <Link to="/">{c.back}</Link>
        {' · '}
        <Link to="/effects">Effects</Link>
        {' · '}
        <Link to="/guides">Guides</Link>
        {' · '}
        <a href="/#pricing">Pricing</a>
      </p>
      <h1>{c.h1}</h1>
      <p>{c.lead}</p>

      <h2>{c.tableH}</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              {headers.map((h) => (
                <th key={h} className="py-2 pr-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b align-top">
                {row.map((cell, i) => (
                  <td
                    key={`${row[0]}-${i}`}
                    className={`py-2 pr-3 ${i === 0 ? 'font-medium' : ''}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{c.whenH}</h2>
      <ul>
        {c.when.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{c.whenOtherH}</h2>
      <ul>
        {c.whenOther.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{c.factsH}</h2>
      <ul>
        {c.facts.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="not-prose flex flex-wrap gap-3 text-sm">
        <Link to="/">{c.linksLabel}</Link>
        <Link to="/effects/skirt-ad-text">Skirt-Ad Text</Link>
        <Link to="/effects/vault-costume-world-swap">Vault World-Swap</Link>
        <Link to="/guides/how-to-make-shan-shen-bu-ai-video">How-to</Link>
        <Link to="/videos">Videos</Link>
        <Link to="/blog">Blog</Link>
      </p>
      <p className="text-sm opacity-80">{c.footer}</p>
    </main>
  );
}
