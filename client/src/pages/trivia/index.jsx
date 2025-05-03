import dynamic from 'next/dynamic';
import NavbarComponent from '@/components/Homepage/NavbarComponent';

const TriviaGame = dynamic(
    () => import('@/components/Trivia/TriviaComponent'),
    { ssr: false },
);

export default function TriviaPage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <NavbarComponent />
            <TriviaGame />
        </div>
    );
}
