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
