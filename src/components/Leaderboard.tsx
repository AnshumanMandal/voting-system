'use client';
import { useVoting } from '@/hooks/useVoting';
import VotingCard from './VotingCard';
import { TrendingUp } from 'lucide-react';

export default function Leaderboard() {
  const { candidates, loading, hasVoted, vote, isVotingEnabled } = useVoting();
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
            Live Voting Leaderboard
          </h1>
          <div className="flex items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} />
              <span>Live Updates</span>
            </div>
          </div>
        </div>

        {/* Voting Status */}
        {hasVoted && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
            <p className="text-green-800 font-medium">✅ Thank you for voting! Results update in real-time.</p>
          </div>
        )}

        {/* Voting Closed Status */}
        {!isVotingEnabled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-center">
            <p className="text-yellow-800 font-medium">🔒 Voting is currently closed</p>
          </div>
        )}

        {/* Candidates Stack - Changed from grid to flex column */}
        <div className="flex flex-col space-y-4">
          {candidates.map((candidate, index) => (
            <VotingCard
              key={candidate.id}
              candidate={candidate}
              onVote={vote}
              hasVoted={hasVoted}
              rank={index + 1}
              totalVotes={totalVotes}
              isVotingEnabled={isVotingEnabled}
              isAdmin={false}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>🔒 One vote per device • Results update automatically</p>
        </div>
      </div>
    </div>
  )
}