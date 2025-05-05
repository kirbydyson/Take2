/**
 * AdminAccountPage.jsx
 *
 * This page renders the admin account management interface.
 * It includes a navigation bar and dynamically loads the admin account component
 * with server-side rendering disabled to ensure client-only behavior.
 *
 * Features:
 * - Displays a centered layout with background styling.
 * - Renders a shared navigation bar at the top.
 * - Dynamically imports AdminAccountComponent (e.g., user management tools).
 *
 * Dependencies:
 * - next/dynamic for dynamic import with SSR disabled.
 * - NavbarComponent for app navigation.
 * - AdminAccountComponent for managing admin-specific content.
 */


import dynamic from 'next/dynamic';
import Navbar from '@/components/Scoredle/NavbarComponent';

const AdminAccountComponent = dynamic(
    () => import('@/components/Admin/AdminAccountComponent'),
    {
        ssr: false,
    },
);

export default function AdminAccountPage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Navbar />
            <AdminAccountComponent />
        </div>
    );
}
