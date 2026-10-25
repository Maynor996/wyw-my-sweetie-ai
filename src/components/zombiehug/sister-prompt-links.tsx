/**
 * Reciprocal sister-site prompt-guide landings (友链).
 * Link INNER pages only — not competitor sites.
 * aizombie.app must never list bad-times / cheba-man (pass exclude on that site).
 */
export type SisterSiteId =
  | 'zombiehug'
  | 'hotel-lobby'
  | 'raindance'
  | 'chuttamalle'
  | 'burning-bridges'
  | 'alors-on-danse'
  | 'rumpelstiltskin'
  | 'jean-phil'
  | 'bad-times'
  | 'cheba-man'
  | 'venom-car'
  | 'unforgettable-car'
  | 'chatgpt-millionaire'
  | 'hug-in-heaven'
  | 'shan-shen-bu'
  | 'flying-roadster'
  | 'vs-runway';

export type SisterPromptLink = {
  id: SisterSiteId;
  label: string;
  labelZh: string;
  href: string;
};

/** Canonical prompt-guide / keyword landings across owned video sites. */
export const SISTER_PROMPT_LINKS: SisterPromptLink[] = [
  {
    id: 'zombiehug',
    label: 'AI Zombie Prompt Guide',
    labelZh: 'AI 僵尸提示词指南',
    href: 'https://aizombie.app/ai-zombie-prompt-guide',
  },
  {
    id: 'hotel-lobby',
    label: 'Hotel Lobby AI Prompt Guide',
    labelZh: '酒店大堂 AI 提示词指南',
    href: 'https://tryhotellobby.app/hotel-lobby-ai-prompt-guide',
  },
  {
    id: 'raindance',
    label: 'Raindance AI Prompt Guide',
    labelZh: 'Raindance AI 提示词指南',
    href: 'https://raindanceai.click/raindance-ai-prompt-guide',
  },
  {
    id: 'chuttamalle',
    label: 'Chuttamalle AI Prompt Guide',
    labelZh: 'Chuttamalle AI 提示词指南',
    href: 'https://trychuttamalle.app/chuttamalle-ai-prompt-guide',
  },
  {
    id: 'burning-bridges',
    label: 'Burning Bridges AI Prompt Guide',
    labelZh: 'Burning Bridges AI 提示词指南',
    href: 'https://burningbridgesvideoai.com/burning-bridges-ai-prompt',
  },
  {
    id: 'alors-on-danse',
    label: 'Alors on Danse AI Prompt Guide',
    labelZh: 'Alors on Danse AI 提示词指南',
    href: 'https://tryalorsondanse.video/alors-on-danse-ai-prompt-guide',
  },
  {
    id: 'rumpelstiltskin',
    label: 'Rumpelstiltskin Dance AI Prompt Guide',
    labelZh: 'Rumpelstiltskin 踮脚舞提示词指南',
    href: 'https://rumpelstiltskindance.video/rumpelstiltskin-ai-prompt-guide',
  },
  {
    id: 'jean-phil',
    label: 'Jean Phil AI Prompt Guide',
    labelZh: 'Jean Phil AI 提示词指南',
    href: 'https://jeanphilai.cc/guides/jean-phil-ai-prompt-guide',
  },
  {
    id: 'bad-times',
    label: 'Bad Times AI Prompt Guide',
    labelZh: 'Bad Times AI 提示词指南',
    href: 'https://badtimesai.cc/bad-times-ai-prompt-guide',
  },
  {
    id: 'cheba-man',
    label: 'Cheba Man AI Prompt Guide',
    labelZh: 'Cheba Man AI 提示词指南',
    href: 'https://chebamanai.cc/cheba-man-ai-prompt-guide',
  },
  {
    id: 'venom-car',
    label: 'Venom Car AI Prompt Guide',
    labelZh: 'Venom Car AI 提示词指南',
    href: 'https://venomcarai.cc/guides/how-to-make-venom-car-ai-video',
  },
  {
    id: 'unforgettable-car',
    label: 'Unforgettable Car AI Guide',
    labelZh: 'Unforgettable Car AI 教程',
    href: 'https://unforgettablecarai.cc/guides/how-to-make-unforgettable-car-ai-video',
  },

  {
    id: 'chatgpt-millionaire',
    label: 'ChatGPT Millionaire AI Guide',
    labelZh: 'ChatGPT Millionaire AI 教程',
    href: 'https://chatgptmillionaire.cc/guides/how-to-make-chatgpt-millionaire-ai-video',
  },
  {
    id: 'hug-in-heaven',
    label: 'Hug In Heaven AI Guide',
    labelZh: 'Hug In Heaven AI 教程',
    href: 'https://huginheaven.cc/guides/how-to-make-hug-in-heaven-ai-video',
  },
  {
    id: 'shan-shen-bu',
    label: 'Shan Shen Bu AI Dance Guide',
    labelZh: '闪身步 AI 舞蹈教程',
    href: 'https://shanshenbuai.cc/guides/how-to-make-shan-shen-bu-ai-video',
  },
  {
    id: 'flying-roadster',
    label: 'Flying Roadster AI Guide',
    labelZh: 'Flying Roadster AI 教程',
    href: 'https://flyingcarai.cc/guides/how-to-make-flying-roadster-ai-video',
  },

  {
    id: 'vs-runway',
    label: 'Victoria Secret AI Dark Angel Runway',
    labelZh: 'Victoria Secret AI 暗黑天使走秀',
    href: 'https://victoriasecretai.cc/effects/dark-angel-runway',
  },

];

/** Never introduce these on aizombie.app landings. */
export const AIZOMBIE_EXCLUDED_SISTERS: SisterSiteId[] = [
  'chatgpt-millionaire',
  'hug-in-heaven',
  'shan-shen-bu',
  'flying-roadster',
  'bad-times',
  'cheba-man',
  'unforgettable-car',
];

export function sisterPromptLinksFor(
  selfId: SisterSiteId,
  opts?: { exclude?: SisterSiteId[] }
): SisterPromptLink[] {
  const ban = new Set<SisterSiteId>([selfId, ...(opts?.exclude ?? [])]);
  return SISTER_PROMPT_LINKS.filter((s) => !ban.has(s.id));
}

type SisterPromptLinksSectionProps = {
  selfId: SisterSiteId;
  exclude?: SisterSiteId[];
  /** When true, use Chinese labels */
  zh?: boolean;
  /** Compact list for prose/markdown-style pages */
  variant?: 'cards' | 'list';
};

/**
 * Explore / related sister prompt landings — owned sites only.
 * Renders external <a> tags (new tab) so it works outside client Link wrappers.
 */
export function SisterPromptLinksSection({
  selfId,
  exclude,
  zh = false,
  variant = 'cards',
}: SisterPromptLinksSectionProps) {
  const links = sisterPromptLinksFor(selfId, { exclude });
  if (links.length === 0) return null;

  const title = zh ? '同系列工具' : 'More tools from us';
  const subtitle = zh
    ? '友链 · 指向各站提示词 / SEO 内页（非目录站）'
    : 'Sister prompt guides on our other meme video tools';

  if (variant === 'list') {
    return (
      <section className="mt-10" aria-label={title}>
        <h2>{title}</h2>
        <p className="text-sm opacity-80">{subtitle}</p>
        <ul>
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {zh ? link.labelZh : link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="mt-12" aria-label={title}>
      <h2 className="font-serif text-2xl tracking-tight">{title}</h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {subtitle}
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border hover:border-primary/40 bg-card flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition"
            >
              <span>{zh ? link.labelZh : link.label}</span>
              <span className="text-muted-foreground text-xs" aria-hidden>
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
