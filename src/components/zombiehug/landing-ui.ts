import type { Lang } from './types';

export type LandingUi = {
  brandName: string;
  navMake: string;
  navExamples: string;
  navGuides: string;
  navWho: string;
  navPricing: string;
  signIn: string;
  makeVideo: string;
  videoSoonToast: string;
  eyebrow: string;
  heroTitle: string;
  heroSub: string;
  heroBody: string;
  ctaPhotoTitle: string;
  ctaPhotoHint: string;
  ctaFrom: string;
  upload: string;
  ctaVideoTitle: string;
  ctaVideoHint: string;
  ctaVideoPrice: string;
  soon: string;
  scenesCta: (n: number) => string;
  describeCta: string;
  newFace: string;
  backToHome: string;
  putNewFace: string;
  phoneCaption: string;
  statsAria: string;
  character: string;
  whoTitle: string;
  whoBody: string;
  createEyebrow: string;
  createTitle: string;
  createHint: (from: string) => string;
  galleryHeading: (n: number) => string;
  gallerySub: string;
  pricingMarketingNote: (from: string) => string;
  stripeNote: string;
  faqTitle: string;
  footerMakeVideo: string;
  footerSamples: string;
  footerPrivacy: string;
  footerTerms: string;
  stats: { n: string; label: string }[];
};

const en: LandingUi = {
  brandName: 'wywmysweetie AI',
  navMake: 'Make a video',
  navExamples: 'Examples',
  navGuides: 'Guides',
  navWho: 'About',
  navPricing: 'Pricing',
  signIn: 'Sign in',
  makeVideo: 'Make a video',
  videoSoonToast: 'Photo path is live — upload to create.',
  eyebrow: 'wywmysweetie AI · 2026',
  heroTitle: 'wywmysweetie AI — 1 photo, half-face goo',
  heroSub: 'wywmysweetie · 1 photo · From $8.88 · 2026',
  heroBody:
    'wywmysweetie turns 1 photo into a ~10s 9:16 Halloween half-face beauty reel — glossy black goo, jagged white eye, fangs. Pay-per-video from $8.88 on wywmysweetie.run. Independent fan tool — NOT Marvel / Sony. Adults who agreed only.',
  ctaPhotoTitle: 'Put me in the viral clip',
  ctaPhotoHint: '1 clear face photo',
  ctaFrom: 'from',
  upload: 'Upload',
  ctaVideoTitle: 'Turn my video into this trend',
  ctaVideoHint: 'Any clip up to 30 s',
  ctaVideoPrice: 'priced by length · from',
  soon: 'Soon',
  scenesCta: (n) => `See sample looks (${n})`,
  describeCta: 'Or browse more versions below',
  newFace: 'New look',
  backToHome: 'Back to home',
  putNewFace: 'Try again',
  phoneCaption: 'Tap to replay the Wyw My Sweetie demo.',
  statsAria: 'The trend in numbers',
  character: 'Trend',
  whoTitle: 'What is the wywmysweetie AI trend?',
  whoBody: 'wywmysweetie is an independent fan AI video tool on wywmysweetie.run: upload 1 adult face photo and get a ~10s 9:16 Halloween half-face goo / Symbiote makeup reel. Pricing starts From $8.88 per 720p render — pay once, no subscription. Not affiliated with Marvel or Sony; no studio footage. Adults who agreed only.',
  createEyebrow: 'Create',
  createTitle: 'Upload photo(s) — night convertible sing',
  createHint: (from) =>
    `Upload 1–2 photos. Packs from ${from}. Pay once — no subscription.`,
  galleryHeading: (n) => `wywmysweetie samples · ${n} looks`,
  gallerySub: 'Tap a sample to jump to create and preview that look.',
  pricingMarketingNote: (from) =>
    `Hero shows “from ${from}” as marketing; packs below are the checkout catalog.`,
  stripeNote: 'Secure payment via Stripe checkout.',
  faqTitle: 'Guides & FAQ',
  footerMakeVideo: 'Make a video',
  footerSamples: 'Samples',
  footerPrivacy: 'Privacy Policy',
  footerTerms: 'Terms of Service',
  stats: [
    { n: '~12s', label: 'duo length · 9:16 vertical' },
    { n: '$8.88', label: 'Single pack · one 720p' },
    { n: '1–2 photos', label: 'duo or pet looks' },
    { n: '18+', label: 'adults who agreed only' },
  ],
};

const zh: LandingUi = {
  ...en,
  navMake: '制作视频',
  navExamples: '示例',
  navGuides: '指南',
  navWho: '关于',
  navPricing: '定价',
  signIn: '登入',
  makeVideo: '制作视频',
  upload: '上传',
  ctaFrom: '起',
  createEyebrow: '创作',
  gallerySub: '点样片跳到创作区并预览。',
  faqTitle: '指南与常见问题',
  footerMakeVideo: '制作视频',
  footerSamples: '样片',
  footerPrivacy: '隐私政策',
  footerTerms: '服务条款',
  scenesCta: (n) => `查看样片造型（${n}）`,
  describeCta: '或浏览下方更多版本',
  backToHome: '回到 Duo',
  putNewFace: '试试 Pet',
};

const es: LandingUi = {
  ...en,
  navMake: 'Crear video',
  navExamples: 'Ejemplos',
  navGuides: 'Guías',
  navWho: 'Acerca de',
  navPricing: 'Precios',
  signIn: 'Entrar',
  makeVideo: 'Crear video',
  upload: 'Subir',
  ctaFrom: 'desde',
  createEyebrow: 'Crear',
  gallerySub: 'Toca una muestra para ir a crear.',
  faqTitle: 'Guías y FAQ',
  footerMakeVideo: 'Crear video',
  footerSamples: 'Muestras',
  footerPrivacy: 'Privacidad',
  footerTerms: 'Términos',
  scenesCta: (n) => `Ver looks de muestra (${n})`,
  describeCta: 'O mira más versiones abajo',
  backToHome: 'Volver a Duo',
  putNewFace: 'Probar Pet',
};

const pt: LandingUi = { ...es, faqTitle: 'Guias e perguntas frequentes', footerMakeVideo: 'Criar vídeo', footerSamples: 'Amostras', footerPrivacy: 'Privacidade', footerTerms: 'Termos', stripeNote: 'Pagamento seguro com Stripe Checkout.', backToHome: 'Voltar ao início', soon: 'Em breve' };
const fr: LandingUi = { ...es, faqTitle: 'Guides et FAQ', footerMakeVideo: 'Créer une vidéo', footerSamples: 'Exemples', footerPrivacy: 'Confidentialité', footerTerms: 'Conditions', stripeNote: 'Paiement sécurisé via Stripe Checkout.', backToHome: 'Retour à l’accueil', soon: 'Bientôt' };

const byLang: Record<Lang, LandingUi> = {en, zh, es, pt, fr};
export function getLandingUi(lang: Lang): LandingUi {
  return byLang[lang] || en;
}
