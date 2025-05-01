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
