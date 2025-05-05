/**
 * BannedPage
 *
 * This file defines the route-level page component that renders the `BannedComponent`
 * using dynamic import with server-side rendering (SSR) disabled.
 *
 * Key Features:
 * - Dynamically loads the banned user interface (`BannedComponent`) on the client side.
 * - Prevents SSR issues by setting `ssr: false`, ensuring full client-side rendering.
 *
 * Dependencies:
 * - Next.js dynamic import (`next/dynamic`)
 * - `@/components/Banned/BannedComponent` (client-only)
 */

import dynamic from 'next/dynamic';

const BannedComponent = dynamic(
    () => import('@/components/Banned/BannedComponent'),
    {
        ssr: false,
    },
);

export default function BannedPage() {
    return <BannedComponent />;
}
