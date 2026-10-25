import { createFileRoute, redirect } from '@tanstack/react-router';

/**
 * Pack pricing lives on the landing page (#pricing).
 * Keep this route so old/header links resolve.
 */
export const Route = createFileRoute('/pricing')({
  beforeLoad: () => {
    throw redirect({ href: '/#pricing' });
  },
});
