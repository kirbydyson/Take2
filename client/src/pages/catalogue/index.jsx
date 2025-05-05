/**
 * CataloguePage
 *
 * This file defines the main page for displaying the catalogue of available items
 * (e.g., pets, trivia sets, etc.), using a dynamically loaded `CatalogueComponent`.
 * Server-side rendering is disabled to support client-only features within the component.
 *
 * Key Features:
 * - Renders a full-screen layout with a navigation bar (`NavbarComponent`).
 * - Dynamically imports and displays the `CatalogueComponent` using `next/dynamic`.
 * - Applies basic styling using Tailwind CSS for layout and background.
 *
 * Dependencies:
 * - Next.js dynamic import (`next/dynamic`)
 * - Tailwind CSS for layout and background styling
 * - Custom components: `NavbarComponent`, `CatalogueComponent`
 */

import dynamic from 'next/dynamic';
import Navbar from '@/components/Homepage/NavbarComponent';

const Catalogue = dynamic(() => import('@/components/Catalogue/CatalogueComponent'), {
    ssr: false,
});

export default function CataloguePage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Navbar />
            <Catalogue />
        </div>
    );
}
