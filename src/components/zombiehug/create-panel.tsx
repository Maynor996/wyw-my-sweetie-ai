'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Download, ImagePlus, Loader2, Lock, X } from 'lucide-react';
import { toast } from 'sonner';

import {
  CREDITS_480P,
  CREDITS_720P,
  formatCreatePrice,
  PRICE_480P_USD,
  PRICE_720P_USD,
} from '@/config/pricing';
import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

import { samplePaths } from './effects';
import {
  isAdTextEffect,
  isSingleImageEffect,
  isTripleImageEffect,
  isZombieEffectSlug,
} from '@/core/ai/zombie-prompts';
import { zhLang } from './lang';
import type { Copy } from './types';

type Aspect = '21:9' | '16:9' | '9:16';
type Resolution = '480p' | '720p';

type Slot = {
  file: File | null;
  preview: string | null;
};

type GenPhase =
  | 'idle'
  | 'uploading'
  | 'checkout'
  | 'queued'
  | 'processing'
  | 'success'
  | 'failed';

const DRAFT_KEY = 'wyw-my-sweetie:create-draft';

function emptySlot(): Slot {
  return { file: null, preview: null };
}

function creditsNeeded(resolution: Resolution): number {
  return resolution === '480p' ? CREDITS_480P : CREDITS_720P;
}

async function fileToDataUrl(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const b64 = btoa(binary);
  const mime = file.type || 'image/jpeg';
  return `data:${mime};base64,${b64}`;
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchBalance(): Promise<number> {
  try {
    const res = await fetch('/api/credits', { credentials: 'include' });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json || json.code !== 0) return 0;
    return Number(json.data?.balance) || 0;
  } catch {
    return 0;
  }
}

function dataUrlToFile(dataUrl: string, name: string): File | null {
  try {
    const [header, b64] = dataUrl.split(',');
    if (!b64) return null;
    const mime = /data:(.*?);base64/.exec(header)?.[1] || 'image/jpeg';
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new File([bytes], name, { type: mime });
  } catch {
    return null;
  }
}


function defaultAspectForEffect(slug: string): Aspect {
  // Vault (3-image) prefers 16:9; flash-step + skirt-ad-text stay vertical 9:16.
  return isTripleImageEffect(slug) ? '16:9' : '9:16';
}

export function CreatePanel({
  t,
  effectSlug,
  mediaSlug,
  toolChrome = false,
}: {
  t: Copy;
  effectSlug: string;
  mediaSlug?: string;
  /** Competitor-like tool card chrome on homepage */
  toolChrome?: boolean;
}) {
  const examples = samplePaths(mediaSlug || effectSlug);
  const lang = zhLang(getLocale());
  const [photo1, setPhoto1] = useState<Slot>(emptySlot);
  const [photo2, setPhoto2] = useState<Slot>(emptySlot);
  const [photo3, setPhoto3] = useState<Slot>(emptySlot);
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState('');
  const [aspect, setAspect] = useState<Aspect>(() =>
    defaultAspectForEffect(effectSlug)
  );
  const [resolution, setResolution] = useState<Resolution>('720p');
  const [phase, setPhase] = useState<GenPhase>('idle');
  const [statusText, setStatusText] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskProvider, setTaskProvider] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const input1 = useRef<HTMLInputElement>(null);
  const input2 = useRef<HTMLInputElement>(null);
  const input3 = useRef<HTMLInputElement>(null);
  const abortRef = useRef(0);
  const paidHandled = useRef(false);

  useEffect(() => {
    setAspect(defaultAspectForEffect(effectSlug));
  }, [effectSlug]);

  const price = useMemo(() => formatCreatePrice(resolution), [resolution]);
  const need = creditsNeeded(resolution);
  const triplePhoto = isTripleImageEffect(effectSlug);
  const singlePhoto = !triplePhoto && isSingleImageEffect(effectSlug);
  const adTextRequired = isAdTextEffect(effectSlug);
  const busy =
    phase === 'uploading' ||
    phase === 'checkout' ||
    phase === 'queued' ||
    phase === 'processing';

  function assignSlot(which: 1 | 2 | 3, file: File | null) {
    const set = which === 1 ? setPhoto1 : which === 2 ? setPhoto2 : setPhoto3;
    set((prev) => {
      if (prev.preview) URL.revokeObjectURL(prev.preview);
      if (!file) return emptySlot();
      return { file, preview: URL.createObjectURL(file) };
    });
  }

  function onFile(which: 1 | 2 | 3, fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    if (file && !file.type.startsWith('image/')) {
      toast.message(t.toastNeedPhotos);
      return;
    }
    if (file && file.size > 12 * 1024 * 1024) {
      toast.message('Each photo must be under 12 MB.');
      return;
    }
    assignSlot(which, file);
  }

  async function pollUntilDone(
    id: string,
    runId: number,
    provider: string | null,
    creditId: string | null
  ) {
    const started = Date.now();
    const timeoutMs = 12 * 60 * 1000;
    let delay = 8_000;
    let activeProvider = provider;

    while (abortRef.current === runId) {
      if (Date.now() - started > timeoutMs) {
        setPhase('failed');
        setStatusText('Timed out waiting for the video. Try again.');
        toast.message('Generation timed out — please try again.');
        return;
      }

      await sleep(delay);
      if (abortRef.current !== runId) return;

      const params = new URLSearchParams();
      if (activeProvider) params.set('provider', activeProvider);
      if (creditId) params.set('creditId', creditId);
      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(
        `/api/zombie/tasks/${encodeURIComponent(id)}${qs}`
      );
      const json = await res.json().catch(() => null);
      if (abortRef.current !== runId) return;

      if (!res.ok || !json || json.code !== 0) {
        const msg = json?.message || `Poll failed (${res.status})`;
        setPhase('failed');
        setStatusText(msg);
        toast.message(msg);
        const bal = await fetchBalance();
        setBalance(bal);
        return;
      }

      const data = json.data;
      if (typeof data?.provider === 'string' && data.provider) {
        activeProvider = data.provider;
        setTaskProvider(data.provider);
      }
      const status = data?.status as string;
      if (status === 'processing' || status === 'pending') {
        setPhase(status === 'processing' ? 'processing' : 'queued');
        setStatusText(
          status === 'processing'
            ? 'Rendering your Seedance video…'
            : 'Queued — waiting for the model…'
        );
        delay = Math.min(delay + 2_000, 20_000);
        continue;
      }

      if (status === 'success' && data.videoUrl) {
        setPhase('success');
        setVideoUrl(data.videoUrl);
        setStatusText('Ready — download your MP4 below.');
        toast.success('Video ready');
        return;
      }

      const err = data?.error || 'Generation failed';
      setPhase('failed');
      setStatusText(err);
      toast.message(err);
      const bal = await fetchBalance();
      setBalance(bal);
      if (data?.creditsRefunded) {
        toast.success(
          lang
            ? '积分已退回，换图后点 Create 即可，无需再付款'
            : 'Credits restored — replace the photo and tap Create (no second payment)'
        );
      }
      return;
    }
  }

  async function startGenerate(opts: {
    p1: string;
    p2: string;
    p3?: string;
    runId: number;
    aspect: Aspect;
    resolution: Resolution;
    note: string;
  }) {
    setPhase('queued');
    setStatusText('Starting Seedance…');

    const res = await fetch('/api/zombie/generate', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        effectSlug,
        photo1: opts.p1,
        photo2: opts.p2,
        ...(opts.p3 ? { photo3: opts.p3 } : {}),
        aspect: opts.aspect,
        resolution: opts.resolution,
        note: opts.note,
      }),
    });
    const json = await res.json().catch(() => null);
    if (abortRef.current !== opts.runId) return { ok: false as const };

    if (res.status === 401 || res.status === 402) {
      return { ok: false as const, needsPay: true as const };
    }

    if (!res.ok || !json || json.code !== 0) {
      const msg = json?.message || `Generate failed (${res.status})`;
      setPhase('failed');
      setStatusText(msg);
      toast.message(msg);
      return { ok: false as const };
    }

    const id = json.data?.taskId as string;
    const providerFromApi =
      typeof json.data?.provider === 'string' ? json.data.provider : null;
    // Never default a Kie hex taskId to tryallapi (causes task_not_exist).
    const provider =
      providerFromApi ||
      (/^[a-f0-9]{32}$/i.test(id || '') ? 'kie' : 'tryallapi');
    const creditId =
      typeof json.data?.creditId === 'string' && json.data.creditId
        ? (json.data.creditId as string)
        : null;
    setTaskId(id);
    setTaskProvider(provider);
    if (typeof json.data?.balanceAfter === 'number') {
      setBalance(json.data.balanceAfter);
    }
    setPhase('queued');
    const note =
      typeof json.data?.statusNote === 'string' && json.data.statusNote
        ? json.data.statusNote
        : provider === 'kie'
          ? 'Queued on Kie Seedance 2 Fast…'
          : 'Queued on TryAllAPI Seedance…';
    setStatusText(note);
    await pollUntilDone(id, opts.runId, provider, creditId);
    return { ok: true as const };
  }

  async function openCheckout(draft: {
    photo1: string;
    photo2: string;
    photo3?: string;
    aspect: Aspect;
    resolution: Resolution;
    note: string;
    consent: boolean;
  }) {
    setPhase('checkout');
    setStatusText('Opening Stripe Checkout…');
    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ ...draft, effectSlug, resume: true })
      );
    } catch {
      // sessionStorage full / blocked — still proceed to pay
    }

    const res = await fetch('/api/zombie/checkout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'render',
        productId: 'pack_1',
        effectSlug,
        resolution: draft.resolution,
      }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json || json.code !== 0 || !json.data?.checkout_url) {
      const msg = json?.message || 'Could not start checkout';
      setPhase('failed');
      setStatusText(msg);
      toast.message(msg);
      return;
    }
    window.location.href = json.data.checkout_url as string;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (
      !photo1.file ||
      (triplePhoto && (!photo2.file || !photo3.file)) ||
      (!singlePhoto && !triplePhoto && !photo2.file)
    ) {
      toast.message(t.toastNeedPhotos);
      return;
    }
    if (adTextRequired && !note.trim()) {
      toast.message(t.toastNeedNote || t.toastNeedPhotos);
      return;
    }
    if (!consent) {
      toast.message(t.toastNeedConsent);
      return;
    }

    const runId = Date.now();
    abortRef.current = runId;
    setVideoUrl(null);
    setTaskId(null);
    setTaskProvider(null);
    setPhase('uploading');
    setStatusText('Preparing your photos…');

    try {
      const file2 = singlePhoto ? photo1.file : photo2.file!;
      const encodes: Promise<string>[] = [
        fileToDataUrl(photo1.file),
        fileToDataUrl(file2),
      ];
      if (triplePhoto && photo3.file) {
        encodes.push(fileToDataUrl(photo3.file));
      }
      const encoded = await Promise.all(encodes);
      const p1 = encoded[0];
      const p2 = encoded[1];
      const p3 = encoded[2];
      if (abortRef.current !== runId) return;

      const bal = await fetchBalance();
      setBalance(bal);

      const draftPayload = {
        photo1: p1,
        photo2: p2,
        ...(p3 ? { photo3: p3 } : {}),
        aspect,
        resolution,
        note,
        consent,
      };

      if (bal < need) {
        await openCheckout(draftPayload);
        return;
      }

      const result = await startGenerate({
        p1,
        p2,
        p3,
        runId,
        aspect,
        resolution,
        note,
      });
      if (result && 'needsPay' in result && result.needsPay) {
        await openCheckout(draftPayload);
      }
    } catch (err: any) {
      if (abortRef.current !== runId) return;
      const msg = err?.message || 'Something went wrong';
      setPhase('failed');
      setStatusText(msg);
      toast.message(msg);
    }
  }

  // After Stripe return: sync credits, restore draft, auto-resume if possible.
  useEffect(() => {
    if (typeof window === 'undefined' || paidHandled.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') !== '1') {
      fetchBalance().then(setBalance);
      return;
    }
    paidHandled.current = true;

    const sessionId = params.get('session_id') || '';
    const runId = Date.now();
    abortRef.current = runId;

    try {
      document.getElementById('create')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } catch {}

    (async () => {
      setPhase('checkout');
      setStatusText('Confirming payment — syncing credits…');

      let bal = 0;
      for (let i = 0; i < 8; i++) {
        if (sessionId) {
          const sync = await fetch('/api/zombie/sync-payment', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId }),
          });
          const sj = await sync.json().catch(() => null);
          if (sj?.code === 0 && typeof sj.data?.balance === 'number') {
            bal = sj.data.balance;
            setBalance(bal);
            if (sj.data.paid) break;
          }
        } else {
          bal = await fetchBalance();
          setBalance(bal);
          if (bal > 0) break;
        }
        await sleep(1500);
      }

      // Clean paysuccess query without reload
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('paid');
        url.searchParams.delete('session_id');
        window.history.replaceState({}, '', url.pathname + url.hash);
      } catch {}

      let draft: any = null;
      try {
        const raw = sessionStorage.getItem(DRAFT_KEY);
        if (raw) draft = JSON.parse(raw);
      } catch {}

      if (draft?.photo1 && draft?.photo2) {
        const draftSlug =
          typeof draft.effectSlug === 'string' &&
          isZombieEffectSlug(draft.effectSlug)
            ? draft.effectSlug
            : effectSlug;

        // Paid on skirt-ad (etc.) but landed on wrong page → bounce to that template.
        if (draftSlug !== effectSlug) {
          const path =
            draftSlug === 'wyw-my-sweetie'
              ? '/'
              : `/effects/${draftSlug}`;
          const q = new URLSearchParams();
          q.set('paid', '1');
          if (sessionId) q.set('session_id', sessionId);
          window.location.replace(`${path}?${q.toString()}`);
          return;
        }

        const f1 = dataUrlToFile(draft.photo1, 'photo1.jpg');
        const f2 = dataUrlToFile(draft.photo2, 'photo2.jpg');
        if (f1) assignSlot(1, f1);
        if (f2) assignSlot(2, f2);
        if (draft.photo3) {
          const f3 = dataUrlToFile(draft.photo3, 'photo3.jpg');
          if (f3) assignSlot(3, f3);
        }
        if (draft.aspect) setAspect(draft.aspect);
        if (draft.resolution) setResolution(draft.resolution);
        if (typeof draft.note === 'string') setNote(draft.note);
        if (draft.consent) setConsent(true);

        const needNow = creditsNeeded(
          draft.resolution === '480p' ? '480p' : '720p'
        );
        const tripleReady = !triplePhoto || Boolean(draft.photo3);
        if (bal >= needNow && draft.resume && tripleReady) {
          toast.success('Credits ready — starting your video');
          try {
            sessionStorage.removeItem(DRAFT_KEY);
          } catch {}
          await startGenerate({
            p1: draft.photo1,
            p2: draft.photo2,
            p3: draft.photo3,
            runId,
            aspect: draft.aspect || defaultAspectForEffect(effectSlug),
            resolution: draft.resolution === '480p' ? '480p' : '720p',
            note: draft.note || '',
          });
          return;
        }
      }

      if (bal > 0) {
        setPhase('idle');
        setStatusText('Credits ready — press Create to generate.');
        toast.success('Credits ready — press Create');
      } else {
        setPhase('idle');
        setStatusText(
          'Payment received — credits may take a few seconds. Press Create when ready.'
        );
        toast.message('Payment synced. Press Create when credits appear.');
      }
    })().catch((err) => {
      console.error(err);
      setPhase('idle');
      setStatusText('Could not confirm payment. Press Create to retry.');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectSlug]);

  return (
    <form
      id="create"
      onSubmit={onSubmit}
      className={cn(
        'relative scroll-mt-20 overflow-hidden',
        toolChrome
          ? 'cmm-tool text-[color:var(--cmm-ink)]'
          : 'border-border bg-card text-card-foreground dark:border-border/80 dark:bg-card/90 rounded-3xl border shadow-xl shadow-black/5 dark:shadow-2xl dark:shadow-black/40'
      )}
    >
      <div
        className={cn(
          'flex flex-wrap items-center gap-2',
          toolChrome
            ? 'cmm-tool-head'
            : 'border-border border-b px-4 py-3 sm:px-5'
        )}
      >
        {toolChrome ? (
          <>
            <p className="cmm-tool-eyebrow">{t.effectBadge}</p>
            <h2 className="cmm-tool-title">
              {triplePhoto
                ? lang === 'es'
                  ? 'Añade 3 fotos'
                  : lang === 'zh'
                    ? '添加 3 张照片'
                    : 'Add 3 photos'
                : singlePhoto
                  ? lang === 'es'
                    ? 'Añade 1 foto'
                    : lang === 'zh'
                      ? '添加 1 张照片'
                      : 'Add 1 photo'
                  : lang === 'es'
                    ? 'Añade 2 fotos'
                    : lang === 'zh'
                      ? '添加 2 张照片'
                      : 'Add 2 photos'}
            </h2>
            <p className="mt-1 font-mono text-[10px] tracking-wide text-[color:var(--cmm-muted)]">
              effect · {effectSlug}
            </p>
          </>
        ) : (
          <>
            <span className="bg-primary/10 text-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
              <Lock className="size-3 opacity-70" />
              {t.effectBadge}
            </span>
            <span className="text-muted-foreground text-xs">
              {t.effectBadgeHint}
            </span>
          </>
        )}
        {balance !== null ? (
          <span
            className={cn(
              'ml-auto text-right text-xs leading-snug',
              toolChrome
                ? 'text-[color:var(--cmm-muted)]'
                : 'text-muted-foreground'
            )}
          >
            <span
              className={cn(
                'font-medium',
                toolChrome ? 'text-[color:var(--cmm-ink)]' : 'text-foreground'
              )}
            >
              {balance} credits
            </span>
            <span className="mt-0.5 block opacity-80">
              {t.creditsHint(balance, resolution)}
            </span>
          </span>
        ) : null}
      </div>

      <div className={cn('space-y-5', toolChrome ? 'pt-1' : 'p-4 sm:p-6')}>
        <div
          className={cn(
            'grid gap-3',
            triplePhoto
              ? 'sm:grid-cols-3'
              : singlePhoto
                ? 'sm:grid-cols-1 sm:max-w-md'
                : 'sm:grid-cols-2'
          )}
        >
          <UploadCard
            title={t.upload1Title}
            hint={t.upload1Hint}
            cta={t.uploadCta}
            exampleSrc={examples.frames[0]}
            exampleAlt="Photo 1 example"
            roleNum={1}
            preview={photo1.preview}
            inputRef={input1}
            toolChrome={toolChrome}
            onPick={() => input1.current?.click()}
            onClear={() => {
              assignSlot(1, null);
              if (input1.current) input1.current.value = '';
            }}
            onChange={(files) => onFile(1, files)}
          />
          {!singlePhoto ? (
            <UploadCard
              title={t.upload2Title}
              hint={t.upload2Hint}
              cta={t.uploadCta}
              exampleSrc={examples.frames[1]}
              exampleAlt="Photo 2 example"
              roleNum={2}
              preview={photo2.preview}
              inputRef={input2}
              toolChrome={toolChrome}
              onPick={() => input2.current?.click()}
              onClear={() => {
                assignSlot(2, null);
                if (input2.current) input2.current.value = '';
              }}
              onChange={(files) => onFile(2, files)}
            />
          ) : null}
          {triplePhoto ? (
            <UploadCard
              title={t.upload3Title || t.upload2Title}
              hint={t.upload3Hint || t.upload2Hint}
              cta={t.uploadCta}
              exampleSrc={examples.frames[2]}
              exampleAlt="Photo 3 example"
              roleNum={3}
              preview={photo3.preview}
              inputRef={input3}
              toolChrome={toolChrome}
              onPick={() => input3.current?.click()}
              onClear={() => {
                assignSlot(3, null);
                if (input3.current) input3.current.value = '';
              }}
              onChange={(files) => onFile(3, files)}
            />
          ) : null}
        </div>

        {!singlePhoto ? (
          <p className="text-foreground/90 border-border bg-muted/40 rounded-xl border px-3 py-2 text-xs leading-relaxed sm:text-sm">
            {t.roleWarn}
          </p>
        ) : null}
        <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
          {t.photoNote}
        </p>

        <label className="text-foreground flex cursor-pointer items-start gap-3 text-sm leading-snug">
          <Checkbox
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
            className="mt-0.5"
          />
          <span>{t.consent}</span>
        </label>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <label className="text-foreground text-sm font-medium">
              {t.noteLabel}
            </label>
            <span className="text-muted-foreground text-xs">
              {note.length}/2000
            </span>
          </div>
          <p className="text-muted-foreground mb-2 text-xs">{t.noteHint}</p>
          <Textarea
            value={note}
            maxLength={2000}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t.notePlaceholder}
            rows={3}
            className="min-h-[72px] resize-y"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ChipGroup
            label={t.aspectLabel}
            options={(['21:9', '16:9', '9:16'] as Aspect[]).map((v) => ({
              value: v,
              label: v,
            }))}
            value={aspect}
            onChange={setAspect}
          />
          <ChipGroup
            label={t.resolutionLabel}
            options={[
              {
                value: '480p' as Resolution,
                label: `480p · $${PRICE_480P_USD.toFixed(2)}`,
              },
              {
                value: '720p' as Resolution,
                label: `720p · $${PRICE_720P_USD.toFixed(2)}`,
              },
            ]}
            value={resolution}
            onChange={setResolution}
          />
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={busy}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-12 w-full rounded-full text-base font-semibold',
              toolChrome && 'cmm-cta-primary',
              busy && 'pointer-events-none opacity-80'
            )}
          >
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                {phase === 'uploading'
                  ? 'Uploading…'
                  : phase === 'checkout'
                    ? 'Checkout…'
                    : 'Generating…'}
              </span>
            ) : balance !== null && balance >= need ? (
              `Create · ${need} credits`
            ) : (
              t.createBtn(price)
            )}
          </button>
          <p className="text-muted-foreground text-center text-xs">
            {balance !== null && balance >= need
              ? t.creditsHint(need, resolution)
              : resolution === '720p'
                ? t.creditsHint(CREDITS_720P, '720p')
                : t.creditsHint(CREDITS_480P, '480p')}
            {' · '}
            {need} credits
            {resolution === '720p' ? ' = $8.88' : ' ≈ $6.66'}
          </p>
        </div>

        {(statusText || taskId) && (
          <div
            className={cn(
              'rounded-2xl border px-4 py-3 text-sm',
              phase === 'success'
                ? 'text-foreground border-emerald-500/30 bg-emerald-500/10'
                : phase === 'failed'
                  ? 'border-destructive/40 bg-destructive/10 text-foreground'
                  : 'border-border bg-muted/40 text-muted-foreground'
            )}
          >
            <p>{statusText}</p>
            {taskId ? (
              <p className="mt-1 font-mono text-[11px] opacity-70">
                task {taskId}
              </p>
            ) : null}
          </div>
        )}

        {videoUrl ? (
          <div className="border-border overflow-hidden rounded-2xl border bg-black">
            <video
              className="aspect-[9/16] max-h-[min(50vh,420px)] w-full object-contain sm:max-h-[420px]"
              controls
              playsInline
              src={videoUrl}
            />
            <div className="bg-card border-border flex items-center justify-between gap-3 border-t px-4 py-3">
              <span className="text-muted-foreground text-xs">
                Your render (link expires ~24h — download now)
              </span>
              <a
                href={videoUrl}
                download={`${effectSlug}.mp4`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: 'sm' }),
                  'h-8 gap-1.5 rounded-full'
                )}
              >
                <Download className="size-3.5" />
                Download
              </a>
            </div>
          </div>
        ) : null}

        <p className="text-muted-foreground text-center text-xs">
          {t.noAccountNote}
        </p>
      </div>
    </form>
  );
}

function UploadCard({
  title,
  hint,
  cta,
  exampleSrc,
  exampleAlt,
  roleNum,
  preview,
  inputRef,
  toolChrome = false,
  onPick,
  onClear,
  onChange,
}: {
  title: string;
  hint: string;
  cta: string;
  exampleSrc: string;
  exampleAlt: string;
  roleNum: 1 | 2 | 3;
  preview: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  toolChrome?: boolean;
  onPick: () => void;
  onClear: () => void;
  onChange: (files: FileList | null) => void;
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-[200px] flex-col overflow-hidden',
        toolChrome
          ? 'cmm-slot-stage'
          : 'border-border bg-muted/30 dark:bg-muted/20 rounded-2xl border border-dashed'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => onChange(e.target.files)}
      />
      {preview ? (
        <>
          <img
            src={preview}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="relative mt-auto flex items-end justify-between gap-2 p-3">
            <div className="min-w-0">
              <span className="mb-1 inline-flex rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                Photo {roleNum}
              </span>
              <span className="block text-sm font-semibold text-white drop-shadow">
                {title}
              </span>
              <span className="mt-0.5 block text-[11px] text-white/80">
                {hint}
              </span>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
              aria-label="Remove"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={onPick}
          className={cn(
            'relative flex flex-1 flex-col items-stretch gap-0 overflow-hidden text-left transition-colors',
            toolChrome
              ? 'text-[color:var(--cmm-ink)] hover:bg-[color:var(--cmm-accent-soft)]'
              : 'hover:bg-muted/50 text-foreground'
          )}
        >
          {toolChrome ? (
            <div className="flex items-start gap-2.5 px-3 pt-3">
              <span className="cmm-slot-num">{roleNum}</span>
              <div className="min-w-0">
                <strong className="block text-[15px] leading-snug">
                  {title}
                </strong>
                <small className="mt-0.5 block text-[12.5px] leading-snug text-[color:var(--cmm-muted)]">
                  {hint}
                </small>
              </div>
            </div>
          ) : null}
          <div
            className={cn(
              'relative w-full shrink-0 overflow-hidden',
              toolChrome ? 'mt-2 h-[72px] sm:h-[84px]' : 'h-[88px] sm:h-[100px]'
            )}
          >
            <img
              src={exampleSrc}
              alt={exampleAlt}
              className="size-full object-cover opacity-90"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/10" />
            <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
              Example · Photo {roleNum}
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-3 py-3">
            <ImagePlus
              className={cn(
                'size-7',
                toolChrome
                  ? 'text-[color:var(--cmm-muted)]'
                  : 'text-muted-foreground'
              )}
            />
            {!toolChrome ? (
              <>
                <span className="text-center text-sm font-semibold">
                  {title}
                </span>
                <span className="text-muted-foreground max-w-[16rem] text-center text-xs leading-snug">
                  {hint}
                </span>
              </>
            ) : null}
            <span
              className={cn(
                'mt-1 text-[11px] font-medium underline-offset-2 hover:underline',
                toolChrome
                  ? 'text-[color:var(--cmm-accent-deep)]'
                  : 'text-foreground/80'
              )}
            >
              {cta}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'min-h-11 rounded-full border px-3.5 py-2.5 text-xs font-medium transition-colors sm:min-h-9 sm:py-1.5 sm:text-sm',
              value === opt.value
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
