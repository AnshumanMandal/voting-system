import Image from 'next/image';
import Leaderboard from '@/components/Leaderboard';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <>
      <div className="absolute -top-2 sm:-top-8 -left-3 sm:left-2 md:left-2 lg:left-2 z-10">
        <Image
          src="/logos/innovatex.png"
          alt="InnovateX"
          width={800}
          height={200}
          className="h-28 sm:h-40 w-auto"
          priority
        />
      </div>
      
      <main className="min-h-screen">
        <Leaderboard />
      </main>
      <Toaster position="top-right" />
    </>
  );
}