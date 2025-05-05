/**
 * ScoredlePage
 *
 * This page component renders the Scoredle game interface along with its custom navbar.
 *
 * Main Features:
 *  - Dynamically imports the `ScoredleGame` component with server-side rendering disabled
 *    to support browser-specific functionality like `window` or `document` usage
 *  - Includes the `Navbar` specific to Scoredle for consistent navigation
 *  - Uses Tailwind CSS utility classes to center content and apply background styling
 *  - Acts as the entry point for users to play the Scoredle game
 */

import dynamic from 'next/dynamic';
import Navbar from '@/components/Scoredle/NavbarComponent';

const ScoredleGame = dynamic(
    () => import('@/components/Scoredle/ScoredleGame'),
    { ssr: false },
);


export default function ScoredlePage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Navbar />
            <ScoredleGame />
        </div>
    );
}
