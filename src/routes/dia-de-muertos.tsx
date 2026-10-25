import { createFileRoute, redirect } from '@tanstack/react-router';

/** Legacy memorial fork URL — send crawlers to the real flash-step how-to. */
export const Route = createFileRoute('/dia-de-muertos')({
  beforeLoad: () => {
    throw redirect({
      to: '/guides/$slug',
      params: { slug: 'how-to-make-shan-shen-bu-ai-video' },
    });
  },
});
