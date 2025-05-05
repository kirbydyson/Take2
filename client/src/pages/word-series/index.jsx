/**
 * WordSeriesPage.jsx
 *
 * This is the main page component for the MLB WordSeries game.
 * It loads the game dynamically on the client side to avoid server-side rendering issues
 * and includes a reusable navigation bar at the top.
 *
 * Features:
 * - Dynamically imports the WordSeriesGame component with SSR disabled.
 * - Renders a consistent navigation bar using NavbarComponent.
 * - Applies basic page styling and layout.
 *
 * Dependencies:
 * - next/dynamic for client-side only component loading.
 * - NavbarComponent for consistent app navigation.
 * - WordSeriesGame (dynamically loaded game logic and UI).
 */

import dynamic from "next/dynamic";
import NavbarComponent from "@/components/Scoredle/NavbarComponent";

const WordSeriesGame = dynamic(() => import('@/components/wordSeries/WordSeriesGame'), { ssr: false });

export default function WordSeriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <NavbarComponent />
        <WordSeriesGame />
    </div>
  );
}
