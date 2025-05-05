import dynamic from 'next/dynamic';
import Navbar from '@/components/Scoredle/NavbarComponent';

const ScoredleGame = dynamic(
    () => import('@/components/Scoredle/ScoredleGame'),
    { ssr: false },
);


export default function ScoredlePage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Navbar />
            <ScoredleGame />
        </div>
    );
}
