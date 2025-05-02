import dynamic from 'next/dynamic';
import Navbar from '@/components/Homepage/NavbarComponent';

const Catalogue = dynamic(() => import('@/components/Catalogue/CatalogueComponent'), {
    ssr: false,
});

export default function CataloguePage() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-50'>
            <Navbar />
            <Catalogue />
        </div>
    );
}
