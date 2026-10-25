'use client';

import { ArrowRight, ExternalLink } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type RelatedToolId =
  | 'lobbyduo'
  | 'raindance'
  | 'chuttamalle'
  | 'burning-bridges'
  | 'alorsondanse'
  | 'bad-times'
  | 'cheba-man'
  | 'rumpelstiltskin-dance'
  | 'jean-phil'
  | 'venom-car'
  | 'unforgettable-car'
  | 'chatgpt-millionaire'
  | 'hug-in-heaven'
  | 'shan-shen-bu'
  | 'chat-gtt'
  | 'flying-roadster'
  | 'bby-wow-guy'
  | 'devil-wears-prada'
  | 'kiss-cam'
  | 'remix-meme'
  | 'cat-in-the-hat'
  | 'vs-runway'
  | 'corpse-bride'
  | 'white-chicks'
  | 'wyw-my-sweetie'
  | 'melodygift'
;

export type RelatedTool = {
  id: RelatedToolId;
  /** Kebab slug used in /tools/<slug> across sibling video-template sites */
  slug: string;
  name: string;
  /** Optional secondary brand line (e.g. AI Zombie) */
  nameSecondary?: { en: string; zh: string };
  href: string;
  /** Optional create URL (external or local) */
  createPath?: string;
  /** Local favicon/logo under /related-tools — 32–48px display */
  icon: string;
  pitch: { en: string; zh: string };
  description: { en: string; zh: string };
  features: { en: string[]; zh: string[] };
};

export const TOOLS: RelatedTool[] = [
  {
    id: 'lobbyduo',
    slug: 'lobbyduo',
    name: 'LobbyDuo',
    nameSecondary: { en: 'Hotel Lobby AI', zh: '酒店大堂双人棚拍' },
    createPath: 'https://tryhotellobby.app',
    href: 'https://tryhotellobby.app',
    icon: '/related-tools/lobbyduo.svg',
    pitch: {
      en: 'Two photos → ~15s orange booth duo short',
      zh: '两张照片生成约 15 秒橙色双人棚拍短片',
    },
    description: {
      en: 'LobbyDuo places two people in a warm orange hotel-lobby booth look — ~15s duo short on tryhotellobby.app. From $8.88. Adults 18+.',
      zh: 'LobbyDuo 用两张照片生成温暖橙色酒店大堂双人棚拍短片（约 15 秒），站点 tryhotellobby.app。自 $8.88。仅限 18+。',
    },
    features: {
      en: [
        'Two photos → ~15s booth duo',
        'Warm orange lobby aesthetic',
        'tryhotellobby.app · from $8.88',
      ],
      zh: [
        '两张照片 → 约 15 秒双人棚拍',
        '温暖橙色大堂美学',
        'tryhotellobby.app · $8.88 起',
      ],
    },
  },
  {
    id: 'raindance',
    slug: 'raindance',
    name: 'Raindance AI',
    createPath: 'https://raindanceai.click',
    href: 'https://raindanceai.click',
    icon: '/related-tools/raindance.svg',
    pitch: {
      en: 'Two photos → full pier/dock sunset video (silent MP4)',
      zh: '两张照片生成完整码头/栈桥日落视频（静音 MP4）',
    },
    description: {
      en: 'Raindance AI builds a full pier or dock sunset scene from two photos — silent cinematic MP4 on raindanceai.click. From $8.88. Adults 18+.',
      zh: 'Raindance AI 根据两张照片生成完整码头/栈桥日落场景静音 MP4（raindanceai.click）。自 $8.88。仅限 18+。',
    },
    features: {
      en: [
        'Two photos → pier/dock sunset film',
        'Silent cinematic MP4',
        'raindanceai.click · from $8.88',
      ],
      zh: [
        '两张照片 → 码头/栈桥日落成片',
        '静音电影感 MP4',
        'raindanceai.click · $8.88 起',
      ],
    },
  },
{
    id: 'chuttamalle',
    slug: 'chuttamalle',
    name: 'Chuttamalle',
    href: 'https://trychuttamalle.app',
    icon: '/related-tools/chuttamalle.svg',
    pitch: {
      en: 'Authorized portrait → Chuttamalle-style vertical dance clip',
      zh: '授权人像生成 Chuttamalle 风格竖屏舞曲短片',
    },
    description: {
      en: 'Chuttamalle turns an authorized portrait into a vertical dance-style clip inspired by the Chuttamalle vibe — music-forward and built for Reels or TikTok. Only use photos you have permission to transform. Create on trychuttamalle.app and export a share-ready short.',
      zh: 'Chuttamalle 将授权人像生成竖屏舞曲风格短片，节奏感强，适合 Reels / TikTok 分享。请仅使用你有权处理的照片。在 trychuttamalle.app 创作并导出可直接发布的短片。',
    },
    features: {
      en: [
        'Authorized portrait → dance-style clip',
        'Vertical, music-forward edit',
        'Built for short-form social',
      ],
      zh: [
        '授权人像 → 舞曲风格短片',
        '竖屏、节奏感剪辑',
        '面向短视频社交平台',
      ],
    },
  },
  {
    id: 'burning-bridges',
    slug: 'burning-bridges',
    name: 'Burning Bridges AI',
    nameSecondary: { en: 'Crystal chandelier party', zh: '水晶吊灯派对' },
    createPath: 'https://burningbridgesvideoai.com',
    href: 'https://burningbridgesvideoai.com',
    icon: '/related-tools/burning-bridges.svg',
    pitch: {
      en: '1–2 photos → Burning Bridges crystal-chandelier party template (MP4 with sound)',
      zh: '1–2 张照片 → Burning Bridges 水晶吊灯派对模板（带声 MP4）',
    },
    description: {
      en: 'Burning Bridges AI turns 1–2 photos into a Drake-inspired crystal-chandelier party clip. MP4 with sound from $8.88. Independent fan tool on burningbridgesvideoai.com — not affiliated with Drake/OVO/UMG. Adults 18+.',
      zh: 'Burning Bridges AI 把 1–2 张照片做成 Drake 灵感水晶吊灯派对短片。带声 MP4，$8.88 起。独立粉丝工具 burningbridgesvideoai.com；与 Drake/OVO/UMG 无关。仅限 18+。',
    },
    features: {
      en: [
        '1–2 photos → party template clip',
        '720p MP4 with sound from $8.88',
        'burningbridgesvideoai.com · 18+',
      ],
      zh: [
        '1–2 张照片 → 派对模板成片',
        '720p 带声 MP4，$8.88 起',
        'burningbridgesvideoai.com · 18+',
      ],
    },
  },
  {
    id: 'rumpelstiltskin-dance',
    slug: 'rumpelstiltskin-dance',
    name: 'Rumpelstiltskin Dance AI',
    nameSecondary: { en: 'Barn tip-toe meme', zh: '谷仓踮脚梗舞' },
    createPath: 'https://rumpelstiltskindance.video',
    href: 'https://rumpelstiltskindance.video',
    icon: '/related-tools/rumpelstiltskin.svg',
    pitch: {
      en: '1–2 photos → barn tip-toe / Wing In My Jawwdinz dance short',
      zh: '1–2 张照片 → 谷仓踮脚 / Wing In My Jawwdinz 梗舞短片',
    },
    description: {
      en: 'Rumpelstiltskin Dance AI turns 1–2 photos into a barn tip-toe meme dance short. MP4 with sound from $8.88 on rumpelstiltskindance.video. Independent fan tool. Adults 18+.',
      zh: 'Rumpelstiltskin Dance AI 把 1–2 张照片做成谷仓踮脚梗舞短片。带声 MP4，$8.88 起（rumpelstiltskindance.video）。独立粉丝工具。仅限 18+。',
    },
    features: {
      en: [
        '1–2 photos → tip-toe dance clip',
        '720p MP4 with sound from $8.88',
        'rumpelstiltskindance.video · 18+',
      ],
      zh: [
        '1–2 张照片 → 踮脚舞成片',
        '720p 带声 MP4，$8.88 起',
        'rumpelstiltskindance.video · 18+',
      ],
    },
  },
{
    id: 'jean-phil',
    slug: 'jean-phil',
    name: 'Jean Phil AI',
    nameSecondary: { en: 'Deadpan bob short', zh: '死面波波头短片' },
    href: 'https://jeanphilai.cc',
    icon: '/related-tools/jean-phil.svg',
    pitch: {
      en: '1 photo → blond bob + curled moustache deadpan short',
      zh: '一张照片 → 金色头盔波波头 + 卷翘八字胡死面短片',
    },
    description: {
      en: 'Jean Phil AI turns one photo into a vertical deadpan short with a honey-blond helmet bob, curled mustache, and suit look — night selfie / shadowbox energy, caption vibe “Oui Madame.” Independent fan-style template on jeanphilai.cc; not the official character site and not affiliated with @jean_philanthrope. MP4 from $8.88.',
      zh: 'Jean Phil AI 用一张照片生成竖屏死面短片：金色头盔波波头、卷翘八字胡、正装气质，夜景自拍 / 对空挥拳氛围，文案气质「Oui Madame.」。独立粉丝风格模板，在 jeanphilai.cc 创作；并非官方角色站，与 @jean_philanthrope 无关。成片自 $8.88。',
    },
    features: {
      en: ['1 photo → ~15s 9:16 short', 'Bob + moustache + suit look', 'jeanphilai.cc · from $8.88'],
      zh: ['1 张照片 → 约 15 秒竖屏', '波波头 + 八字胡 + 正装造型', 'jeanphilai.cc · $8.88 起'],
    },
  },
{
    id: 'bad-times',
    slug: 'bad-times',
    name: 'Bad Times AI',
    nameSecondary: { en: 'Quarrel dance short', zh: '吵舞波波头短片' },
    href: 'https://badtimesai.cc',
    icon: '/related-tools/bad-times.svg',
    pitch: {
      en: '1 photo → quarrel / lip-sync dance deadpan short',
      zh: '一张照片 → 对嘴吵舞 + 对口型能量吵舞短片',
    },
    description: {
      en: 'Bad Times AI turns one photo into a vertical deadpan short with quarrel-dance energy, lip-sync vibe, and suit look — caption energy “Bad Times Dance.” Independent fan-style template on badtimesai.cc; not affiliated with Imael Angel / BAD TIMES song / TikTok creators. MP4 from $8.88.',
      zh: 'Bad Times AI 用一张照片生成竖屏吵舞短片：对嘴吵舞、对口型能量、正装气质，文案气质「Bad Times Dance.」。独立粉丝风格模板，在 badtimesai.cc 创作；与 Imael Angel / BAD TIMES song / TikTok creators 无关。成片自 $8.88。',
    },
    features: {
      en: [
        '1 photo → ~15s 9:16 short',
        'Quarrel dance + lip-sync energy',
        'badtimesai.cc · from $8.88',
      ],
      zh: [
        '1 张照片 → 约 15 秒竖屏',
        '吵舞 + 对口型能量',
        'badtimesai.cc · $8.88 起',
      ],
    },
  },
{
    id: 'cheba-man',
    slug: 'cheba-man',
    name: 'Cheba Man AI',
    nameSecondary: { en: 'Tecktonik stage short', zh: 'Tecktonik 红舞台短片' },
    href: 'https://chebamanai.cc',
    icon: '/related-tools/cheba-man.svg',
    pitch: {
      en: '1 photo → Tecktonik red-stage dance short',
      zh: '一张照片 → Tecktonik 红舞台 + 手臂波浪短片',
    },
    description: {
      en: 'Cheba Man AI turns one photo into a vertical Tecktonik short with red-stage energy, arm waves, and suit look — caption vibe “Tecktonik.” Independent fan-style template on chebamanai.cc; not affiliated with @cheba_man / ARTBAT / Benny Benassi. MP4 from $8.88.',
      zh: 'Cheba Man AI 用一张照片生成竖屏 Tecktonik 短片：红舞台、手臂波浪、正装气质，文案气质「Tecktonik.」。独立粉丝风格模板，在 chebamanai.cc 创作；与 @cheba_man / ARTBAT / Benny Benassi 无关。成片自 $8.88。',
    },
    features: {
      en: [
        '1 photo → ~15s 9:16 short',
        'Tecktonik arms + red stage',
        'chebamanai.cc · from $8.88',
      ],
      zh: [
        '1 张照片 → 约 15 秒竖屏',
        'Tecktonik 手臂 + 红舞台',
        'chebamanai.cc · $8.88 起',
      ],
    },
  },
{
    id: 'venom-car',
    slug: 'venom-car',
    name: 'Venom Car AI',
    nameSecondary: { en: 'Goo garage-build short', zh: '粘液车库组装短片' },
    createPath: 'https://venomcarai.cc',
    href: 'https://venomcarai.cc',
    icon: '/related-tools/venom-car.svg',
    pitch: {
      en: '1 car photo → Venom goo garage-build short',
      zh: '一张车辆照片 → Venom 粘液车库组装短片',
    },
    description: {
      en: 'Venom Car AI turns one car photo into a ~15s Venom goo garage-build short (optional emblem). Independent fan tool on venomcarai.cc — not affiliated with Marvel, film studios, or car makers. MP4 from $8.88.',
      zh: 'Venom Car AI 用一张车辆照片生成约 15 秒粘液车库组装短片（可选徽标）。独立粉丝工具，在 venomcarai.cc 创作；与漫威、电影公司或汽车厂商无关。成片自 $8.88。',
    },
    features: {
      en: [
        '1 car photo → ~15s short',
        'Goo crawl · badge grab · assemble · reveal',
        'venomcarai.cc · from $8.88',
      ],
      zh: [
        '一张车辆照片 → 约 15 秒短片',
        '粘液爬行 · 抓徽标 · 组装 · 揭晓',
        'venomcarai.cc · $8.88 起',
      ],
    },
  },
{
    id: 'unforgettable-car',
    slug: 'unforgettable-car',
    name: 'Unforgettable Car AI',
    nameSecondary: { en: '24 card car reveal', zh: '24 卡牌汽车亮相' },
    createPath: 'https://unforgettablecarai.cc',
    href: 'https://unforgettablecarai.cc',
    icon: '/related-tools/unforgettable-car.svg',
    pitch: {
      en: 'Selfie + optional car → 24 card car reveal video',
      zh: '自拍 + 可选爱车 → 24 卡牌汽车亮相视频',
    },
    description: {
      en: 'Unforgettable Car AI turns one selfie (plus an optional car photo) into a ~15s 24 card car reveal: flash 2 + 4, swipe the lens, the car is parked behind you. Independent fan tool on unforgettablecarai.cc — not affiliated with the trend creators or car makers. From $8.88.',
      zh: 'Unforgettable Car AI 把一张自拍（加可选爱车照片）变成约 15 秒 24 卡牌汽车亮相视频：亮出 2 和 4、扫过镜头，车停在你身后。独立粉丝工具，在 unforgettablecarai.cc 创作；与原作者及汽车厂商无关。自 $8.88。',
    },
    features: {
      en: [
        'Selfie + optional car → ~15s video',
        'Flash 24 · swipe · car appears behind you',
        'Independent fan tool · from $8.88',
      ],
      zh: [
        '自拍 + 可选爱车 → 约 15 秒视频',
        '亮出 24 · 扫镜 · 车出现在身后',
        '独立粉丝工具 · 自 $8.88',
      ],
    },
  },
{
    id: 'chatgpt-millionaire',
    slug: 'chatgpt-millionaire',
    name: 'ChatGPT Millionaire AI',
    nameSecondary: { en: 'Get a job. meme', zh: 'Get a job. 梗视频' },
    createPath: 'https://chatgptmillionaire.cc',
    href: 'https://chatgptmillionaire.cc',
    icon: '/related-tools/chatgpt-millionaire.svg',
    pitch: {
      en: '1 selfie → ChatGPT Millionaire “Get a job.” meme short',
      zh: '一张自拍 → ChatGPT Millionaire「Get a job.」梗短片',
    },
    description: {
      en: 'ChatGPT Millionaire AI turns one selfie (or pet photo) into a ~10–13s 9:16 “Get a job.” meme short with original AI ambient audio. Independent fan tool on chatgptmillionaire.cc — not affiliated with OpenAI. From $8.88.',
      zh: 'ChatGPT Millionaire AI 用一张自拍（或宠物照）生成约 10–13 秒竖屏「Get a job.」梗短片，原创 AI 环境音。独立粉丝工具，在 chatgptmillionaire.cc 创作；与 OpenAI 无关。自 $8.88。',
    },
    features: {
      en: [
        '1 selfie/pet photo → ~10–13s short',
        'Ask · Get a job. · reaction punchline',
        'chatgptmillionaire.cc · from $8.88',
      ],
      zh: [
        '1 张自拍/宠物照 → 约 10–13 秒',
        '提问 · Get a job. · 破防 punchline',
        'chatgptmillionaire.cc · $8.88 起',
      ],
    },
  },
{
    id: 'hug-in-heaven',
    slug: 'hug-in-heaven',
    name: 'Hug In Heaven',
    nameSecondary: { en: 'Stairway reunion memorial', zh: '天堂楼梯重逢纪念' },
    createPath: 'https://huginheaven.video',
    href: 'https://huginheaven.video',
    icon: '/related-tools/hug-in-heaven.svg',
    pitch: {
      en: '2 photos → stairway reunion memorial short',
      zh: '两张照片 → 天堂楼梯重逢纪念短片',
    },
    description: {
      en: 'Hug In Heaven turns two photos into a ~12–15s 9:16 stairway reunion memorial short with a soft original score. Independent memorial fan tool — adults 18+ only. From $8.88.',
      zh: 'Hug In Heaven 用两张照片生成约 12–15 秒竖屏天堂楼梯重逢纪念短片，原创柔和配乐。独立纪念粉丝工具；仅限 18+。自 $8.88。',
    },
    features: {
      en: [
        '2 photos → ~12–15s memorial short',
        'Stairway search · light · reunion hug',
        'huginheaven.video · from $8.88 · 18+',
      ],
      zh: [
        '两张照片 → 约 12–15 秒纪念短片',
        '楼梯寻找 · 光中出现 · 重逢拥抱',
        'huginheaven.video · $8.88 起 · 18+',
      ],
    },
  },
{
    id: 'shan-shen-bu',
    slug: 'shan-shen-bu',
    name: 'Shan Shen Bu AI Dance',
    nameSecondary: { en: 'Flash Step AI', zh: '闪身步 AI 舞蹈' },
    createPath: 'https://shanshenbuai.cc',
    href: 'https://shanshenbuai.cc',
    icon: '/related-tools/shan-shen-bu.svg',
    pitch: {
      en: '1 photo → ~13–15s Shan Shen Bu / flash-step AI dance',
      zh: '一张照片 → 约 13–15 秒闪身步 AI 舞蹈短视频',
    },
    description: {
      en: 'Shan Shen Bu AI Dance turns one photo into a ~13–15s 9:16 Chinese flash-step (闪身步) dance short with sound. Human or pet. Independent AI dance tool on shanshenbuai.cc. From $8.88.',
      zh: 'Shan Shen Bu AI Dance 用一张照片生成约 13–15 秒竖屏闪身步舞蹈短视频，带声音。真人或宠物。独立 AI 舞蹈工具：shanshenbuai.cc。自 $8.88。',
    },
    features: {
      en: [
        'Human or pet · ~13–15s 9:16',
        'Flash step · kick · shiver · head wobble',
        'shanshenbuai.cc · from $8.88',
      ],
      zh: [
        '真人 / 宠物 · 约 13–15 秒 9:16',
        '闪身步 · 踢球 · 哆嗦 · 摇头',
        'shanshenbuai.cc · $8.88 起',
      ],
    },
  },
{
    id: 'chat-gtt',
    slug: 'chat-gtt',
    name: 'Chat GTT Lookin’ Ahh AI',
    nameSecondary: { en: 'card declined meme', zh: 'card declined 梗视频' },
    createPath: 'https://chatgtt.cc',
    href: 'https://chatgtt.cc',
    icon: '/related-tools/chat-gtt.svg',
    pitch: {
      en: '1 selfie → Chat GTT Lookin’ Ahh “card declined” meme short',
      zh: '一张自拍 → Chat GTT Lookin’ Ahh「card declined」梗短片',
    },
    description: {
      en: 'Chat GTT Lookin’ Ahh AI turns one selfie (or pet photo) into a ~10–13s 9:16 “card declined” meme short with original AI ambient audio. Independent fan tool on chatgtt.cc — not affiliated with ChatGPT or OpenAI. From $8.88.',
      zh: 'Chat GTT Lookin’ Ahh AI 用一张自拍（或宠物照）生成约 10–13 秒竖屏「card declined」梗短片，原创 AI 环境音。独立粉丝工具，在 chatgtt.cc 创作；与 ChatGPT / OpenAI 无关。自 $8.88。',
    },
    features: {
      en: [
        '1 selfie/pet photo → ~10–13s short',
        'Ask · card declined · reaction punchline',
        'chatgtt.cc · from $8.88',
      ],
      zh: [
        '1 张自拍/宠物照 → 约 10–13 秒',
        '提问 · card declined · 破防 punchline',
        'chatgtt.cc · $8.88 起',
      ],
    },
  },
  {
    id: 'flying-roadster',
    slug: 'flying-roadster',
    name: 'Flying Roadster AI',
    nameSecondary: { en: 'Flying Car AI', zh: '飞行跑车 / 飞车 AI' },
    createPath: 'https://flyingcarai.cc',
    href: 'https://flyingcarai.cc',
    icon: '/related-tools/flying-roadster.svg',
    pitch: {
      en: '1 selfie → ~10s rocket-over-traffic Flying Roadster short',
      zh: '一张自拍 → 约 10 秒火箭飞越堵车短片',
    },
    description: {
      en: 'Flying Roadster AI turns one selfie (or selfie + car) into a ~10s rocket-over-traffic short on flyingcarai.cc. From $8.88. Not affiliated with Tesla/SpaceX. Adults 18+.',
      zh: 'Flying Roadster AI 用一张自拍（或自拍+爱车）生成约 10 秒火箭飞越堵车短片（flyingcarai.cc）。自 $8.88。与 Tesla/SpaceX 无关。仅限 18+。',
    },
    features: {
      en: [
        'Selfie or selfie + car → ~10s 9:16',
        'Rocket boosters over freeway traffic',
        'flyingcarai.cc · from $8.88',
      ],
      zh: [
        '自拍或自拍+爱车 → 约 10 秒 9:16',
        '火箭推进飞越高速堵车',
        'flyingcarai.cc · $8.88 起',
      ],
    },
  },
{
    id: 'bby-wow-guy',
    slug: 'bby-wow-guy',
    name: 'Bby Wow Guy AI',
    nameSecondary: { en: 'quince concha meme', zh: 'quince concha meme' },
    createPath: 'https://bbywowguyai.cc',
    href: 'https://bbywowguyai.cc',
    icon: '/related-tools/bby-wow-guy.svg',
    pitch: {
      en: '1 face photo → ~10s quince concha / Bby Wow Guy meme short',
      zh: '一张脸部照 → 约 10 秒 quince concha / Bby Wow Guy meme 短片',
    },
    description: {
      en: 'Bby Wow Guy AI turns one clear face photo into a ~10s 9:16 quince party concha meme short with sound. Independent fan tool on bbywowguyai.cc — not affiliated with Eve Ramirez or the original song. Adults 18+ with consent. From $8.88.',
      zh: 'Bby Wow Guy AI 用一张清晰脸部照生成约 10 秒竖屏 quince 派对 concha meme 短片，带声音。独立粉丝工具：bbywowguyai.cc；与 Eve Ramirez / 原曲无关。仅成人同意。自 $8.88。',
    },
    features: {
      en: [
        '1 face photo → ~10s 9:16',
        'Dance in · bite concha · stare · dance away',
        'bbywowguyai.cc · from $8.88',
      ],
      zh: [
        '1 张脸部照 → 约 10 秒 9:16',
        '进场 · 咬 concha · 盯镜 · 离场',
        'bbywowguyai.cc · $8.88 起',
      ],
    },
  },
{
    id: 'devil-wears-prada',
    slug: 'devil-wears-prada',
    name: 'Devil Wears Prada AI',
    nameSecondary: { en: 'leather street glow-up', zh: '皮革街拍 glow-up' },
    createPath: 'https://pradaai.cc',
    href: 'https://pradaai.cc',
    icon: '/related-tools/devil-wears-prada.svg',
    pitch: {
      en: '1 photo (+ optional outfit) → ~15s doorway-to-leather night glow-up',
      zh: '一张照片（可选服装）→ 约 15 秒家门口型→夜间皮革街拍 glow-up',
    },
    description: {
      en: 'Devil Wears Prada AI turns one photo (optional second outfit photo) into a ~15s 9:16 doorway-to-leather night street glow-up short with sound. Independent fan tool on pradaai.cc — not affiliated with the film or brand. Adults 18+ with consent. From $8.88.',
      zh: 'Devil Wears Prada AI 用一张照片（可选第 2 张服装照）生成约 15 秒竖屏家门口型→夜间皮革街拍 glow-up 短片，带声音。独立粉丝工具：pradaai.cc；与电影/品牌无关。仅成人同意。自 $8.88。',
    },
    features: {
      en: [
        '1 photo (+ optional outfit) → ~15s 9:16',
        'Doorway look → night leather street',
        'pradaai.cc · from $8.88',
      ],
      zh: [
        '1 张照片（可选服装）→ 约 15 秒 9:16',
        '家门口型 → 夜间皮革街拍',
        'pradaai.cc · $8.88 起',
      ],
    },
  },
{
    id: 'kiss-cam',
    slug: 'kiss-cam',
    name: 'Kiss Cam AI',
    nameSecondary: { en: 'stadium kiss-cam joke', zh: '球场 kiss-cam 玩笑' },
    createPath: 'https://coldplayaffairai.cc',
    href: 'https://coldplayaffairai.cc',
    icon: '/related-tools/kiss-cam.svg',
    pitch: {
      en: '1–2 photos → ~10s stadium kiss-cam (hug → shock → hide)',
      zh: '1–2 张照片 → 约 10 秒球场 kiss-cam（拥抱→震惊→躲藏）',
    },
    description: {
      en: 'Kiss Cam AI turns 1–2 photos into a ~10s 9:16 stadium kiss-cam short with crowd sound only (no copyrighted lyrics). Independent fan tool on coldplayaffairai.cc — not affiliated with Coldplay or any league. Both subjects must consent; adults 18+. From $8.88.',
      zh: 'Kiss Cam AI 用 1–2 张照片生成约 10 秒竖屏球场 kiss-cam 短片，仅观众声、无版权歌词。独立粉丝工具：coldplayaffairai.cc；与 Coldplay / 联赛无关。双方知情同意；仅成人。自 $8.88。',
    },
    features: {
      en: [
        '1–2 photos → ~10s 9:16',
        'Hug → shock → hide · crowd sound only',
        'coldplayaffairai.cc · from $8.88',
      ],
      zh: [
        '1–2 张照片 → 约 10 秒 9:16',
        '拥抱 → 震惊 → 躲藏 · 仅观众声',
        'coldplayaffairai.cc · $8.88 起',
      ],
    },
  },
{
    id: 'cat-in-the-hat',
    slug: 'cat-in-the-hat',
    name: 'Cat in the Hat AI',
    nameSecondary: { en: 'doorbell Halloween prank', zh: '门铃万圣节整蛊' },
    createPath: 'https://catinthehat.cc',
    href: 'https://catinthehat.cc',
    icon: '/related-tools/cat-in-the-hat.svg',
    pitch: {
      en: '1 photo → ~10s doorbell-cam Halloween prank short',
      zh: '一张照片 → 约 10 秒门铃摄像头万圣节整蛊短片',
    },
    description: {
      en: 'Cat in the Hat AI turns one photo into a ~10s doorbell-cam Halloween prank short. Four versions: Doorbell, Window, Peek, Behind me. Independent fan / Halloween joke tool on catinthehat.cc — not a real sighting; not affiliated with original meme creators or Dr. Seuss rights holders. Credits: Peek/Behind me ~3; Doorbell/Window ~56 (one-click).',
      zh: 'Cat in the Hat AI 用一张照片生成约 10 秒门铃摄像头万圣节整蛊短片。门铃 / 窗户 / 探头 / 身后四种版本。独立粉丝/万圣节玩笑工具：catinthehat.cc；非真实目击，与原梗作者及 Dr. Seuss 权利方无关。Peek/身后约 3 积分，门铃/窗外约 56 积分（一键）。',
    },
    features: {
      en: [
        '1 photo → doorbell / window / peek / behind me',
        'Peek/Behind ~3 credits · Doorbell/Window ~56',
        'Halloween joke · not a real sighting · catinthehat.cc',
      ],
      zh: [
        '一张照片 → 门铃 / 窗外 / 探头 / 身后',
        'Peek/身后约 3 积分 · 门铃/窗外约 56',
        '万圣节玩笑 · 非真实目击 · catinthehat.cc',
      ],
    },
  },
{
    id: 'vs-runway',
    slug: 'vs-runway',
    name: 'VS Runway AI',
    nameSecondary: { en: 'Victoria Secret AI runway', zh: 'Victoria Secret AI 天使走秀' },
        createPath: 'https://victoriasecretai.cc',
    href: 'https://victoriasecretai.cc',
    icon: '/related-tools/vs-runway.svg',
    pitch: {
      en: '1 photo → ~10s angel-wings runway video with sound',
      zh: '一张照片 → 约 10 秒天使翅膀 T 台走秀视频（带声音）',
    },
    description: {
      en: "VS Runway AI turns one photo (people or pets) into a ~10s 9:16 fashion-show runway walk: giant angel wings, covered sequin gown, wave, strut and a kiss to camera, with runway music and crowd sound. One-time packs Single $8.88 / Popular $16.99 / Creator $39.90. Independent fan tool on victoriasecretai.cc — not affiliated with Victoria's Secret.",
      zh: "VS Runway AI 用一张照片（人或猫狗）生成约 10 秒 9:16 时装秀走秀视频：巨型天使翅膀、得体亮片礼服、挥手台步、对镜飞吻，带走秀音乐与观众声。一次性积分包 Single $8.88 / Popular $16.99 / Creator $39.90。独立粉丝工具 victoriasecretai.cc，与 Victoria's Secret 无关。",
    },
    features: {
      en: [
        '1 photo → ~10s 9:16 runway MP4 with sound',
        'White / Dark / Pet Angel looks',
        'From $8.88 one-time · victoriasecretai.cc',
      ],
      zh: [
        '一张照片 → 约 10 秒 9:16 带声走秀 MP4',
        '白天使 / 暗黑天使 / 萌宠天使',
        '$8.88 起一次性 · victoriasecretai.cc',
      ],
    },
  },
  {
    id: 'remix-meme',
    slug: 'remix-meme',
    name: 'Remix Meme',
    nameSecondary: { en: 'Awesome Meme Video', zh: 'Awesome Meme Video' },
    createPath: 'https://remixmeme.com',
    href: 'https://remixmeme.com',
    icon: '/related-tools/remix-meme.svg',
    pitch: {
      en: '225 AI meme templates · 1–2 photos → ~15s vertical MP4',
      zh: '225 个 AI 梗模板 · 1–2 张照片 → 约 15 秒竖屏短片',
    },
    description: {
      en: 'Remix Meme / Awesome Meme Video: 225 meme & viral templates. Upload 1–2 adult photos → ~15s 9:16 MP4 for TikTok/Reels. Plans from $8.88/mo on remixmeme.com. Independent fan tool — adults 18+.',
      zh: 'Remix Meme / Awesome Meme Video：225 个梗/爆款模板。上传 1–2 张成人照片 → 约 15 秒竖屏 9:16 MP4。订阅约 $8.88/月起（remixmeme.com）。独立粉丝工具，仅限 18+。',
    },
    features: {
      en: [
        '225 templates · 1–2 photos → ~15s 9:16',
        'TikTok / Reels ready · browser only',
        'remixmeme.com · from $8.88/mo',
      ],
      zh: [
        '225 模板 · 1–2 张照片 → 约 15 秒 9:16',
        '适配 TikTok / Reels · 纯浏览器',
        'remixmeme.com · $8.88/月起',
      ],
    },
  },
  {
    id: 'corpse-bride',
    slug: 'corpse-bride',
    name: 'Corpse Bride AI',
    nameSecondary: { en: 'Ghost bride cemetery dance', zh: '幽灵新娘墓地舞' },
    createPath: 'https://corpsebride.cc',
    href: 'https://corpsebride.cc',
    icon: '/related-tools/corpse-bride.svg',
    pitch: {
      en: '1 photo → ~10s ghost bride/groom cemetery dance',
      zh: '一张照片 → 约 10 秒幽灵新娘/新郎墓地舞',
    },
    description: {
      en: 'Corpse Bride AI turns one adult face photo into a ~10s 9:16 ghost bride or ghost groom cemetery dance with blue mist. From $8.88 on corpsebride.cc. Independent fan tool — not Tim Burton / Warner Bros. Adults 18+.',
      zh: 'Corpse Bride AI 用一张成人脸部照生成约 10 秒竖屏幽灵新娘/新郎墓地舞（蓝雾）。自 $8.88（corpsebride.cc）。独立粉丝工具，与 Tim Burton / Warner Bros. 无关。仅限 18+。',
    },
    features: {
      en: [
        '1 photo → ~10s 9:16 ghost dance',
        'Blue mist · cemetery look',
        'corpsebride.cc · from $8.88',
      ],
      zh: [
        '1 张照片 → 约 10 秒幽灵舞',
        '蓝雾 · 墓地氛围',
        'corpsebride.cc · $8.88 起',
      ],
    },
  },
  {
    id: 'white-chicks',
    slug: 'white-chicks',
    name: 'White Chicks AI',
    nameSecondary: { en: 'Night convertible sing', zh: '夜景敞篷对唱' },
    createPath: 'https://whitechicks.cc',
    href: 'https://whitechicks.cc',
    icon: '/related-tools/white-chicks.svg',
    pitch: {
      en: '1–2 photos → ~10–12s night convertible sing / pet short',
      zh: '1–2 张照片 → 约 10–12 秒夜景敞篷对唱 / 萌宠短片',
    },
    description: {
      en: 'White Chicks AI: duo (2 photos) ~12s night convertible sing, or pet (1 photo) ~10s. From $8.88 on whitechicks.cc. Independent fan tool — not Wayans/film. Adults 18+.',
      zh: 'White Chicks AI：双人（2 张）约 12 秒夜景敞篷对唱，或萌宠（1 张）约 10 秒。自 $8.88（whitechicks.cc）。独立粉丝工具，与电影无关。仅限 18+。',
    },
    features: {
      en: [
        '1–2 photos → ~10–12s 9:16',
        'Duo convertible or pet mode',
        'whitechicks.cc · from $8.88',
      ],
      zh: [
        '1–2 张照片 → 约 10–12 秒 9:16',
        '双人敞篷或萌宠模式',
        'whitechicks.cc · $8.88 起',
      ],
    },
  },
  {
    id: 'wyw-my-sweetie',
    slug: 'wyw-my-sweetie',
    name: 'Wyw My Sweetie AI',
    nameSecondary: { en: 'Half-face goo Halloween', zh: '半脸粘液万圣节' },
    createPath: 'https://wywmysweetie.run',
    href: 'https://wywmysweetie.run',
    icon: '/related-tools/wyw-my-sweetie.svg',
    pitch: {
      en: '1 photo → ~10s Halloween half-face goo makeup short',
      zh: '一张照片 → 约 10 秒万圣节半脸粘液妆短片',
    },
    description: {
      en: 'Wyw My Sweetie AI turns one clear face photo into a ~10s 9:16 Halloween half-face video — glossy black goo, jagged white eye, fangs. From $8.88 on wywmysweetie.run. Independent fan tool — not Marvel/Sony. Adults 18+.',
      zh: 'Wyw My Sweetie AI 用一张清晰脸部照生成约 10 秒竖屏万圣节半脸妆短片：黑粘液、锯齿白眼、獠牙。自 $8.88（wywmysweetie.run）。独立粉丝工具，与漫威/索尼无关。仅限 18+。',
    },
    features: {
      en: [
        '1 photo → ~10s 9:16',
        'Half-face goo · white eye · fangs',
        'wywmysweetie.run · from $8.88',
      ],
      zh: [
        '1 张照片 → 约 10 秒 9:16',
        '半脸粘液 · 白眼 · 獠牙',
        'wywmysweetie.run · $8.88 起',
      ],
    },
  },
  {
    id: 'melodygift',
    slug: 'melodygift',
    name: 'MelodyGift',
    nameSecondary: { en: 'Personalized gift song', zh: '定制礼物歌曲' },
    createPath: 'https://votremelodie.cc',
    href: 'https://votremelodie.cc',
    icon: '/related-tools/melodygift.svg',
    pitch: {
      en: 'Your story → a radio-quality personalized song gift',
      zh: '用你的故事做成电台级定制礼物歌曲',
    },
    description: {
      en: 'MelodyGift on votremelodie.cc turns your story into an original personalized song — custom lyrics and arrangement, delivered by email. Independent gift-music studio (not a video meme tool).',
      zh: 'MelodyGift（votremelodie.cc）把你的故事做成原创定制歌曲：专属歌词与编曲，邮件交付。独立礼物音乐工作室（非视频梗工具）。',
    },
    features: {
      en: [
        'Quiz → custom lyrics + arrangement',
        'Radio-quality audio gift',
        'votremelodie.cc',
      ],
      zh: [
        '问卷 → 定制歌词 + 编曲',
        '电台级音频礼物',
        'votremelodie.cc',
      ],
    },
  },
  {
    id: 'alorsondanse',
    slug: 'alorsondanse',
    name: 'Alors on Danse AI',
    nameSecondary: { en: 'Mini-keyboard meme', zh: '白棚迷你键盘 Meme' },
    createPath: 'https://tryalorsondanse.video',
    href: 'https://tryalorsondanse.video',
    icon: '/related-tools/alorsondanse.svg',
    pitch: {
      en: 'Two photos → ~10–15s white-studio keys + hype short',
      zh: '两张照片生成约 10–15 秒白棚键盘 + hype 短片',
    },
    description: {
      en: 'Alors on Danse AI turns two portraits into a white-studio mini-keyboard meme short. ~10–15s MP4 from $8.88 on tryalorsondanse.video. Independent fan tool — not affiliated with Stromae or Jamel. Adults 18+.',
      zh: 'Alors on Danse AI 把两张人像做成白棚迷你键盘 meme 短片。约 10–15 秒，$8.88 起（tryalorsondanse.video）。独立粉丝工具，与 Stromae / Jamel 无关。仅限 18+。',
    },
    features: {
      en: [
        'Two photos → keys + hype duo',
        'White studio · ~10–15s from $8.88',
        'tryalorsondanse.video · 18+',
      ],
      zh: [
        '两张照片 → 键盘 + hype 双人',
        '白棚 · 约 10–15 秒，$8.88 起',
        'tryalorsondanse.video · 18+',
      ],
    },
  },
];

export const TOOL_BY_SLUG: Record<string, RelatedTool> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t])
);

export const TOOL_BY_ID: Record<RelatedToolId, RelatedTool> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t])
) as Record<RelatedToolId, RelatedTool>;

export function siblingTools(excludeId: RelatedToolId): RelatedTool[] {
  return TOOLS.filter((t) => t.id !== excludeId);
}

export function toolLocalPath(slug: string): string {
  return `/tools/${slug}`;
}

/** /tools index + sibling detail pages for sitemap */
export function toolsSitemapPaths(excludeId: RelatedToolId): string[] {
  return ['/tools', ...siblingTools(excludeId).map((t) => toolLocalPath(t.slug))];
}

export function isZhLang(lang: string): boolean {
  return lang === 'zh' || lang === 'zht' || lang.startsWith('zh');
}

export function toolDisplayName(tool: RelatedTool, zh: boolean): string {
  if (!tool.nameSecondary) return tool.name;
  const secondary = zh ? tool.nameSecondary.zh : tool.nameSecondary.en;
  return `${tool.name} / ${secondary}`;
}

export function ToolIcon({
  tool,
  size = 40,
  className,
}: {
  tool: RelatedTool;
  size?: 32 | 40 | 48;
  className?: string;
}) {
  const px = `${size}px`;
  return (
    <img
      src={tool.icon}
      alt=""
      width={size}
      height={size}
      decoding="async"
      className={cn(
        'border-border bg-background shrink-0 rounded-xl border object-cover shadow-sm',
        className
      )}
      style={{ width: px, height: px }}
    />
  );
}

type Accent = 'rose' | 'amber';

const accentStyles: Record<
  Accent,
  {
    section: string;
    eyebrow: string;
    card: string;
  }
> = {
  rose: {
    section:
      'border-border scroll-mt-20 border-t bg-gradient-to-b from-rose-50/40 via-background to-background px-4 py-16 sm:py-20 dark:from-rose-950/20',
    eyebrow: 'text-rose-600 dark:text-rose-400 mb-2 text-xs font-semibold tracking-[0.16em] uppercase',
    card: 'border-border bg-card group flex h-full flex-col rounded-2xl border p-5 shadow-md shadow-black/5 transition hover:border-rose-400/50 hover:shadow-lg dark:bg-zinc-950 dark:hover:border-rose-400/40',
  },
  amber: {
    section:
      'border-border scroll-mt-20 border-t bg-gradient-to-b from-amber-500/5 via-background to-background px-4 py-16 sm:py-20',
    eyebrow: 'text-primary mb-2 text-xs font-semibold tracking-[0.16em] uppercase',
    card: 'border-border bg-card group flex h-full flex-col rounded-2xl border p-5 shadow-md shadow-black/5 transition hover:border-primary/40 hover:shadow-lg dark:bg-stone-950',
  },
};

/** Mutual cross-links to sibling tools. Primary CTA → local /tools pages. */
export function RelatedTools({
  excludeId,
  lang,
  accent = 'rose',
  limit,
  preferIds,
}: {
  excludeId: RelatedToolId;
  lang: string;
  accent?: Accent;
  /** Cap cards on dense landings (full list stays on /tools). */
  limit?: number;
  /** Prefer these ids first when limiting. */
  preferIds?: RelatedToolId[];
}) {
  const zh = isZhLang(lang);
  const es = lang === 'es' || lang.startsWith('es');
  let items = siblingTools(excludeId);
  if (preferIds?.length) {
    const rank = new Map(preferIds.map((id, i) => [id, i]));
    items = [...items].sort((a, b) => {
      const ra = rank.has(a.id) ? rank.get(a.id)! : 1000;
      const rb = rank.has(b.id) ? rank.get(b.id)! : 1000;
      return ra - rb;
    });
  }
  if (typeof limit === 'number' && limit > 0) {
    items = items.slice(0, limit);
  }
  const styles = accentStyles[accent];
  const subtitle = zh
    ? '同系列 AI 短视频工具 — 先了解本地介绍页，再前往对应站点创作'
    : es
      ? 'Más herramientas de video corto con IA del mismo estudio — lee la intro aquí y crea en cada sitio'
      : 'More AI short-video tools from the same studio — read the intro here, then create on each site';
  const learnMore = zh ? '了解更多' : es ? 'Saber más' : 'Learn more';
  const visitSite = zh ? '访问官网' : es ? 'Visitar sitio' : 'Visit site';
  const allTools = zh
    ? '查看全部相关工具'
    : es
      ? 'Ver todas las herramientas'
      : 'Browse all related tools';

  return (
    <section
      id="related-tools"
      className={styles.section}
      aria-label={
        zh ? '相关工具 Related tools' : es ? 'Herramientas relacionadas' : 'Related tools / 相关工具'
      }
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={styles.eyebrow}>
              {zh ? '同系列产品' : es ? 'Mismo estudio' : 'Same studio'}
            </p>
            <h2 className="text-foreground font-serif text-3xl tracking-tight sm:text-4xl">
              {zh ? '相关工具' : es ? 'Herramientas relacionadas' : 'Related tools'}
              <span className="text-muted-foreground ml-2 text-lg font-sans font-normal tracking-normal sm:text-xl">
                {zh ? '/ Related tools' : es ? '/ Related tools' : '/ 相关工具'}
              </span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl text-sm sm:text-base">
              {subtitle}
            </p>
          </div>
          <Link
            href="/tools"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'inline-flex shrink-0 gap-1.5 rounded-full'
            )}
          >
            {allTools}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {items.map((tool) => (
            <li key={tool.id}>
              <div className={styles.card}>
                <div className="flex items-start gap-3">
                  <ToolIcon tool={tool} size={40} />
                  <div className="min-w-0 flex-1">
                    <span className="text-foreground block text-base font-semibold tracking-tight sm:text-lg">
                      {tool.name}
                    </span>
                    {tool.nameSecondary ? (
                      <span className="text-muted-foreground mt-0.5 block text-xs">
                        {zh ? tool.nameSecondary.zh : tool.nameSecondary.en}
                      </span>
                    ) : null}
                  </div>
                </div>
                <span className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
                  {zh ? tool.pitch.zh : tool.pitch.en}
                </span>
                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    href={toolLocalPath(tool.slug)}
                    className={cn(
                      buttonVariants({ size: 'sm' }),
                      'inline-flex h-9 w-full justify-center gap-1.5 rounded-full text-sm'
                    )}
                  >
                    {learnMore}
                    <ArrowRight className="size-3.5" />
                  </Link>
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noopener"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1 text-xs transition"
                  >
                    {visitSite}
                    <span className="tracking-wide">
                      {tool.href.replace(/^https:\/\//, '')}
                    </span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
