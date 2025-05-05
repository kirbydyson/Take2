/**
 * RegisterPage
 *
 * This page renders the user registration form for new account creation.
 *
 * Main Features:
 *  - Dynamically imports the `RegisterComponent` with server-side rendering disabled
 *    to support client-side only dependencies (e.g., password strength meter)
 *  - Centers the form using Tailwind CSS utilities for a responsive layout
 *  - Provides a styled background to distinguish the registration experience
 *  - Serves as the entry point for users to sign up for a new account
 */

import dynamic from 'next/dynamic';

const Register = dynamic(() => import('@/components/Register/RegisterComponent'), {
    ssr: false,
});

export default function RegisterPage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Register />
        </div>
    );
}
