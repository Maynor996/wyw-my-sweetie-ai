import { createFileRoute } from '@tanstack/react-router';

import {
  VideosIndexPage,
  videosIndexHead,
} from '@/components/zombiehug/video-watch-page';

export const Route = createFileRoute('/videos/')({
  head: () => videosIndexHead(),
  component: VideosIndexPage,
});
