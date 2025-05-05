/**
 * TriviaPage
 *
 * This file defines the main page component for rendering the Trivia game in the application.
 * It imports the Navbar and dynamically loads the TriviaGame component with server-side
 * rendering (SSR) disabled to ensure proper client-side interactivity.
 *
 * Key Features:
 * - Renders a full-page layout with a centered trivia game.
 * - Includes the main site navigation bar via `NavbarComponent`.
 * - Dynamically loads `TriviaComponent` (a.k.a. TriviaGame) using `next/dynamic` with SSR disabled
 *   to avoid hydration errors and support client-only features like timers and state.
 *
 * Dependencies:
 * - Next.js dynamic import (`next/dynamic`)
 * - Custom components: `NavbarComponent`, `TriviaComponent`
 */
import dynamic from 'next/dynamic';
import NavbarComponent from '@/components/Homepage/NavbarComponent';

const TriviaGame = dynamic(
    () => import('@/components/Trivia/TriviaComponent'),
    { ssr: false },
);

export default function TriviaPage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <NavbarComponent />
            <TriviaGame />
        </div>
    );
}
