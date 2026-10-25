/**
 * Cross-site paid-credit federation for niche face-swap Workers that share
 * seedream-studio-db with different table prefixes (bb_/hl_/rd_/rsd_/aod_/cm_/cgt_/ssb_/hih_/fr_/bt_/vc_/tc_/cmi_).
 *
 * Join key: lower(email) on each prefix's user row (Google / verified email).
 * Cookie SSO across different apex TLDs is impossible; soft identity = same email.
 *
 * Default OFF. Enable with Worker var/secret:
 *   CROSS_SITE_CREDITS_ENABLED=true
 * Optional:
 *   CROSS_SITE_CREDITS_SCENES=payment,subscription,renewal
 *   CROSS_SITE_CREDITS_REQUIRE_VERIFIED=true  (default)
 *
 * Does NOT touch order tables or Stripe fulfillment. Only moves remaining_credits
 * on grant rows whose transaction_scene is in the paid allowlist.
 * Guest placeholder emails (*@aizombie.app guest_/temp-) are never federated.
 *
 * zombiehug / aizombie uses a separate D1 (maynorai-research-db) — out of scope
 * for this in-process pull; needs a Phase-2 HTTP bridge.
 */

import { TABLE_PREFIX } from '@/config/db/table-prefix';
import { getD1Binding } from '@/core/db/d1';
import { getSnowId, getUuid } from '@/lib/hash';
import { serverEnv } from '@/lib/server-env';

/** Niche face-swap prefixes on seedream-studio-db (exclude inkdoo_/xs_/zh_). */
export const CROSS_SITE_CREDIT_PREFIXES = [
  'bb_',
  'hl_',
  'rd_',
  'rsd_',
  'aod_',
  'cm_',
  'cgt_',
  'ssb_',
  'hih_',
  'fr_',
  'bt_',
  'vc_',
  'tc_',
  'cmi_',
  'ssb_',
  'rl_',
  'ak_',
  'bwg_',
  'ckc_',
  'dwp_',
  'eo_',
  'tb_',
  'cb_',
  'wc_',
  'vm_',
  'wys_',
  'cai_',
] as const;

const DEFAULT_PAID_SCENES = ['payment', 'subscription', 'renewal'] as const;
const GUEST_EMAIL_DOMAIN = 'aizombie.app';

export type CrossSitePullResult = {
  enabled: boolean;
  pulled: number;
  from: Array<{ prefix: string; amount: number }>;
  skippedReason?: string;
};

function truthy(v: string): boolean {
  const s = v.trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes' || s === 'on';
}

export function isLocalPrefixInFederation(): boolean {
  return (CROSS_SITE_CREDIT_PREFIXES as readonly string[]).includes(
    TABLE_PREFIX
  );
}

export function isCrossSiteCreditsEnabled(): boolean {
  // Never run on Workers bound to a different D1 (e.g. zombiehug zh_).
  if (!isLocalPrefixInFederation()) return false;
  return truthy(serverEnv('CROSS_SITE_CREDITS_ENABLED'));
}

function requireVerified(): boolean {
  const raw = serverEnv('CROSS_SITE_CREDITS_REQUIRE_VERIFIED');
  if (!raw) return true;
  return truthy(raw);
}

function paidScenes(): string[] {
  const raw = serverEnv('CROSS_SITE_CREDITS_SCENES').trim();
  if (!raw) return [...DEFAULT_PAID_SCENES];
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isGuestPlaceholderEmail(
  email: string | null | undefined
): boolean {
  if (!email) return true;
  const e = email.trim().toLowerCase();
  return (
    e.endsWith(`@${GUEST_EMAIL_DOMAIN}`) &&
    (e.startsWith('guest_') || e.startsWith('temp-'))
  );
}

function siblingPrefixes(): string[] {
  const local = TABLE_PREFIX;
  return CROSS_SITE_CREDIT_PREFIXES.filter((p) => p !== local);
}

function nowMs(): number {
  return Date.now();
}

type D1Row = Record<string, unknown>;

async function d1All<T extends D1Row>(
  sql: string,
  binds: unknown[] = []
): Promise<T[]> {
  const binding = getD1Binding();
  const stmt = binding.prepare(sql);
  const bound = binds.length ? stmt.bind(...binds) : stmt;
  const res = await bound.all();
  return (res?.results || []) as T[];
}

async function d1Run(
  sql: string,
  binds: unknown[] = []
): Promise<{ changes: number }> {
  const binding = getD1Binding();
  const stmt = binding.prepare(sql);
  const bound = binds.length ? stmt.bind(...binds) : stmt;
  const res = await bound.run();
  const changes = Number(res?.meta?.changes ?? res?.changes ?? 0) || 0;
  return { changes };
}

async function d1Batch(
  statements: Array<{ sql: string; binds?: unknown[] }>
): Promise<void> {
  if (statements.length === 0) return;
  const binding = getD1Binding();
  const prepared = statements.map(({ sql, binds }) => {
    const stmt = binding.prepare(sql);
    return binds && binds.length ? stmt.bind(...binds) : stmt;
  });
  await binding.batch(prepared);
}

/**
 * Look up local user email + verified flag when callers only have userId.
 */
export async function resolveLocalUserEmail(userId: string): Promise<{
  email: string;
  emailVerified: boolean;
} | null> {
  const prefix = TABLE_PREFIX;
  const rows = await d1All<{ email: string; email_verified: number | boolean }>(
    `SELECT email, email_verified FROM ${prefix}user WHERE id = ? LIMIT 1`,
    [userId]
  );
  const row = rows[0];
  if (!row?.email) return null;
  return {
    email: String(row.email).trim().toLowerCase(),
    emailVerified: Boolean(row.email_verified),
  };
}

/**
 * Read-only: sum remaining paid credits for this email on sibling prefixes.
 */
export async function peekSiblingPaidBalance(email: string): Promise<number> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || isGuestPlaceholderEmail(normalized)) return 0;
  const scenes = paidScenes();
  const scenePlaceholders = scenes.map(() => '?').join(',');
  const now = nowMs();
  let total = 0;

  for (const prefix of siblingPrefixes()) {
    const rows = await d1All<{ bal: number | string | null }>(
      `SELECT COALESCE(SUM(c.remaining_credits), 0) AS bal
       FROM ${prefix}credit c
       INNER JOIN ${prefix}user u ON u.id = c.user_id
       WHERE lower(u.email) = ?
         AND c.transaction_type = 'grant'
         AND c.status = 'active'
         AND c.remaining_credits > 0
         AND (c.expires_at IS NULL OR c.expires_at > ?)
         AND lower(COALESCE(c.transaction_scene, '')) IN (${scenePlaceholders})
         AND (c.deleted_at IS NULL)`,
      [normalized, now, ...scenes]
    );
    total += parseInt(String(rows[0]?.bal ?? '0'), 10) || 0;
  }
  return total;
}

type RemoteGrant = {
  id: string;
  user_id: string;
  remaining_credits: number;
  expires_at: number | null;
  order_no: string | null;
  subscription_no: string | null;
  transaction_scene: string | null;
  description: string | null;
};

/**
 * Pull paid remaining credits from sibling prefixes into the local wallet.
 * Safe defaults: guests skipped; unverified emails skipped unless env disables
 * that check; only paid scenes; optimistic lock on remaining_credits BEFORE
 * inserting the local grant (prevents double-credit on race).
 */
export async function pullSiblingPaidCredits(params: {
  localUserId: string;
  email?: string | null;
  emailVerified?: boolean;
}): Promise<CrossSitePullResult> {
  if (!isCrossSiteCreditsEnabled()) {
    return { enabled: false, pulled: 0, from: [], skippedReason: 'disabled' };
  }

  let email = (params.email || '').trim().toLowerCase();
  let verified = params.emailVerified;
  if (!email || verified === undefined) {
    const local = await resolveLocalUserEmail(params.localUserId);
    if (!local) {
      return {
        enabled: true,
        pulled: 0,
        from: [],
        skippedReason: 'local_user_missing',
      };
    }
    if (!email) email = local.email;
    if (verified === undefined) verified = local.emailVerified;
  }

  if (!email || isGuestPlaceholderEmail(email)) {
    return {
      enabled: true,
      pulled: 0,
      from: [],
      skippedReason: 'guest_or_empty_email',
    };
  }

  if (requireVerified() && !verified) {
    return {
      enabled: true,
      pulled: 0,
      from: [],
      skippedReason: 'email_unverified',
    };
  }

  const scenes = paidScenes();
  const scenePlaceholders = scenes.map(() => '?').join(',');
  const now = nowMs();
  const localPrefix = TABLE_PREFIX;
  const from: Array<{ prefix: string; amount: number }> = [];
  let pulled = 0;

  for (const prefix of siblingPrefixes()) {
    const remoteUsers = await d1All<{ id: string; email_verified: number }>(
      `SELECT id, email_verified FROM ${prefix}user WHERE lower(email) = ? LIMIT 1`,
      [email]
    );
    const remoteUser = remoteUsers[0];
    if (!remoteUser) continue;
    if (requireVerified() && !remoteUser.email_verified) continue;

    const grants = await d1All<RemoteGrant>(
      `SELECT id, user_id, remaining_credits, expires_at, order_no, subscription_no,
              transaction_scene, description
       FROM ${prefix}credit
       WHERE user_id = ?
         AND transaction_type = 'grant'
         AND status = 'active'
         AND remaining_credits > 0
         AND (expires_at IS NULL OR expires_at > ?)
         AND lower(COALESCE(transaction_scene, '')) IN (${scenePlaceholders})
         AND (deleted_at IS NULL)
       ORDER BY expires_at IS NULL, expires_at ASC`,
      [remoteUser.id, now, ...scenes]
    );

    let prefixPulled = 0;
    for (const grant of grants) {
      const amount = Number(grant.remaining_credits) || 0;
      if (amount <= 0) continue;

      try {
        // 1) Optimistic lock FIRST — never mint local credits unless we took them.
        const lock = await d1Run(
          `UPDATE ${prefix}credit
           SET remaining_credits = 0, updated_at = ?
           WHERE id = ? AND remaining_credits = ? AND status = 'active'`,
          [now, grant.id, amount]
        );
        if (lock.changes !== 1) continue;

        const localGrantId = getUuid();
        const localTxn = getSnowId();
        const remoteConsumeId = getUuid();
        const remoteTxn = getSnowId();
        const meta = JSON.stringify({
          cross_site: true,
          from_prefix: prefix,
          from_credit_id: grant.id,
          from_user_id: grant.user_id,
          to_prefix: localPrefix,
          to_user_id: params.localUserId,
        });

        // 2) Audit consume on source + grant on local (same batch).
        await d1Batch([
          {
            sql: `INSERT INTO ${prefix}credit (
                    id, user_id, user_email, order_no, subscription_no, transaction_no,
                    transaction_type, transaction_scene, credits, remaining_credits,
                    description, expires_at, status, created_at, updated_at, deleted_at,
                    consumed_detail, metadata
                  ) VALUES (?, ?, ?, '', '', ?, 'consume', 'cross_site_transfer_out', ?, 0, ?, NULL, 'active', ?, ?, NULL, ?, ?)`,
            binds: [
              remoteConsumeId,
              grant.user_id,
              email,
              remoteTxn,
              -amount,
              `Cross-site transfer out → ${localPrefix}`,
              now,
              now,
              JSON.stringify([
                {
                  creditId: grant.id,
                  creditsConsumed: amount,
                  creditsBefore: amount,
                  creditsAfter: 0,
                },
              ]),
              meta,
            ],
          },
          {
            sql: `INSERT INTO ${localPrefix}credit (
                    id, user_id, user_email, order_no, subscription_no, transaction_no,
                    transaction_type, transaction_scene, credits, remaining_credits,
                    description, expires_at, status, created_at, updated_at, deleted_at,
                    consumed_detail, metadata
                  ) VALUES (?, ?, ?, ?, ?, ?, 'grant', 'cross_site_transfer', ?, ?, ?, ?, 'active', ?, ?, NULL, NULL, ?)`,
            binds: [
              localGrantId,
              params.localUserId,
              email,
              grant.order_no || '',
              grant.subscription_no || '',
              localTxn,
              amount,
              amount,
              `Cross-site transfer in from ${prefix}${
                grant.description ? `: ${grant.description}` : ''
              }`,
              grant.expires_at,
              now,
              now,
              meta,
            ],
          },
        ]);

        prefixPulled += amount;
        pulled += amount;
      } catch (err) {
        console.error(
          `[cross-site-credits] pull failed prefix=${prefix} grant=${grant.id}`,
          err
        );
        // If lock succeeded but inserts failed, remaining is 0 on source —
        // leave a loud log; ops can restore from metadata. Do not re-mint.
      }
    }

    if (prefixPulled > 0) {
      from.push({ prefix, amount: prefixPulled });
    }
  }

  if (pulled > 0) {
    console.log(
      `[cross-site-credits] pulled ${pulled} into ${localPrefix} for ${email}`,
      from
    );
  }

  return { enabled: true, pulled, from };
}

/**
 * Ensure local wallet has absorbed sibling paid balances (no-op when disabled).
 */
export async function ensureCrossSiteCredits(params: {
  userId: string;
  email?: string | null;
  emailVerified?: boolean;
}): Promise<CrossSitePullResult> {
  return pullSiblingPaidCredits({
    localUserId: params.userId,
    email: params.email,
    emailVerified: params.emailVerified,
  });
}
