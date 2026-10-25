/**
 * Kie.ai Seedance 2 Fast client (createTask + poll recordInfo).
 * @docs https://kie.ai/ — model bytedance/seedance-2-fast
 *
 * aizombie i2v: reference_image_urls + prompt (+ optional aspect/resolution/
 * duration/generate_audio). reference_video_urls / audio are optional — omit
 * when unused (multi-shot image-to-video, not Rumpel motion face-swap).
 */

export const KIE_API_BASE = 'https://api.kie.ai/api/v1';
export const KIE_SEEDANCE_2_FAST_MODEL = 'bytedance/seedance-2-fast';
export const KIE_PROVIDER = 'kie' as const;

/** Seedance 2 Fast on Kie accepts up to 15s. */
export const KIE_SEEDANCE_2_FAST_MAX_DURATION = 15;

export function isKieUpstreamUnavailableMessage(message: string): boolean {
  const m = (message || '').toLowerCase();
  return (
    m.includes('temporarily unavailable') ||
    m.includes('supply_unavailable') ||
    m.includes('service is temporarily') ||
    m.includes('model service') ||
    m.includes('capacity') ||
    m.includes('overloaded') ||
    m.includes('rate limit') ||
    m.includes('too many requests') ||
    m.includes('quota') ||
    m.includes('no available') ||
    m.includes('服务暂不可用') ||
    m.includes('暂时不可用') ||
    m.includes('容量不足') ||
    m.includes('429') ||
    m.includes('503') ||
    m.includes('502')
  );
}

export interface KieSeedanceCreateInput {
  apiKey: string;
  prompt: string;
  /** Public HTTPS or data:image URLs for face / subject refs. */
  imageUrls: string[];
  /** Optional public HTTPS MP4 URLs (motion template). Omit for pure i2v. */
  videoUrls?: string[];
  /** Optional public HTTPS audio URLs (BGM). */
  audioUrls?: string[];
  aspectRatio?: string;
  resolution?: string;
  duration?: number;
  generateAudio?: boolean;
  model?: string;
}

export interface KieSeedanceTaskResult {
  id: string;
  status: string;
  model?: string;
  videoUrl?: string | null;
  error?: string | null;
  raw?: any;
}

function authHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function readJson(resp: Response): Promise<any> {
  const text = await resp.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Kie API returned non-JSON (${resp.status}): ${text.slice(0, 200)}`
    );
  }
}

function extractErrorMessage(body: any, status: number): string {
  if (!body || typeof body !== 'object') {
    return `Kie API request failed (${status})`;
  }
  if (typeof body.msg === 'string' && body.msg) return body.msg;
  if (typeof body.message === 'string' && body.message) return body.message;
  if (body.error && typeof body.error.message === 'string') {
    return body.error.message;
  }
  if (typeof body.error === 'string' && body.error) return body.error;
  return `Kie API request failed (${status})`;
}

/** File upload host (docs.kie.ai/file-upload-api). */
export const KIE_FILE_UPLOAD_BASE = 'https://kieai.redpandaai.co';

/**
 * Upload a data:image (or raw base64) to Kie tempfile CDN.
 * Returns a public HTTPS downloadUrl (kept ~24h). Free; no generation credits.
 */
export async function uploadKieBase64File(input: {
  apiKey: string;
  base64Data: string;
  fileName?: string;
  uploadPath?: string;
}): Promise<string> {
  const { apiKey, base64Data, fileName, uploadPath = 'shan-shen-bu/refs' } =
    input;
  if (!apiKey) throw new Error('KIE_API_KEY is not configured');
  if (!base64Data?.trim()) throw new Error('base64Data is required');

  const resp = await fetch(`${KIE_FILE_UPLOAD_BASE}/api/file-base64-upload`, {
    method: 'POST',
    headers: authHeaders(apiKey),
    body: JSON.stringify({
      base64Data: base64Data.trim(),
      uploadPath,
      ...(fileName ? { fileName } : {}),
    }),
  });

  const json = await readJson(resp);
  const code = json?.code;
  const ok =
    resp.ok &&
    (json?.success === true || code === 200 || code === undefined) &&
    json?.data?.downloadUrl;
  if (!ok) {
    throw new Error(
      extractErrorMessage(json, resp.status) || 'Kie file upload failed'
    );
  }
  const url = json.data.downloadUrl;
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
    throw new Error('Kie file upload returned no downloadUrl');
  }
  return url;
}

function isDataImageUrl(value: string): boolean {
  return /^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(value);
}

/**
 * Ensure every image is a public HTTPS URL for createTask.
 * data:image URLs are uploaded to Kie tempfile CDN; http(s) URLs pass through.
 */
export async function ensureKiePublicImageUrls(input: {
  apiKey: string;
  imageUrls: string[];
  uploadPath?: string;
}): Promise<string[]> {
  const { apiKey, imageUrls, uploadPath } = input;
  const out: string[] = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const u = imageUrls[i];
    if (typeof u !== 'string' || !u.trim()) {
      throw new Error(`imageUrls[${i}] is empty`);
    }
    const trimmed = u.trim();
    if (isDataImageUrl(trimmed)) {
      const extMatch = /^data:image\/([a-zA-Z0-9.+-]+);base64,/i.exec(trimmed);
      const ext = (extMatch?.[1] || 'jpeg').toLowerCase().replace('jpeg', 'jpg');
      out.push(
        await uploadKieBase64File({
          apiKey,
          base64Data: trimmed,
          fileName: `ref-${i + 1}.${ext === 'jpg' ? 'jpg' : ext}`,
          uploadPath,
        })
      );
    } else if (/^https?:\/\//i.test(trimmed)) {
      out.push(trimmed);
    } else {
      throw new Error(
        `imageUrls[${i}] must be https or data:image/...;base64 (got ${trimmed.slice(0, 32)}…)`
      );
    }
  }
  return out;
}

/**
 * Create a bytedance/seedance-2-fast job via POST /jobs/createTask.
 * Pure i2v when only imageUrls are set; video/audio refs are optional.
 */
export async function createKieSeedanceTask(
  input: KieSeedanceCreateInput
): Promise<{ id: string; model: string; raw: any }> {
  const {
    apiKey,
    prompt,
    imageUrls,
    videoUrls,
    audioUrls,
    aspectRatio = '9:16',
    resolution = '720p',
    duration = 15,
    generateAudio = true,
    model = KIE_SEEDANCE_2_FAST_MODEL,
  } = input;

  if (!apiKey) throw new Error('KIE_API_KEY is not configured');
  if (!prompt?.trim()) throw new Error('prompt is required');
  if (!imageUrls?.[0]) {
    throw new Error('at least one reference image is required');
  }

  // data:image URLs make createTask fail with 500 "Server exception" —
  // upload to Kie tempfile CDN first.
  const reference_image_urls = await ensureKiePublicImageUrls({
    apiKey,
    imageUrls: imageUrls.filter((u) => typeof u === 'string' && u.trim()),
  });
  const reference_video_urls = Array.isArray(videoUrls)
    ? videoUrls
        .filter((u) => typeof u === 'string' && u.trim())
        .map((u) => u.trim())
    : [];
  const reference_audio_urls = Array.isArray(audioUrls)
    ? audioUrls
        .filter((u) => typeof u === 'string' && u.trim())
        .map((u) => u.trim())
    : [];

  const clampedDuration = Math.min(
    Math.max(4, Math.round(duration)),
    KIE_SEEDANCE_2_FAST_MAX_DURATION
  );

  const inputBody: Record<string, unknown> = {
    prompt: prompt.trim(),
    reference_image_urls,
    aspect_ratio: aspectRatio,
    resolution,
    duration: clampedDuration,
    generate_audio: generateAudio,
    web_search: false,
    nsfw_checker: false,
  };
  // Only send optional refs when present (aizombie i2v has no motion template).
  if (reference_video_urls.length > 0) {
    inputBody.reference_video_urls = reference_video_urls;
  }
  if (reference_audio_urls.length > 0) {
    inputBody.reference_audio_urls = reference_audio_urls;
  }

  const payload = {
    model,
    input: inputBody,
  };

  const resp = await fetch(`${KIE_API_BASE}/jobs/createTask`, {
    method: 'POST',
    headers: authHeaders(apiKey),
    body: JSON.stringify(payload),
  });

  const json = await readJson(resp);
  if (!resp.ok) {
    throw new Error(extractErrorMessage(json, resp.status));
  }

  const code = json?.code;
  if (code !== undefined && code !== 200) {
    throw new Error(extractErrorMessage(json, resp.status));
  }

  const id =
    json?.data?.taskId ||
    json?.data?.task_id ||
    json?.taskId ||
    json?.task_id;
  if (!id || typeof id !== 'string') {
    throw new Error('Kie createTask succeeded but returned no taskId');
  }

  return { id, model, raw: json };
}

/**
 * Poll GET /jobs/recordInfo?taskId=…
 */
export async function getKieSeedanceTask({
  apiKey,
  taskId,
}: {
  apiKey: string;
  taskId: string;
}): Promise<KieSeedanceTaskResult> {
  if (!apiKey) throw new Error('KIE_API_KEY is not configured');
  if (!taskId) throw new Error('taskId is required');

  const resp = await fetch(
    `${KIE_API_BASE}/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
    { method: 'GET', headers: authHeaders(apiKey) }
  );

  const json = await readJson(resp);
  if (!resp.ok) {
    throw new Error(extractErrorMessage(json, resp.status));
  }

  const code = json?.code;
  if (code !== undefined && code !== 200) {
    throw new Error(extractErrorMessage(json, resp.status));
  }

  const data = json?.data || json;
  const state = String(data?.state || data?.status || 'unknown').toLowerCase();

  let videoUrl: string | null = null;
  if (data?.resultJson) {
    try {
      const parsed =
        typeof data.resultJson === 'string'
          ? JSON.parse(data.resultJson)
          : data.resultJson;
      const urls = parsed?.resultUrls;
      if (Array.isArray(urls) && typeof urls[0] === 'string') {
        videoUrl = urls[0];
      }
    } catch {
      // ignore parse errors; treat as no URL yet
    }
  }
  if (!videoUrl && Array.isArray(data?.response?.resultUrls)) {
    const u = data.response.resultUrls[0];
    if (typeof u === 'string') videoUrl = u;
  }

  const failMsg =
    (typeof data?.failMsg === 'string' && data.failMsg) ||
    (typeof data?.failMessage === 'string' && data.failMessage) ||
    null;

  return {
    id: data?.taskId || taskId,
    status: state,
    model: data?.model || KIE_SEEDANCE_2_FAST_MODEL,
    videoUrl,
    error:
      state === 'fail' || state === 'failed'
        ? failMsg || 'Generation failed'
        : null,
    raw: data,
  };
}

export function mapKieSeedanceStatus(
  status: string
): 'pending' | 'processing' | 'success' | 'failed' {
  const s = status.toLowerCase();
  if (s === 'success' || s === 'succeeded') return 'success';
  if (s === 'fail' || s === 'failed') return 'failed';
  if (s === 'generating' || s === 'processing' || s === 'running') {
    return 'processing';
  }
  // waiting / queuing / pending
  return 'pending';
}

export function isKieSeedanceSuccess(status: string): boolean {
  const s = status.toLowerCase();
  return s === 'success' || s === 'succeeded';
}
