import dynamic from "next/dynamic";
import NavbarComponent from "@/components/Homepage/NavbarComponent";

const WordSeriesGame = dynamic(() => import('@/components/wordSeries/WordSeriesGame'), { ssr: false });

export default function WordSeriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <NavbarComponent />
        <WordSeriesGame />
    </div>
  );
}
