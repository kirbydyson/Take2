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
