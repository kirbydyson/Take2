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
