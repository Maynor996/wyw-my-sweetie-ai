import handler from '@tanstack/react-start/server-entry';

import { getCookieFromHeader } from './lib/cookie';
import {
  deriveUtmFromReferrerHost,
  hostFromReferrerUrl,
  isIgnoredReferrerHost,
  sanitizeReferrerValue,
  sanitizeUtmValue,
} from './modules/zombie/attribution';
import { paraglideMiddleware } from './paraglide/server.js';

const CF_WORKERS_MODULE = 'cloudflare:workers';
let cfEnvPromise: Promise<void> | null = null;

function ensureCloudflareEnv(): Promise<void> {
  if (!cfEnvPromise) {
    cfEnvPromise = import(/* @vite-ignore */ CF_WORKERS_MODULE)
      .then((mod) => {
        (globalThis as any).__CF_ENV__ = mod.env;
        if (mod.env && typeof process !== 'undefined' && process.env) {
          for (const [key, value] of Object.entries(mod.env)) {
            if (typeof value === 'string' && !process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      })
      .catch(() => {
        // Not running on Cloudflare Workers — nothing to stash.
      });
  }
  return cfEnvPromise;
}

const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://plausible.io https://client.crisp.chat https://embed.tawk.to",
    "style-src 'self' 'unsafe-inline' https://client.crisp.chat",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://www.google-analytics.com https://www.googletagmanager.com https://plausible.io https://client.crisp.chat wss://client.relay.crisp.chat https://embed.tawk.to wss://*.tawk.to https://*.googleapis.com https://*.cloudflare.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://www.googletagmanager.com https://tawk.to https://*.tawk.to",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com https://hooks.stripe.com",
    'upgrade-insecure-requests',
  ].join('; '),
};

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function appTargetOrigin(): URL | null {
  const appUrl =
    (globalThis as any).__CF_ENV__?.VITE_APP_URL ||
    (globalThis as any).__CF_ENV__?.APP_URL ||
    (typeof process !== 'undefined'
      ? process.env.VITE_APP_URL || process.env.APP_URL
      : '') ||
    'https://shanshenbuai.cc';
  try {
    return new URL(appUrl);
  } catch {
    return null;
  }
}

/** Force HTTPS + www → apex (canonical host). */
function canonicalRedirect(req: Request): Response | null {
  const target = appTargetOrigin();
  if (!target) return null;

  const url = new URL(req.url);
  const host = url.hostname.toLowerCase();
  const forwarded = (req.headers.get('x-forwarded-proto') || '').toLowerCase();
  const cfVisitor = req.headers.get('cf-visitor') || '';
  const isHttp =
    url.protocol === 'http:' ||
    forwarded === 'http' ||
    /"scheme"\s*:\s*"http"/i.test(cfVisitor);

  // www → apex and/or http → https
  if (isHttp || host === `www.${target.hostname}`) {
    const location = `${target.origin}${url.pathname}${url.search}`;
    const isGet = req.method === 'GET' || req.method === 'HEAD';
    return new Response(null, {
      status: isGet ? 301 : 308,
      headers: { Location: location },
    });
  }
  return null;
}

export default {
  async fetch(req: Request): Promise<Response> {
    await ensureCloudflareEnv();
    const redirect = canonicalRedirect(req);
    if (redirect) return redirect;

    let response = await paraglideMiddleware(req, () => handler.fetch(req));
    response = withSecurityHeaders(response);


    // Skip crawler/SEO paths — Set-Cookie on sitemap/robots can make GSC
    // report "Couldn't fetch" even when the body is valid.
    const url = new URL(req.url);
    const pathname = url.pathname.replace(/\/$/, '') || '/';
    if (
      pathname === '/sitemap.xml' ||
      pathname === '/sitemap.txt' ||
      pathname === '/sitemap-min.xml' ||
      pathname === '/sitemap-full.xml' ||
      pathname === '/sitemap-index.xml' ||
      pathname === '/robots.txt' ||
      pathname === '/llms.txt' ||
      pathname === '/llms-full.txt' ||
      pathname === '/ads.txt' ||
      pathname.startsWith('/.well-known/')
    ) {
      return response;
    }
    const cookieHeader = req.headers.get('cookie');

    const cookieOpts = 'Max-Age=2592000; Path=/; SameSite=Lax; Secure';
    const utmKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
    ] as const;
    for (const key of utmKeys) {
      const raw = url.searchParams.get(key);
      if (!raw || getCookieFromHeader(cookieHeader, key)) continue;
      const sanitized = sanitizeUtmValue(raw);
      if (sanitized) {
        response.headers.append(
          'Set-Cookie',
          `${key}=${sanitized}; ${cookieOpts}`
        );
      }
    }
    if (!getCookieFromHeader(cookieHeader, 'landing')) {
      const landing = url.pathname.replace(/[^\w.\-\/]/g, '').slice(0, 200);
      if (landing) {
        response.headers.append(
          'Set-Cookie',
          `landing=${encodeURIComponent(landing)}; ${cookieOpts}`
        );
      }
    }
    let firstTouchReferrer = '';
    if (!getCookieFromHeader(cookieHeader, 'referrer')) {
      const referer = req.headers.get('referer') || '';
      if (referer) {
        try {
          const refUrl = new URL(referer);
          const refHost = refUrl.hostname.toLowerCase().replace(/^www\./, '');
          const sameHost =
            refUrl.hostname === url.hostname ||
            refUrl.hostname.endsWith(`.${url.hostname}`);
          if (!sameHost && !isIgnoredReferrerHost(refHost)) {
            firstTouchReferrer = sanitizeReferrerValue(
              `${refUrl.hostname}${refUrl.pathname}`
            );
            if (firstTouchReferrer) {
              response.headers.append(
                'Set-Cookie',
                `referrer=${encodeURIComponent(firstTouchReferrer)}; ${cookieOpts}`
              );
            }
          }
        } catch {
          // ignore malformed Referer
        }
      }
    }
    if (
      !getCookieFromHeader(cookieHeader, 'utm_source') &&
      !url.searchParams.get('utm_source') &&
      firstTouchReferrer
    ) {
      const derived = deriveUtmFromReferrerHost(
        hostFromReferrerUrl(firstTouchReferrer)
      );
      if (derived?.utm_source) {
        response.headers.append(
          'Set-Cookie',
          `utm_source=${derived.utm_source}; ${cookieOpts}`
        );
        if (
          derived.utm_medium &&
          !getCookieFromHeader(cookieHeader, 'utm_medium') &&
          !url.searchParams.get('utm_medium')
        ) {
          response.headers.append(
            'Set-Cookie',
            `utm_medium=${derived.utm_medium}; ${cookieOpts}`
          );
        }
      }
    }

    return response;
  },
};
