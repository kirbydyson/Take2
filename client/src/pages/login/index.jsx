/**
 * LoginPage
 *
 * This file defines the login route for the application. It dynamically loads the
 * `LoginComponent` with server-side rendering (SSR) disabled to support client-only
 * logic such as form handling, validation, and session state.
 *
 * Key Features:
 * - Dynamically imports the `LoginComponent` to avoid SSR issues.
 * - Uses Tailwind CSS to center the login form both vertically and horizontally
 *   with a soft background for improved UX.
 *
 * Dependencies:
 * - Next.js dynamic import (`next/dynamic`)
 * - Tailwind CSS for layout and styling
 * - `@/components/Login/LoginComponent`
 */

import dynamic from 'next/dynamic';

const Login = dynamic(
    () => import('@/components/Login/LoginComponent'),
    { ssr: false },
);

export default function LoginPage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Login />
        </div>
    );
}
