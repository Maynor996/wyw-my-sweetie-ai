export type Lang = 'en' | 'zh' | 'es' | 'pt' | 'fr';

export type Pack = {
  id: string;
  name: string;
  desc: string;
  price: string;
  videos: string;
  /** Per-video unit price comparison, e.g. "$8.30 / video" */
  unitPrice: string;
  featured: boolean;
  badge: string;
};

export type Copy = {
  metaTitle: string;
  metaDescription: string;
  navCreate: string;
  navDemo: string;
  navWhat: string;
  navPricing: string;
  navFaq: string;
  navEffects: string;
  heroH: string;
  heroP: string;
  heroInstruction: string;
  effectBadge: string;
  effectBadgeHint: string;
  upload1Title: string;
  upload1Hint: string;
  upload2Title: string;
  upload2Hint: string;
  /** Third slot (vault costume world-swap) */
  upload3Title?: string;
  upload3Hint?: string;
  uploadCta: string;
  photoNote: string;
  consent: string;
  noteLabel: string;
  noteHint: string;
  notePlaceholder: string;
  aspectLabel: string;
  resolutionLabel: string;
  createBtn: (price: string) => string;
  /** Beside balance / Create — e.g. "≈ 1 × 720p video" */
  creditsHint: (credits: number, resolution: '480p' | '720p') => string;
  /** Short warning under photo slots */
  roleWarn: string;
  /** Hero sample chip — honest demo label */
  heroSampleLabel: string;
  /** First-order Stripe promo chip */
  promoBanner: string;
  noAccountNote: string;
  toastSoon: string;
  toastNeedConsent: string;
  toastNeedPhotos: string;
  /** Required custom ad/skirt text (skirt-ad-text) */
  toastNeedNote?: string;
  demoSoundOn: string;
  demoMadeWith: string;
  beats: [string, string][];
  whatH: string;
  whatParas: string[];
  featuresH: string;
  features: [string, string][];
  howH: string;
  howSteps: [string, string][];
  pricingH: string;
  pricingP: string;
  packs: Pack[];
  pricingNote: string;
  buyPlaceholder: string;
  faqH: string;
  faqs: [string, string][];
  ctaH: string;
  ctaP: string;
  ctaBtn: string;
  footerTagline: string;
  footerProduct: string;
  footerLegal: string;
  footerDomain: string;
  moreEffectsH: string;
  moreEffectsP: string;
  moreEffectsCta: string;
  stickyCreate: string;
  durationBadge: string;
  /** Brand chip under hero sample (e.g. LobbyDuo · Seedance) */
  brandChip: string;
  /** Short badge on promo banner */
  promoBadge: string;
  /** Free preview / before-pay strip */
  previewBanner?: string;
  previewCtaH?: string;
  previewCtaP?: string;
  /** Sample results grid */
  resultsH?: string;
  resultsP?: string;
  resultsInputLabel?: string;
  resultsOutputLabel?: string;
  resultsPlaceholderNote?: string;
  /** Privacy / photo retention (Hotel Lobby style) */
  privacyH?: string;
  privacySteps?: [string, string][];
  /** Copyright / consent disclaimer block (Chuttamalle style) */
  disclaimerH?: string;
  disclaimerLead?: string;
  disclaimerBullets?: string[];
  disclaimerNote?: string;
};

export type EffectMeta = {
  slug: string;
  /** URL path segment under /effects (same as slug except home) */
  path: string;
  /** Local samples folder under /public/samples/<mediaSlug>/ */
  mediaSlug: string;
  /** Card title short */
  cardTitle: { en: string; zh: string; es?: string };
  cardBlurb: { en: string; zh: string; es?: string };
  durationSec: number;
  shots?: number;
  price720: string;
  /** Highlight on home grid */
  featured?: boolean;
  home?: boolean;
};
