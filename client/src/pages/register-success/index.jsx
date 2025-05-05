/**
 * RegisterSuccessPage
 *
 * This page displays a confirmation screen after a user successfully registers.
 *
 * Main Features:
 *  - Dynamically imports `RegisterSuccessComponent` with SSR disabled to handle client-side routing needs
 *  - Centers the success message both vertically and horizontally using Tailwind CSS
 *  - Provides a clean, visually distinct background to highlight registration confirmation
 *  - Acts as the final step in the registration flow before prompting the user to log in
 */

import dynamic from 'next/dynamic';

const RegisterSuccess = dynamic(
    () => import('@/components/Register-Successful/RegisterSuccessComponent'),
    {
        ssr: false,
    },
);

export default function RegisterSuccessPage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <RegisterSuccess />
        </div>
    );
}
