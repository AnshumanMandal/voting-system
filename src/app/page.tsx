import Leaderboard from '@/components/Leaderboard';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <>
      <Leaderboard />
      <Toaster position="top-right" />
    </>
  );
}