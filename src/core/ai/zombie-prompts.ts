/**
 * Locked wywmysweetie AI prompt — single photo → i2v.
 * Source: MakeViral / remixmeme template (adapted). Standalone — no remixmeme.com dependency.
 * Uses @image1 for Seedance / Kie i2v.
 */

export const PRIMARY_EFFECT = 'wyw-my-sweetie' as const;

export const ZOMBIE_EFFECT_SLUGS = ['wyw-my-sweetie'] as const;

export type ZombieEffectSlug = (typeof ZOMBIE_EFFECT_SLUGS)[number];

export function isZombieEffectSlug(value: string): value is ZombieEffectSlug {
  return (ZOMBIE_EFFECT_SLUGS as readonly string[]).includes(value);
}

export function isSingleImageEffect(slug: string): boolean {
  return slug === 'wyw-my-sweetie';
}

export function isTripleImageEffect(_slug: string): boolean {
  return false;
}

export function isMotionControlEffect(_slug: string): boolean {
  return false;
}

export function isAdTextEffect(_slug: string): boolean {
  return false;
}

export function sanitizeAdText(note?: string): string {
  return (note || '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40);
}

export const WYW_MY_SWEETIE_PROMPT = `The person in @image1 dances a light and bouncy jersey-club groove in the place from @image1, wearing the clothes and shoes from @image1, keeping their own hair and face exactly recognizable.

CAMERA — continuous vertical 9:16 shot, whole body head-to-feet in view, natural balance, stable ground contact. Photorealistic.

MOTION (~13s) — follow this jersey-club timing exactly:
0-2 s: bounce on the toes, knees together, both hands up beside the face, palms out.
2-5 s: shrug with both hands open at the sides; one hand on the chest and one on the stomach; sway the hips with small knee pops in and out.
5-8 s: open both arms wide in a shrug with one knee up; step into a wide stance with bent knees and one hand at the chest.
8-11 s: pop one knee in with an arm out to the side; bring both hands up to the face; step and throw one arm out.
11-13 s: run a hand through the hair and lean to one side with a playful look into the camera.

Exactly one person, no other people. One continuous shot. No costume unless @image1 shows it. No text, captions, logos, watermarks. No famous celebrity faces.`;

const PROMPTS: Record<ZombieEffectSlug, string> = {
  'wyw-my-sweetie': WYW_MY_SWEETIE_PROMPT,
};

export function getZombiePrompt(slug: ZombieEffectSlug): string {
  return PROMPTS[slug];
}

export function buildZombiePrompt(slug: string, note?: string): string {
  const base =
    (isZombieEffectSlug(slug) ? PROMPTS[slug] : PROMPTS['wyw-my-sweetie']) ||
    PROMPTS['wyw-my-sweetie'];
  const extra = note?.trim();
  return extra ? `${base}\n\nUser note: ${extra}` : base;
}

export function listZombiePrompts(): Array<{ slug: ZombieEffectSlug; prompt: string }> {
  return ZOMBIE_EFFECT_SLUGS.map((slug) => ({ slug, prompt: PROMPTS[slug] }));
}
