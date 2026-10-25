import { createFileRoute, redirect } from '@tanstack/react-router';

/** Legacy LobbyDuo template URL → Shan Shen Bu flash-step guide */
export const Route = createFileRoute('/hotel-lobby-ai-prompt-guide/')({
  beforeLoad: () => {
    throw redirect({
      to: '/guides/$slug',
      params: { slug: 'how-to-make-shan-shen-bu-ai-video' },
      statusCode: 301,
    });
  },
});
