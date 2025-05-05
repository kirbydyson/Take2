/**
 * MyGamesPage
 *
 * This page displays the user's personal game statistics and history across
 * all game modes, such as Trivia, Scoredle, and WordSeries.
 *
 * Main Features:
 *  - Dynamically imports `MyGamesComponent` with server-side rendering disabled
 *    to support client-side session validation and chart rendering
 *  - Includes the Scoredle-themed `Navbar` for consistent navigation
 *  - Uses Tailwind CSS to center content and apply a light background
 *  - Acts as the user's personal dashboard for viewing game performance data
 */

import dynamic from 'next/dynamic';
import Navbar from '@/components/Scoredle/NavbarComponent';

const MyGames = dynamic(
    () => import('@/components/My-Games/MyGamesComponent'),
    {
        ssr: false,
    },
);

export default function MyGamesPage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Navbar />
            <MyGames />
        </div>
    );
}
