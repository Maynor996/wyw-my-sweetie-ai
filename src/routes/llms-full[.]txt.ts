import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { baseLocale } from '@/paraglide/runtime.js';
import { getLocalPosts, mergePosts } from '@/content/posts';

const STATIC_PAGES: { path: string; title: string; description: string }[] = [
  { path: '', title: 'Home', description: 'wywmysweetie AI (wywmysweetie.run) — 1 photo to a ~10s 9:16 Halloween half-face goo video, from $8.88' },
  { path: '/effects', title: 'Effects', description: 'Duo car scene and pet driver effects' },
  { path: '/#create', title: 'Wyw My Sweetie create', description: '1 photo → half-face goo AI short' },
  { path: '/videos', title: 'Sample videos', description: 'wywmysweetie AI sample shorts' },
  { path: '/blog', title: 'Blog', description: 'wywmysweetie AI guides and updates' },
  { path: '/partners', title: 'Partners', description: 'Directory and partner badges for wywmysweetie AI' },
  { path: '/tools', title: 'Related tools', description: 'Sibling AI short-video tools' },
  { path: '/privacy-policy', title: 'Privacy Policy', description: 'Photo retention, deletion, and contact for wywmysweetie AI' },
  { path: '/terms-of-service', title: 'Terms of Service', description: 'Credits, failed generation handling, and acceptable use' },
];

export const Route = createFileRoute('/llms-full.txt')({
  server: {
    handlers: {
      GET: async () => {
        const { app_url, app_name, app_description } = envConfigs;

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

        let posts = getLocalPosts(baseLocale);
        try {
          const { listPublishedArticles, findPublishedBySlug } =
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

          if (posts.length > 0) {
            lines.push('', '## Blog Posts', '');

            for (const post of posts) {
              lines.push(`### ${post.title}`, '');
              lines.push(`URL: ${app_url}/blog/${post.slug}`);
              if (post.description)
                lines.push(`Description: ${post.description}`);
              lines.push('');

              if (post.source === 'db') {
                const detail = await findPublishedBySlug(post.slug).catch(
                  () => null
                );
                if (detail?.content) {
                  lines.push(detail.content, '');
                }
              }

              lines.push('---', '');
            }
          }
        } catch {
          // Database unreachable — list local posts without content.
          if (posts.length > 0) {
            lines.push('', '## Blog Posts', '');
            for (const post of posts) {
              lines.push(`### ${post.title}`, '');
              lines.push(`URL: ${app_url}/blog/${post.slug}`);
              if (post.description)
                lines.push(`Description: ${post.description}`);
              lines.push('', '---', '');
            }
          }
        }

        lines.push(
          '',
          '## Product facts',
          '',
          '- Site: https://wywmysweetie.run',
          '- Live (backup): https://wyw-my-sweetie.chatgpt-plus.workers.dev',
          '- Duo (2 photos) → ~12s; Pet (1 photo) → ~10s; 9:16 Seedance',
          '- Packs: Single $8.88 / Popular $16.99 / Creator $29.90',
          '- Adults 18+; independent fan tool — NOT Marvel / Sony',
          ''
        );

        return new Response(lines.join('\n'), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      },
    },
  },
});
