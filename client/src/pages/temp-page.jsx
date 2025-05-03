import dynamic from 'next/dynamic';
import NavbarComponent from '@/components/Homepage/NavbarComponent';

const TriviaLoader = dynamic(
    () => import('@/components/Trivia/TriviaLoader'),
    { ssr: false },
);

export default function TriviaLoadingPage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <NavbarComponent />
            <TriviaLoader />
        </div>
    );
}
