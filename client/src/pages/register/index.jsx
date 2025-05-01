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
