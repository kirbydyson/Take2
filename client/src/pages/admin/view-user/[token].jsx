/**
 * AdminViewUserData.jsx
 *
 * This page renders the admin interface for viewing detailed user data.
 * It includes a global navigation bar and dynamically loads the user data view component with SSR disabled.
 *
 * Features:
 * - Full-page layout centered both vertically and horizontally.
 * - Navigation bar included for consistent admin navigation.
 * - Dynamically loads AdminViewUserDataComponent to prevent server-side rendering issues.
 *
 * Dependencies:
 * - next/dynamic for client-only component loading.
 * - NavbarComponent for global navigation.
 * - AdminViewUserDataComponent for displaying detailed user account information.
 */

import dynamic from 'next/dynamic';
import Navbar from '@/components/Scoredle/NavbarComponent';

const AdminViewUser = dynamic(
    () => import('@/components/Admin/AdminViewUserDataComponent'),
    {
        ssr: false,
    },
);

export default function AdminViewUserData() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Navbar />
            <AdminViewUser />
        </div>
    );
}
