import { createFileRoute } from '@tanstack/react-router';
import { desc, eq } from 'drizzle-orm';

import { envConfigs } from '@/config';
import { aiTask } from '@/config/db/schema';
import { db } from '@/core/db';
import {
  getKieSeedanceTask,
  isKieSeedanceSuccess,
  KIE_PROVIDER,
  mapKieSeedanceStatus,
} from '@/core/ai/kie-seedance';
import {
  getSeedanceTask,
  isSuccessStatus,
  mapTryAllStatus,
} from '@/core/ai/tryallapi';
import { refundCreditsForFailedTask } from '@/modules/zombie/refund-failed-task';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

type VideoProvider = typeof KIE_PROVIDER | 'tryallapi';

/** Kie createTask returns 32-char hex ids (not task_*). */
function looksLikeKieTaskId(taskId: string): boolean {
  return (
    /^[a-f0-9]{32}$/i.test(taskId) ||
    /^task[_-]/i.test(taskId) ||
    taskId.toLowerCase().includes('bytedance')
  );
}

function isTaskMissingMessage(message: string): boolean {
  const m = (message || '').toLowerCase();
  return (
    m.includes('task_not_exist') ||
    m.includes('task not exist') ||
    m.includes('task not found') ||
    m.includes('not found') ||
    m.includes('does not exist')
  );
}

function isCopyrightMessage(message: string): boolean {
  const m = (message || '').toLowerCase();
  return (
    m.includes('copyright') ||
    m.includes('版权') ||
    m.includes('replace the material')
  );
}

async function resolveProvider(
  taskId: string,
  hint: string | null
): Promise<VideoProvider> {
  if (hint === KIE_PROVIDER || hint === 'kie.ai') {
    return KIE_PROVIDER;
  }
  if (hint === 'tryallapi' || hint === 'seedance') {
    return 'tryallapi';
  }

  try {
    const [row] = await db()
      .select({ provider: aiTask.provider })
      .from(aiTask)
      .where(eq(aiTask.taskId, taskId))
      .orderBy(desc(aiTask.createdAt))
      .limit(1);
    if (row?.provider === KIE_PROVIDER || row?.provider === 'kie.ai') {
      return KIE_PROVIDER;
    }
    if (row?.provider === 'tryallapi' || row?.provider === 'seedance') {
      return 'tryallapi';
    }
  } catch (e) {
    console.warn('zombie task provider lookup failed:', e);
  }

  // No DB row / hint — Kie hex ids must not fall through to TryAll.
  if (looksLikeKieTaskId(taskId)) {
    return KIE_PROVIDER;
  }
  return 'tryallapi';
}

async function withFailureRefund(opts: {
  taskId: string;
  creditIdHint: string | null;
  payload: Record<string, unknown>;
}) {
  const status = opts.payload.status;
  if (status !== 'failed') {
    return respData(opts.payload);
  }

  const refund = await refundCreditsForFailedTask({
    taskId: opts.taskId,
    creditIdHint: opts.creditIdHint,
  });

  const err =
    typeof opts.payload.error === 'string' ? opts.payload.error : '';
  let userError = err || 'Generation failed';
  if (isCopyrightMessage(userError)) {
    userError = refund.refunded
      ? 'Input image may have copyright restrictions. Credits restored — replace the photo and tap Create (no need to pay again).'
      : 'Input image may have copyright restrictions. Please replace the photo and try again.';
  } else if (refund.refunded) {
    userError = `${userError} Credits restored — tap Create to retry (no need to pay again).`;
  }

  return respData({
    ...opts.payload,
    error: userError,
    creditsRefunded: refund.refunded,
    refundReason: refund.reason,
  });
}

async function pollKie(
  taskId: string,
  creditIdHint: string | null
) {
  const apiKey = envConfigs.kie_api_key;
  if (!apiKey) {
    return respErr(
      'Kie video generation is not configured (missing API key)',
      { status: 503 }
    );
  }

  const task = await getKieSeedanceTask({ apiKey, taskId });
  const mapped = mapKieSeedanceStatus(task.status);

  return withFailureRefund({
    taskId,
    creditIdHint,
    payload: {
      taskId: task.id,
      status: mapped,
      providerStatus: task.status,
      provider: KIE_PROVIDER,
      videoUrl: isKieSeedanceSuccess(task.status) ? task.videoUrl || null : null,
      error:
        mapped === 'failed' ? task.error || `Generation ${task.status}` : null,
      resolution: null,
      ratio: null,
      duration: null,
    },
  });
}

async function pollTryAll(taskId: string, creditIdHint: string | null) {
  const apiKey = envConfigs.tryallapi_api_key;
  if (!apiKey) {
    return respErr('Video generation is not configured (missing API key)', {
      status: 503,
    });
  }

  const task = await getSeedanceTask({ apiKey, taskId });
  const mapped = mapTryAllStatus(task.status);
  const videoUrl = task.content?.video_url || null;

  let errorMessage: string | null = null;
  if (task.error) {
    errorMessage =
      typeof task.error === 'string'
        ? task.error
        : task.error.message || task.error.code || 'Generation failed';
  } else if (mapped === 'failed') {
    errorMessage = `Generation ${task.status}`;
  }

  return withFailureRefund({
    taskId,
    creditIdHint,
    payload: {
      taskId: task.id,
      status: mapped,
      providerStatus: task.status,
      provider: 'tryallapi',
      videoUrl: isSuccessStatus(task.status) ? videoUrl : null,
      error: errorMessage,
      resolution: task.resolution ?? null,
      ratio: task.ratio ?? null,
      duration: task.duration ?? null,
    },
  });
}

async function GET({
  request,
  params,
}: {
  request: Request;
  params: { taskId: string };
}) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 1_500,
    keyPrefix: 'zombie-task-poll',
  });
  if (limited) return limited;

  try {
    const taskId = params.taskId?.trim();
    if (!taskId || taskId.length > 128 || !/^[\w.-]+$/.test(taskId)) {
      return respErr('Invalid taskId');
    }

    const url = new URL(request.url);
    const providerHint = url.searchParams.get('provider');
    const creditIdHint = url.searchParams.get('creditId');
    const provider = await resolveProvider(taskId, providerHint);

    if (provider === KIE_PROVIDER) {
      return await pollKie(taskId, creditIdHint);
    }

    try {
      return await pollTryAll(taskId, creditIdHint);
    } catch (tryallErr: any) {
      const msg = tryallErr?.message || String(tryallErr);
      // Wrong-provider safety net: Kie hex id polled as TryAll → retry Kie.
      if (
        envConfigs.kie_api_key &&
        isTaskMissingMessage(msg) &&
        providerHint !== 'tryallapi' &&
        providerHint !== 'seedance'
      ) {
        console.warn(
          '[zombie/tasks] TryAll task_not_exist — retrying as Kie:',
          taskId
        );
        return await pollKie(taskId, creditIdHint);
      }
      throw tryallErr;
    }
  } catch (e: any) {
    console.error('zombie task poll failed:', e?.message || e);
    return respErr(e?.message || 'Failed to query task', { status: 502 });
  }
}

export const Route = createFileRoute('/api/zombie/tasks/$taskId')({
  server: {
    handlers: { GET },
  },
});
