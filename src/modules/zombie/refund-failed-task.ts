import { and, desc, eq } from 'drizzle-orm';

import { aiTask, credit } from '@/config/db/schema';
import { db } from '@/core/db';
import {
  CreditStatus,
  CreditTransactionType,
  revoke,
} from '@/modules/credits/service';

export type RefundFailedResult = {
  refunded: boolean;
  creditId: string | null;
  reason:
    | 'refunded'
    | 'already_refunded'
    | 'no_credit'
    | 'task_success'
    | 'error';
};

function parseTaskInfo(raw: string | null | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * Idempotent credit restore when upstream generation fails after create
 * (copyright, model error, etc.). Create-time failures already revoke in
 * /api/zombie/generate; this covers poll-time failures.
 */
export async function refundCreditsForFailedTask(opts: {
  taskId: string;
  /** Optional client-supplied consume id from generate response (backup). */
  creditIdHint?: string | null;
}): Promise<RefundFailedResult> {
  const taskId = opts.taskId?.trim();
  if (!taskId) {
    return { refunded: false, creditId: null, reason: 'no_credit' };
  }

  try {
    let creditId: string | null =
      typeof opts.creditIdHint === 'string' && opts.creditIdHint.trim()
        ? opts.creditIdHint.trim()
        : null;
    let rowId: string | null = null;
    let taskInfo: Record<string, unknown> = {};

    try {
      const [row] = await db()
        .select()
        .from(aiTask)
        .where(eq(aiTask.taskId, taskId))
        .orderBy(desc(aiTask.createdAt))
        .limit(1);
      if (row) {
        rowId = row.id;
        taskInfo = parseTaskInfo(row.taskInfo);
        if (row.creditId) creditId = row.creditId;
        if (row.status === 'success') {
          return { refunded: false, creditId, reason: 'task_success' };
        }
        if (taskInfo.creditsRefunded === true) {
          return { refunded: false, creditId, reason: 'already_refunded' };
        }
      }
    } catch (e) {
      console.warn('[refund-failed-task] ai_task lookup failed:', e);
    }

    if (!creditId) {
      return { refunded: false, creditId: null, reason: 'no_credit' };
    }

    const [consumeRecord] = await db()
      .select({ id: credit.id, status: credit.status })
      .from(credit)
      .where(
        and(
          eq(credit.id, creditId),
          eq(credit.transactionType, CreditTransactionType.CONSUME)
        )
      )
      .limit(1);

    if (!consumeRecord) {
      return { refunded: false, creditId, reason: 'no_credit' };
    }
    if (consumeRecord.status !== CreditStatus.ACTIVE) {
      if (rowId) {
        try {
          await db()
            .update(aiTask)
            .set({
              status: 'failed',
              taskInfo: JSON.stringify({
                ...taskInfo,
                creditId,
                creditsRefunded: true,
                refundedAt: new Date().toISOString(),
              }),
              updatedAt: new Date(),
            })
            .where(eq(aiTask.id, rowId));
        } catch {}
      }
      return { refunded: false, creditId, reason: 'already_refunded' };
    }

    await revoke(creditId);

    if (rowId) {
      try {
        await db()
          .update(aiTask)
          .set({
            status: 'failed',
            taskInfo: JSON.stringify({
              ...taskInfo,
              creditId,
              creditsRefunded: true,
              refundedAt: new Date().toISOString(),
            }),
            updatedAt: new Date(),
          })
          .where(eq(aiTask.id, rowId));
      } catch (e) {
        console.warn('[refund-failed-task] ai_task update failed:', e);
      }
    }

    return { refunded: true, creditId, reason: 'refunded' };
  } catch (e) {
    console.error('[refund-failed-task] error:', e);
    return { refunded: false, creditId: null, reason: 'error' };
  }
}
