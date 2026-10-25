import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { aiTask } from '@/config/db/schema';
import { db } from '@/core/db';
import { getUuid } from '@/lib/hash';
import {
  getChatGttDuration,
  getChatGttReferenceVideoUrl,
} from '@/config/motion-ref';
import { CREDITS_480P, CREDITS_720P } from '@/config/pricing';
import {
  createKieSeedanceTask,
  KIE_PROVIDER,
  KIE_SEEDANCE_2_FAST_MODEL,
} from '@/core/ai/kie-seedance';
import {
  createSeedanceTask,
  isUpstreamUnavailableMessage,
  SEEDANCE_20_FAST_MODEL,
  type TryAllAspect,
  type TryAllResolution,
} from '@/core/ai/tryallapi';
import {
  buildZombiePrompt,
  isAdTextEffect,
  isMotionControlEffect,
  isTripleImageEffect,
  sanitizeAdText,
  isZombieEffectSlug,
  type ZombieEffectSlug,
} from '@/core/ai/zombie-prompts';
import { getAuth } from '@/core/auth';
import { consume, getBalance } from '@/modules/credits/service';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

const MAX_IMAGE_CHARS = 12_000_000; // ~9MB base64 payload ceiling
const ALLOWED_ASPECTS = new Set(['21:9', '16:9', '9:16', '1:1']);
const ALLOWED_RES = new Set(['480p', '720p']);

type VideoProvider = typeof KIE_PROVIDER | 'tryallapi';

function isDataImageUrl(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(value) &&
    value.length < MAX_IMAGE_CHARS
  );
}

function isHttpImageUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2048) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

function isImageUrl(value: unknown): value is string {
  return isDataImageUrl(value) || isHttpImageUrl(value);
}

function creditsForResolution(resolution: TryAllResolution): number {
  return resolution === '480p' ? CREDITS_480P : CREDITS_720P;
}

/**
 * Provider chain:
 *   1) Kie.ai bytedance/seedance-2-fast (when KIE_API_KEY set)
 *   2) TryAllAPI Seedance 2.0 Fast → 2.5 (backup on channel/auth/model failure)
 */
async function POST({ request }: { request: Request }) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 8_000,
    keyPrefix: 'zombie-generate',
  });
  if (limited) return limited;

  try {
    const kieKey = envConfigs.kie_api_key;
    const tryallKey = envConfigs.tryallapi_api_key;
    if (!kieKey && !tryallKey) {
      return respErr('Video generation is not configured (missing API key)', {
        status: 503,
      });
    }

    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return respErr('Payment required — no credits session', {
        status: 401,
      });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return respErr('Invalid JSON body');
    }

    const effectSlug =
      typeof body.effectSlug === 'string' ? body.effectSlug.trim() : '';
    if (!effectSlug || !isZombieEffectSlug(effectSlug)) {
      return respErr('Unknown or missing effectSlug');
    }
    const slug = effectSlug as ZombieEffectSlug;
    const triple = isTripleImageEffect(slug);

    const photo1 = body.photo1;
    let photo2 = body.photo2;
    let photo3 = body.photo3;
    if (!isImageUrl(photo1)) {
      return respErr('photo1 must be a data:image/...;base64 URL or https URL');
    }
    if (triple) {
      if (!isImageUrl(photo2)) {
        return respErr('photo2 (vault action ref) is required for this template');
      }
      if (!isImageUrl(photo3)) {
        return respErr('photo3 (target costume look) is required for this template');
      }
    } else {
      // UI single-image flow may omit photo2 or copy photo1 — keep compatible.
      if (!isImageUrl(photo2)) {
        photo2 = photo1;
      }
      photo3 = undefined;
    }

    const aspect = (
      typeof body.aspect === 'string' ? body.aspect : triple ? '16:9' : '9:16'
    ) as TryAllAspect;
    if (!ALLOWED_ASPECTS.has(aspect)) {
      return respErr('aspect must be 21:9, 16:9, 9:16, or 1:1');
    }

    const resolution = (
      typeof body.resolution === 'string' ? body.resolution : '720p'
    ) as TryAllResolution;
    if (!ALLOWED_RES.has(resolution)) {
      return respErr('resolution must be 480p or 720p');
    }

    const note = typeof body.note === 'string' ? body.note.slice(0, 2000) : '';
    if (isAdTextEffect(slug) && !sanitizeAdText(note)) {
      return respErr('Ad text is required for skirt-ad-text (note field)');
    }
    const duration = getChatGttDuration(slug);
    const refVideoUrl = getChatGttReferenceVideoUrl(slug, envConfigs.app_url);
    // Image-only templates (skirt-ad-text, vault) must NEVER inherit flash-step @Video1.
    const useMotion = isMotionControlEffect(slug) && Boolean(refVideoUrl);
    if (
      (slug === 'skirt-ad-text' || slug === 'vault-costume-world-swap') &&
      useMotion
    ) {
      return respErr('Internal: motion ref incorrectly enabled for image-only template');
    }

    const need = creditsForResolution(resolution);
    const balance = await getBalance(session.user.id, {
      email: session.user.email,
      emailVerified: Boolean(
        (session.user as { emailVerified?: boolean }).emailVerified
      ),
    });
    if (balance < need) {
      return respErr('Insufficient credits', {
        status: 402,
      });
    }

    const consumed = await consume({
      userId: session.user.id,
      userEmail: session.user.email,
      credits: need,
      scene: 'zombie_generate',
      description: `Shan Shen Bu ${resolution} · ${effectSlug}`,
      metadata: JSON.stringify({
        effectSlug,
        resolution,
        aspect,
        duration,
        refVideoUrl: useMotion ? refVideoUrl : null,
        triple,
      }),
    });

    if (!consumed.success) {
      return respErr('Insufficient credits', { status: 402 });
    }

    try {
      const prompt = buildZombiePrompt(effectSlug, note);
      // Skirt-ad: single photo + ad-text prompt only (no flash-step ref video).
      const imageUrls = triple
        ? [photo1, photo2 as string, photo3 as string]
        : isAdTextEffect(slug)
          ? [photo1]
          : photo2
            ? [photo1, photo2 as string]
            : [photo1];
      const videoUrls = useMotion ? [refVideoUrl] : [];
      if (slug === 'skirt-ad-text') {
        if (videoUrls.length > 0) {
          throw new Error('skirt-ad-text must not send reference_video');
        }
        if (!prompt.includes('Skirt-Ad Text') && !prompt.includes('甩裙广告字')) {
          throw new Error('skirt-ad-text prompt missing skirt-ad template');
        }
      }

      let provider: VideoProvider = 'tryallapi';
      let created!: { id: string; model: string; raw?: any };
      let fallbackNote: string | null = null;
      let kieErrMsg: string | null = null;

      // 1) PRIMARY: Kie Seedance 2 Fast (when KIE_API_KEY is set)
      if (kieKey) {
        try {
          const kieOpts: Parameters<typeof createKieSeedanceTask>[0] = {
            apiKey: kieKey,
            prompt,
            imageUrls,
            aspectRatio: aspect,
            resolution,
            duration,
            generateAudio: true,
            model: KIE_SEEDANCE_2_FAST_MODEL,
          };
          if (videoUrls.length > 0) kieOpts.videoUrls = videoUrls;
          created = await createKieSeedanceTask(kieOpts);
          provider = KIE_PROVIDER;
        } catch (kieErr: any) {
          kieErrMsg = kieErr?.message || String(kieErr);
          console.warn(
            '[zombie/generate] Kie Seedance failed — falling back to TryAllAPI:',
            (kieErrMsg || '').slice(0, 200)
          );
          fallbackNote = 'Kie busy — using TryAllAPI Seedance…';
        }
      }

      // 2) SECONDARY: TryAllAPI Seedance Fast → 2.5 (if kie skipped/failed)
      if (provider !== KIE_PROVIDER) {
        if (!tryallKey) {
          throw new Error(
            kieErrMsg ||
              'TRYALLAPI_API_KEY is not configured for Seedance fallback'
          );
        }
        const taskOpts: Parameters<typeof createSeedanceTask>[0] = {
          apiKey: tryallKey,
          prompt,
          imageUrls,
          ratio: aspect,
          resolution,
          duration,
          generateAudio: true,
          model: SEEDANCE_20_FAST_MODEL,
        };
        if (videoUrls.length > 0) {
          taskOpts.videoUrls = videoUrls;
          taskOpts.preferVideoModelOnly = true;
        }
        created = await createSeedanceTask(taskOpts);
        provider = 'tryallapi';
      }


      // Persist provider so poll can resolve kie vs tryallapi even if the
      // client omits ?provider= (Kie ids are 32-char hex, not task_*).
      try {
        await db()
          .insert(aiTask)
          .values({
            id: getUuid(),
            userId: session.user.id,
            mediaType: 'video',
            provider,
            model:
              created.model ||
              (provider === KIE_PROVIDER
                ? KIE_SEEDANCE_2_FAST_MODEL
                : SEEDANCE_20_FAST_MODEL),
            prompt: prompt.slice(0, 4000),
            options: JSON.stringify({
              effectSlug,
              aspect,
              resolution,
              duration,
              fallbackFrom:
                provider === 'tryallapi' && kieKey ? 'kie' : null,
            }),
            status: 'pending',
            taskId: created.id,
            taskInfo: JSON.stringify({
              creditId: consumed.consumedCredit?.id || null,
              provider,
            }),
            costCredits: need,
            scene: 'zombie_generate',
            creditId: consumed.consumedCredit?.id || null,
          });
      } catch (persistErr) {
        console.warn('zombie ai_task persist failed:', persistErr);
      }

      return respData({
        taskId: created.id,
        effectSlug,
        aspect,
        resolution,
        duration,
        model: created.model,
        provider,
        fallback: provider !== KIE_PROVIDER && !!kieKey,
        statusNote: fallbackNote,
        status: 'queued',
        creditsCharged: need,
        balanceAfter: balance - need,
        // Client passes this on poll so failed upstream jobs can restore credits
        // even if ssb_ai_task persist was skipped.
        creditId: consumed.consumedCredit?.id || null,
      });
    } catch (genErr: any) {
      try {
        if (consumed.consumedCredit?.id) {
          const { revoke } = await import('@/modules/credits/service');
          await revoke(consumed.consumedCredit.id);
        }
      } catch (refundErr) {
        console.error('zombie generate refund failed:', refundErr);
      }
      const raw = genErr?.message || 'Failed to start generation';
      console.error('zombie generate failed:', raw);
      const message = isUpstreamUnavailableMessage(raw)
        ? 'Video model is temporarily busy. Your credits were refunded — tap Create to retry in a minute.'
        : raw;
      return respErr(message, {
        status: 502,
      });
    }
  } catch (e: any) {
    console.error('zombie generate failed:', e?.message || e);
    return respErr(e?.message || 'Failed to start generation', { status: 502 });
  }
}

export const Route = createFileRoute('/api/zombie/generate')({
  server: {
    handlers: { POST },
  },
});
