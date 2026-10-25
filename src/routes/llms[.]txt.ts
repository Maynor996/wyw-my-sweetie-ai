import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { baseLocale } from '@/paraglide/runtime.js';
import { getLocalPosts, mergePosts } from '@/content/posts';

const STATIC_PAGES: { path: string; title: string; description: string }[] = [
  {
    path: '',
    title: 'Home',
    description:
      'wywmysweetie AI turns 1 photo into a ~10s 9:16 Halloween half-face goo video — from $8.88 at wywmysweetie.run. NOT Wayans / Wyw My Sweetie film.',
  },
  {
    path: '/effects',
    title: 'Effects',
    description: 'Duo car scene and pet driver effects',
  },
  {
    path: '/#create',
    title: 'Wyw My Sweetie create',
    description: 'Pet singing driver effect',
  },
  {
    path: '/videos',
    title: 'Sample videos',
    description: 'wywmysweetie AI sample shorts',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description: 'Photo retention for wywmysweetie AI',
  },
  {
    path: '/terms-of-service',
    title: 'Terms of Service',
    description: 'Credits and acceptable use',
  },
];

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: async () => {
        const { app_url, app_name, app_description } = envConfigs;

        let posts = getLocalPosts(baseLocale);
        try {
          const { listPublishedArticles } =
            await import('@/modules/posts/service');
          const rows = await listPublishedArticles().catch(() => []);
          const dbPosts = rows.map((row) => ({
            slug: row.slug,
            title: row.title || row.slug,
            description: row.description || '',
            createdAt: new Date(row.createdAt).toISOString(),
            source: 'db' as const,
          }));
          posts = mergePosts(dbPosts, posts);
        } catch {
          // Database unreachable — local posts still listed.
        }

        const lines: string[] = [
          `# ${app_name}`,
          '',
          `> ${app_description}`,
          '',
          '## Pages',
          '',
          ...STATIC_PAGES.map(
            (p) => `- [${p.title}](${app_url}${p.path}): ${p.description}`
          ),
        ];

        if (posts.length > 0) {
          lines.push('', '## Blog Posts', '');
          for (const post of posts) {
            lines.push(
              `- [${post.title}](${app_url}/blog/${post.slug}): ${post.description}`
            );
          }
        }

        lines.push(
          '',
          '## Product facts',
          '',
          '- Site: https://wywmysweetie.run',
          '- Live (backup): https://wyw-my-sweetie.chatgpt-plus.workers.dev',
          '- 1–2 photos → ~10–12s 9:16 night convertible sing AI video',
          '- Guest Stripe checkout; packs from $8.88',
          '- Primary locale English (en)',
          '- Adults 18+; independent fan AI tool — NOT Marvel / Sony',
          ''
        );

        return new Response(lines.join('\n'), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      },
    },
  },
});
