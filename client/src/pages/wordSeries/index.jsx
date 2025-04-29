import dynamic from "next/dynamic";

const WordSeriesGame = dynamic(() => import('@/components/wordSeries/WordSeriesGame'), { ssr: false });

export default function WordSeriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <WordSeriesGame />
    </div>
  );
}
