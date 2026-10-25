import { createFileRoute, notFound } from '@tanstack/react-router';

import {
  VideoWatchPage,
  watchVideoHead,
} from '@/components/zombiehug/video-watch-page';
import { WATCH_BY_SLUG } from '@/components/zombiehug/video-watch';

export const Route = createFileRoute('/videos/$slug')({
  loader: ({ params }) => {
    const video = WATCH_BY_SLUG[params.slug];
    if (!video) throw notFound();
    return { video };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.video) return {};
    return watchVideoHead(loaderData.video);
  },
  component: WatchRoute,
});

function WatchRoute() {
  const { video } = Route.useLoaderData();
  return <VideoWatchPage video={video} />;
}
