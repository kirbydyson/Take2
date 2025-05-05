/**
 * AdminVerifyPage.jsx
 *
 * This page renders the admin verification interface for managing pending account verifications.
 * It displays a navigation bar and dynamically loads the AdminVerifyComponent without server-side rendering.
 *
 * Features:
 * - Centers the verification interface vertically and horizontally on the screen.
 * - Uses a shared navigation bar component for consistent site navigation.
 * - Dynamically loads AdminVerifyComponent to ensure client-only rendering.
 *
 * Dependencies:
 * - next/dynamic for dynamic client-side component loading.
 * - NavbarComponent for navigation.
 * - AdminVerifyComponent for displaying and handling account verifications.
 */


import dynamic from 'next/dynamic';
import Navbar from '@/components/Scoredle/NavbarComponent';

const AdminVerifyComponent = dynamic(
    () => import('@/components/Admin/AdminVerifyComponent'),
    {
        ssr: false,
    },
);

export default function AdminVerifyPage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Navbar />
            <AdminVerifyComponent />
        </div>
    );
}
