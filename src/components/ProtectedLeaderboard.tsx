'use client';

import { useVoting } from '@/hooks/useVoting';
import { TrendingUp } from 'lucide-react';
import VotingCard from './VotingCard';

export default function ProtectedLeaderboard() {
  const { candidates, loading } = useVoting();
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

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
          <h1 className="text-4xl font-bold text-gray-800 mb-4 p-2">
            Protected Leaderboard View
          </h1>
          <div className="flex items-center justify-center gap-8 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} />
              <span>Live Updates</span>
            </div>
            <div>
              <span className="font-semibold">Total Votes: {totalVotes}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {candidates.map((candidate, index) => (
            <VotingCard
              key={candidate.id}
              candidate={candidate}
              onVote={() => {}}
              hasVoted={true}
              rank={index + 1}
              totalVotes={totalVotes}
              isAdmin={true}
              hideVoteButton={true}
            />
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          This is a protected view of the leaderboard
        </div>
      </div>
    </div>
  );
}