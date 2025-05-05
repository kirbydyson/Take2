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
