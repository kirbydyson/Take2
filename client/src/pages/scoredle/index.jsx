import dynamic from 'next/dynamic';
import NavbarComponent from "@/components/Homepage/NavbarComponent";

const ScoredleGame = dynamic(
    () => import('@/components/Scoredle/ScoredleGame'),
    { ssr: false },
);


export default function ScoredlePage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <NavbarComponent />
            <ScoredleGame />
        </div>
    );
}
