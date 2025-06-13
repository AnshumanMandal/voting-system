'use client';

import { useVoting } from '@/hooks/useVoting';
import { TrendingUp } from 'lucide-react';

export default function ProtectedLeaderboard() {
  const { candidates, loading } = useVoting();
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-500';
      case 2:
        return 'border-gray-400';
      case 3:
        return 'border-orange-400';
      default:
        return 'border-gray-200';
    }
  };

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center pt-2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Live Results</h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
            <TrendingUp size={20} />
            <span>Live Updates</span>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {candidates.map((candidate, index) => {
            const votePercentage =
              totalVotes === 0
                ? 0
                : ((candidate.votes / totalVotes) * 100).toFixed(1);

            return (
              <div
                key={candidate.id}
                className={`bg-white rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${getRankColor(
                  index + 1
                )}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-800">
                      {getRankDisplay(index + 1)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {candidate.name}
                      </h3>
                      <p className="text-gray-600">{candidate.description}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {votePercentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}