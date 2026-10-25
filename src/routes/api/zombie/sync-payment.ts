import { and, eq, isNull } from 'drizzle-orm';
import { createFileRoute } from '@tanstack/react-router';

import { order } from '@/config/db/schema';
import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { getBalance } from '@/modules/credits/service';
import { createGuestSessionCookie } from '@/modules/zombie/guest';
import { handlePaymentCallback } from '@/modules/payment/service';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

/**
 * POST /api/zombie/sync-payment
 * Body: { session_id: string }
 *
 * After Stripe success redirect (?paid=1&session_id=...), the browser calls
 * this to (1) ensure the order is marked paid + credits granted even if the
 * webhook is slow, and (2) ensure a session cookie exists for guests.
 */
async function POST({ request }: { request: Request }) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 1000,
    keyPrefix: 'zombie-sync-payment',
  });
  if (limited) return limited;

  try {
    const body = await request.json().catch(() => ({}));
    const sessionId =
      typeof body.session_id === 'string' ? body.session_id.trim() : '';
    if (!sessionId || !sessionId.startsWith('cs_')) {
      return respErr('Missing or invalid session_id');
    }

    const [existingOrder] = await db()
      .select()
      .from(order)
      .where(
        and(eq(order.paymentSessionId, sessionId), isNull(order.deletedAt))
      )
      .limit(1);

    if (!existingOrder) {
      return respErr('Order not found for session', { status: 404 });
    }

    // Drive the same success path as the webhook (idempotent).
    try {
      await handlePaymentCallback(existingOrder.orderNo);
    } catch (e: any) {
      console.warn('sync-payment callback:', e?.message || e);
    }

    const [fresh] = await db()
      .select()
      .from(order)
      .where(eq(order.id, existingOrder.id))
      .limit(1);

    const auth = getAuth();
    let session = await auth.api.getSession({ headers: request.headers });
    const headers = new Headers();

    if (!session?.user && fresh?.userId) {
      const minted = await createGuestSessionCookie({
        userId: fresh.userId,
        request,
      });
      headers.append('Set-Cookie', minted.setCookie);
      // Re-read not needed; cookie is for subsequent requests.
    }

    const userId = session?.user?.id || fresh?.userId;
    const balance = userId ? await getBalance(userId) : 0;

    return respData(
      {
        status: fresh?.status || existingOrder.status,
        paid: (fresh?.status || existingOrder.status) === 'paid',
        balance,
        creditsGranted: fresh?.creditsAmount ?? existingOrder.creditsAmount,
        productId: fresh?.productId || existingOrder.productId,
      },
      { headers }
    );
  } catch (error: any) {
    console.error('zombie sync-payment error:', error);
    return respErr(error?.message || 'Sync failed');
  }
}

export const Route = createFileRoute('/api/zombie/sync-payment')({
  server: {
    handlers: { POST },
  },
});
