/**
 * TryAllAPI Seedance video generation client
 * @docs https://tryallapi.com — POST/GET /api/v3/contents/generations/tasks
 * Supports multimodal content: text, reference images, reference video (@Video1),
 * and reference audio (@audio1) — Seedance 2.0 Fast / 2.5 reference / edit patterns.
 */

export const TRYALLAPI_BASE = 'https://tryallapi.com';
/** Primary: Seedance 2.0 Fast (preferred for reference-video face-swap). */
export const SEEDANCE_20_FAST_MODEL = 'doubao-seedance-2-0-fast-260128';
export const SEEDANCE_25_MODEL = 'doubao-seedance-2-5-260628';
export const SEEDANCE_20_MODEL = 'doubao-seedance-2-0-260128';
/** @deprecated alias — prefer SEEDANCE_20_FAST_MODEL */
export const SEEDANCE_PRIMARY_MODEL = SEEDANCE_20_FAST_MODEL;
/**
 * Fallbacks when Fast capacity is exhausted / temporarily unavailable.
 * Order: 2.5 → 2.0 (non-fast).
 */
export const SEEDANCE_FALLBACK_MODELS = [
  SEEDANCE_25_MODEL,
  SEEDANCE_20_MODEL,
] as const;
/**
 * Reference-video path: Fast first, then 2.5 (both support @Video1).
 * Capacity failure after these bubbles to H3 in generate.ts.
 */
export const SEEDANCE_VIDEO_REF_MODELS = [
  SEEDANCE_20_FAST_MODEL,
  SEEDANCE_25_MODEL,
] as const;

export function isUpstreamUnavailableMessage(message: string): boolean {
  const m = (message || '').toLowerCase();
  return (
    m.includes('temporarily unavailable') ||
    m.includes('supply_unavailable') ||
    m.includes('service is temporarily') ||
    m.includes('model service') ||
    m.includes('服务暂不可用') ||
    m.includes('暂时不可用') ||
    m.includes('容量不足') ||
    m.includes('no available') ||
    m.includes('overloaded')
  );
}

export type TryAllAspect =
  | '21:9'
  | '16:9'
  | '9:16'
  | '4:3'
  | '1:1'
  | '3:4'
  | 'adaptive';
export type TryAllResolution = '480p' | '720p' | '1080p';

export type TryAllContentItem =
  | { type: 'text'; text: string }
  | {
      type: 'image_url';
      image_url: { url: string };
      role: 'reference_image' | 'first_frame' | 'last_frame';
    }
  | {
      type: 'video_url';
      video_url: { url: string };
      role: 'reference_video';
    }
  | {
      type: 'audio_url';
      audio_url: { url: string };
      role: 'reference_audio';
    };

export interface TryAllCreateTaskInput {
  apiKey: string;
  prompt: string;
  /**
   * Public URL or data:image/...;base64,...
   * One image = @Image1; optional second = @Image2 (crowd).
   */
  imageUrls: string[];
  /**
   * Public HTTPS MP4/MOV URLs used as Seedance reference_video (e.g. locked
   * motion template). Referenced in the prompt as @Video1, @Video2, …
   */
  videoUrls?: string[];
  /**
   * Public HTTPS MP3/WAV URLs used as Seedance reference_audio (e.g. default BGM).
   * Referenced in the prompt as @audio1, @audio2, …
   * Prefer omitting when @Video1 already carries the desired soundtrack.
   */
  audioUrls?: string[];
  ratio?: TryAllAspect;
  resolution?: TryAllResolution;
  duration?: number;
  generateAudio?: boolean;
  model?: string;
  /**
   * When true and videoUrls are set, try Seedance video-ref models only
   * (2.0 Fast → 2.5). Capacity failure then bubbles for H3 fallback.
   */
  preferVideoModelOnly?: boolean;
}

export interface TryAllTaskResult {
  id: string;
  status: string;
  model?: string;
  content?: { video_url?: string; last_frame_url?: string };
  usage?: { completion_tokens?: number; total_tokens?: number };
  error?: { code?: string; message?: string } | string;
  resolution?: string;
  ratio?: string;
  duration?: number;
  seed?: number;
  created_at?: number;
  updated_at?: number;
}

function authHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Encoding': 'identity',
  };
}

async function readJson(resp: Response): Promise<any> {
  const text = await resp.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `TryAllAPI returned non-JSON (${resp.status}): ${text.slice(0, 200)}`
    );
  }
}

function extractErrorMessage(body: any, status: number): string {
  if (!body || typeof body !== 'object') {
    return `TryAllAPI request failed (${status})`;
  }
  if (typeof body.message === 'string' && body.message) return body.message;
  if (typeof body.error === 'string' && body.error) return body.error;
  if (body.error && typeof body.error.message === 'string') {
    return body.error.message;
  }
  if (typeof body.msg === 'string' && body.msg) return body.msg;
  return `TryAllAPI request failed (${status})`;
}

/**
 * Create a Seedance generation task with prompt + images + optional video/audio refs.
 */
async function createSeedanceTaskOnce(
  input: TryAllCreateTaskInput & { model: string }
): Promise<{ id: string; raw: any; model: string }> {
  const {
    apiKey,
    prompt,
    imageUrls,
    videoUrls,
    audioUrls,
    ratio = '9:16',
    resolution = '720p',
    duration = 12,
    generateAudio = true,
    model,
  } = input;

  const content: TryAllContentItem[] = [
    { type: 'text', text: prompt.trim() },
  ];

  // @Video1 first so face-swap prompts that lead with the motion clip resolve cleanly.
  if (Array.isArray(videoUrls)) {
    for (const url of videoUrls) {
      if (typeof url === 'string' && url.trim()) {
        content.push({
          type: 'video_url',
          video_url: { url: url.trim() },
          role: 'reference_video',
        });
      }
    }
  }

  for (const url of imageUrls) {
    if (typeof url === 'string' && url.trim()) {
      content.push({
        type: 'image_url',
        image_url: { url: url.trim() },
        role: 'reference_image',
      });
    }
  }

  if (Array.isArray(audioUrls)) {
    for (const url of audioUrls) {
      if (typeof url === 'string' && url.trim()) {
        content.push({
          type: 'audio_url',
          audio_url: { url: url.trim() },
          role: 'reference_audio',
        });
      }
    }
  }

  const body = {
    model,
    content,
    resolution,
    ratio,
    duration,
    generate_audio: generateAudio,
  };

  const resp = await fetch(
    `${TRYALLAPI_BASE}/api/v3/contents/generations/tasks`,
    {
      method: 'POST',
      headers: authHeaders(apiKey),
      body: JSON.stringify(body),
    }
  );

  const json = await readJson(resp);
  if (!resp.ok) {
    throw new Error(extractErrorMessage(json, resp.status));
  }

  const id = json?.id || json?.data?.id || json?.task_id || json?.taskId;
  if (!id || typeof id !== 'string') {
    throw new Error('TryAllAPI create succeeded but returned no task id');
  }

  return { id, raw: json, model };
}

/**
 * Create a Seedance generation task.
 * Primary: 2.0 Fast. Falls back to 2.5 then 2.0 when capacity is down.
 * preferVideoModelOnly (reference video): Fast → 2.5 only, then bubble to H3.
 */
export async function createSeedanceTask(
  input: TryAllCreateTaskInput
): Promise<{ id: string; raw: any; model: string }> {
  const {
    apiKey,
    prompt,
    imageUrls,
    videoUrls,
    audioUrls,
    ratio = '9:16',
    resolution = '720p',
    duration = 12,
    generateAudio = true,
    model = SEEDANCE_20_FAST_MODEL,
    preferVideoModelOnly = false,
  } = input;

  if (!apiKey) throw new Error('TRYALLAPI_API_KEY is not configured');
  if (!prompt?.trim()) throw new Error('prompt is required');
  if (!imageUrls?.[0]) {
    throw new Error('at least one reference image is required');
  }

  const hasVideo =
    Array.isArray(videoUrls) &&
    videoUrls.some((u) => typeof u === 'string' && u.trim());

  const models =
    hasVideo && preferVideoModelOnly
      ? Array.from(new Set([model, ...SEEDANCE_VIDEO_REF_MODELS]))
      : Array.from(new Set([model, ...SEEDANCE_FALLBACK_MODELS]));

  let lastError: Error | null = null;
  for (let i = 0; i < models.length; i++) {
    const m = models[i];
    try {
      if (i > 0) {
        // Brief pause between capacity retries.
        await new Promise((r) => setTimeout(r, 1200));
      }
      return await createSeedanceTaskOnce({
        apiKey,
        prompt,
        imageUrls,
        videoUrls,
        audioUrls,
        ratio,
        resolution,
        duration,
        generateAudio,
        model: m,
      });
    } catch (e: any) {
      const msg = e?.message || String(e);
      lastError = e instanceof Error ? e : new Error(msg);
      // Only continue to fallbacks on capacity / unavailable style errors.
      if (!isUpstreamUnavailableMessage(msg)) {
        throw lastError;
      }
      console.warn(
        `[tryallapi] model ${m} unavailable, trying fallback:`,
        msg.slice(0, 160)
      );
    }
  }

  throw (
    lastError ||
    new Error(
      'Video model is temporarily busy. Your credits were refunded — tap Create to retry in a minute.'
    )
  );
}

/**
 * Poll a generation task by id.
 */
export async function getSeedanceTask({
  apiKey,
  taskId,
}: {
  apiKey: string;
  taskId: string;
}): Promise<TryAllTaskResult> {
  if (!apiKey) throw new Error('TRYALLAPI_API_KEY is not configured');
  if (!taskId) throw new Error('taskId is required');

  const resp = await fetch(
    `${TRYALLAPI_BASE}/api/v3/contents/generations/tasks/${encodeURIComponent(taskId)}`,
    {
      method: 'GET',
      headers: authHeaders(apiKey),
    }
  );

  const json = await readJson(resp);
  if (!resp.ok) {
    throw new Error(extractErrorMessage(json, resp.status));
  }

  // Some gateways wrap the task under `data`
  const task = (
    json?.data && typeof json.data === 'object' && !json.status
      ? json.data
      : json
  ) as TryAllTaskResult;

  return {
    id: task.id || taskId,
    status: String(task.status || 'unknown').toLowerCase(),
    model: task.model,
    content: task.content,
    usage: task.usage,
    error: task.error,
    resolution: task.resolution,
    ratio: task.ratio,
    duration: task.duration,
    seed: task.seed,
    created_at: task.created_at,
    updated_at: task.updated_at,
  };
}

export function isTerminalStatus(status: string): boolean {
  const s = status.toLowerCase();
  return (
    s === 'succeeded' ||
    s === 'success' ||
    s === 'failed' ||
    s === 'fail' ||
    s === 'expired' ||
    s === 'canceled' ||
    s === 'cancelled'
  );
}

export function isSuccessStatus(status: string): boolean {
  const s = status.toLowerCase();
  return s === 'succeeded' || s === 'success';
}

export function mapTryAllStatus(
  status: string
): 'pending' | 'processing' | 'success' | 'failed' {
  const s = status.toLowerCase();
  if (s === 'succeeded' || s === 'success') return 'success';
  if (
    s === 'failed' ||
    s === 'fail' ||
    s === 'expired' ||
    s === 'canceled' ||
    s === 'cancelled'
  ) {
    return 'failed';
  }
  if (s === 'running' || s === 'processing' || s === 'generating') {
    return 'processing';
  }
  return 'pending';
}
