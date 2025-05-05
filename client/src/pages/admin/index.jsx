/**
 * AdminPage.jsx
 *
 * This page serves as the main admin dashboard entry point.
 * It includes the shared navigation bar and dynamically loads the core AdminComponent
 * responsible for managing users or routing to other admin features.
 *
 * Features:
 * - Centered full-screen layout with a styled background.
 * - Displays a top-level navigation bar.
 * - Dynamically imports AdminComponent with server-side rendering disabled.
 *
 * Dependencies:
 * - next/dynamic for dynamic client-side loading.
 * - NavbarComponent for consistent navigation.
 * - AdminComponent for rendering the core admin dashboard functionality.
 */

import dynamic from 'next/dynamic';
import Navbar from '@/components/Scoredle/NavbarComponent';

const AdminComponent = dynamic(
    () => import('@/components/Admin/AdminComponent'),
    {
        ssr: false,
    },
);

export default function AdminPage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Navbar />
            <AdminComponent />
        </div>
    );
}
