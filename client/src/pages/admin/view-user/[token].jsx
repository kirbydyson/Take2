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
