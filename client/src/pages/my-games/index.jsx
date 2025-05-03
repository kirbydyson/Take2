import dynamic from 'next/dynamic';
import Navbar from '@/components/Scoredle/NavbarComponent';

const MyGames = dynamic(
    () => import('@/components/My-Games/MyGamesComponent'),
    {
        ssr: false,
    },
);

export default function MyGamesPage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Navbar />
            <MyGames />
        </div>
    );
}
