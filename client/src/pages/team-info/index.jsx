import dynamic from 'next/dynamic';
import NavbarComponent from '@/components/Scoredle/NavbarComponent';

const TeamInfoComponent = dynamic(
    () => import('@/components/TeamInfo/TeamInfoComponent'),
    { ssr: false },
);

export default function TeamInfoPage() {
    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <NavbarComponent />
            <TeamInfoComponent />
        </div>
    );
}
