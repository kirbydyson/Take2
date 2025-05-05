import dynamic from 'next/dynamic';

const BannedComponent = dynamic(
    () => import('@/components/Banned/BannedComponent'),
    {
        ssr: false,
    },
);

export default function BannedPage() {
    return <BannedComponent />;
}
