import type { Copy, Lang } from './types';

const packsEn = [
  { id: 'pack_1', name: 'Single', desc: '500 credits', price: '$8.88', videos: '1×720p', unitPrice: '$8.88 / video', featured: false, badge: '' },
  { id: 'pack_3', name: 'Popular', desc: '1500 credits', price: '$16.99', videos: '3×720p', unitPrice: '~$5.66 / video', featured: true, badge: 'Popular' },
  { id: 'pack_10', name: 'Creator', desc: '5000 credits', price: '$29.90', videos: '10×720p', unitPrice: '~$2.99 / video', featured: false, badge: '' }
];

const en: Copy = {
  metaTitle: "wywmysweetie AI Video — Come Back and Back Dance From $8.88",
  metaDescription: "wywmysweetie AI: 1 photo → ~13s 9:16 jersey-club dance — come back and back trend moves. From $8.88. Independent fan tool — not the original song owners. Adults who agreed only.",
  navCreate: 'Create',
  navDemo: 'Samples',
  navWhat: 'What is it',
  navPricing: 'Pricing',
  navFaq: 'FAQ',
  navEffects: 'Effects',
  heroH: "wywmysweetie AI: come back and back dance from 1 photo",
  heroP: "wywmysweetie turns one full-body photo into a ~13s 9:16 jersey-club dance reel — toe bounces, shrugs, knee pops, hand through the hair. From $8.88 on wywmysweetie.run.",
  heroInstruction: "Upload 1 photo. Locked Wyw My Sweetie look — no prompt to write.",
  effectBadge: "Wyw My Sweetie",
  effectBadgeHint: 'Locked effect on this page',
  upload1Title: 'Your photo',
  upload1Hint: "Full body · head to feet",
  upload2Title: 'Not used',
  upload2Hint: '',
  uploadCta: 'Upload photo',
  photoNote: "One adult full-body photo, head to feet in view, clear floor. Adults who agreed only.",
  consent: 'I own this photo or have adult consent. No children, celebrities, or strangers.',
  noteLabel: 'Add a note (optional)',
  noteHint: 'Vibe only. Do not paste copyrighted text.',
  notePlaceholder: 'Optional vibe note',
  aspectLabel: 'Aspect ratio',
  resolutionLabel: 'Resolution',
  createBtn: (price: string) => `Create · ${price}`,
  creditsHint: (credits: number, resolution: '480p' | '720p') =>
    `≈ ${Math.max(1, Math.floor(credits / (resolution === '480p' ? 375 : 500)))} × ${resolution} video`,
  roleWarn: "One adult full-body photo, head to feet in view, clear floor. Adults who agreed only.",
  heroSampleLabel: 'Sample demo',
  promoBanner: 'Single $8.88 · 3-pack $16.99. Independent fan tool.',
  noAccountNote: 'No account needed: pay once and your video starts right here.',
  toastSoon: 'Opening Stripe Checkout…',
  toastNeedConsent: 'Please confirm photo rights before creating.',
  toastNeedPhotos: 'Add a photo to continue.',
  demoSoundOn: 'Turn sound on',
  demoMadeWith: 'First-party samples · originals only',
  beats: [
    ['Start', 'frame-1'],
    ['Mid', 'frame-2'],
    ['Peak', 'frame-3'],
    ['Finish', 'frame-4'],
  ],
  whatH: "What is the wywmysweetie AI trend?",
  whatParas: [
    "wywmysweetie is the wyw my sweetie meme: one photo becomes a ~13s 9:16 vertical reel. On wywmysweetie.run you upload one adult photo — no prompt to write — and Seedance builds the locked look. People search wywmysweetie as one word; we keep that glued form in title, description, and H1 while still writing Wyw My Sweetie in readable sentences.",
    "The locked pipeline keeps your identity recognizable. Pricing starts From $8.88 for one 720p render (500 credits); 480p uses 375 credits. Failed renders restore credits. wywmysweetie is an independent fan tool — NOT affiliated with nissi, 25Hzz, @akanenmiyoshi, TikTok, or the original song owners. No official music rights granted. — and uses no third-party studio footage.",
    "Use cases: TikTok / Reels / Shorts trend posts, Halloween or dance memes, and friend challenges. Tips: sharp photo, even light, follow the upload hint. After download, label the post AI-generated. Adults who agreed only — never children, celebrities, or strangers.",
    "wywmysweetie keeps photos local for preview first, then uses a short-lived private link for the render. Source photos are not a long-term public gallery — see Privacy Policy. Save your MP4 promptly. Share wywmysweetie.run so friends land on the same independent tool.",
    "Where wywmysweetie fits in 2026 short-form: trend memes travel well with locked one-tap templates. wywmysweetie.run keeps a single locked template From $8.88 with ~13s 9:16 output ready for TikTok / Reels / Shorts. Always keep the independent-fan note.",
    "Quality tips: clear face (or full body when required), even light. If generation fails, credits restore on failed poll — then retry. Save the MP4 from wywmysweetie.run before the link expires. Caption with wywmysweetie once for searchers who type the glued form."
  ],
  featuresH: "Why create with wywmysweetie",
  features: [
    ["One-tap wywmysweetie flow", "No prompt — upload 1 photo, Create."],
    ["9:16 ready", "TikTok / Reels / Shorts framing."],
    ["Credits refund", "Failed wywmysweetie runs restore credits on poll."],
    ["Consent first", "Own photos / adults who agreed only."],
    ["Pay once", "From $8.88 — no subscription on wywmysweetie.run."],
    ["Identity lock", "Your face and look stay recognizable."],
  ],
  howH: "How wywmysweetie video generation works",
  howSteps: [
    ["Add 1 photo", "Full body · head to feet. Adults only."],
    ["Tap Create", "Price shows first (From $8.88). Seedance builds the locked clip."],
    ["Download MP4", "Vertical 9:16 in a few minutes. Label AI when you share from wywmysweetie.run."],
  ],
  pricingH: 'One 720p video for $8.88',
  pricingP:
    'Pay once — no subscription. $8.88 = 500 credits = one 720p render. 480p uses 375 credits. Failed renders return credits.',
  packs: packsEn,
  pricingNote: 'Credit packs are a one-time buy. Stripe checkout. Credits unlock Create on this page.',
  buyPlaceholder: 'Buy',
  faqH: "wywmysweetie FAQ",
  faqs: [
    ["What is wywmysweetie?", "wywmysweetie is an independent AI tool on wywmysweetie.run for the Wyw My Sweetie trend from 1 photo. NOT affiliated with nissi, 25Hzz, @akanenmiyoshi, TikTok, or the original song owners. No official music rights granted."],
    ["Why is the keyword one word?", "People search wywmysweetie glued. We use that form in title, description, and H1, and still say Wyw My Sweetie in readable sentences."],
    ["Do I write a prompt?", "No. Upload one photo, tap Create. The look is locked."],
    ["What if generation fails?", "Credits are restored when the task is marked failed."],
    ["Adults only?", "Yes — own photos or adults who agreed. Never children, celebrities, or strangers."],
    ["Official studio footage?", "No. Original AI look only on wywmysweetie.run."],
    ["How much does wywmysweetie cost?", "From $8.88 for one 720p (500 credits). 3-pack $16.99. Pay once — no subscription."],
    ["How long is the clip?", "~13 seconds, 9:16 vertical."],
  ],
  ctaH: 'Make your video now',
  ctaP: "From $8.88 on wywmysweetie.run.",
  ctaBtn: 'Create · $8.88',
  footerTagline: "wywmysweetie AI — independent fan tool on wywmysweetie.run.",
  footerProduct: 'Product',
  footerLegal: 'Legal',
  footerDomain: "wywmysweetie.run",
  moreEffectsH: 'More versions',
  moreEffectsP: 'Same pipeline — each effect keeps faces clear from your photos.',
  moreEffectsCta: 'Create · $8.88',
  stickyCreate: 'Create · $8.88',
  durationBadge: "~13s · 9:16",
  brandChip: "wywmysweetie · Seedance",
  promoBadge: 'DEAL',
  previewBanner: 'Add a photo, confirm permission, unlock Create with a one-time pack. No prompt to write.',
  previewCtaH: 'Add a photo and start',
  previewCtaP: 'Vertical MP4, no watermark from us. Failed renders return credits.',
  resultsH: 'Sample results',
  resultsP: 'First-party demos only — we do not deep-link competitor CDNs. Your paid render uses your photo.',
  resultsInputLabel: 'Input photo',
  resultsOutputLabel: 'Generated clip',
  resultsPlaceholderNote: 'Demo clip. Independent fan tool — use only photos you have rights to.',
  privacyH: 'Faces are personal. We keep them briefly.',
  privacySteps: [
    ["Upload", "Photos stay local for preview first on wywmysweetie."],
    ["Generate", "Render uses a short-lived private link when you create."],
    ["Cleanup", "Source photos are not kept as a long-term gallery — see Privacy Policy."],
    ["Download", "Save your MP4 promptly; render links expire."],
  ],
  disclaimerH: 'Use respectfully',
  disclaimerLead: 'AI-generated meme/trend video. Label AI when you post. Adults who agreed only.',
  disclaimerBullets: [
    "AI-generated entertainment only.",
    "Do not impersonate others or invent real scandals.",
    "Keep the platform AI label on when you post.",
  ],
  disclaimerNote: "Independent fan tool. NOT affiliated with nissi, 25Hzz, @akanenmiyoshi, TikTok, or the original song owners. No official music rights granted. Product: wywmysweetie.run only.",
};

const copies: Record<string, Partial<Record<Lang, Copy>> & { en: Copy }> = {
  'wyw-my-sweetie': { en },
};

export function getEffectCopy(slug: string, lang: Lang): Copy {
  const pack = copies[slug] ?? copies['wyw-my-sweetie'];
  return pack[lang] ?? pack.en;
}

export function listEffectCopySlugs(): string[] {
  return Object.keys(copies);
}

export function hasEffectCopy(slug: string): boolean {
  return slug in copies || slug === 'wyw-my-sweetie';
}
