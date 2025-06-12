'use client';
import { useState } from 'react';
import { Candidate } from '@/lib/types';
import { Vote, CheckCircle } from 'lucide-react';

interface VotingCardProps {
  candidate: Candidate;
  onVote: (id: string) => Promise<void>;
  hasVoted: boolean;
  rank: number;
  totalVotes: number;
  isAdmin?: boolean;
}

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'border-yellow-500 bg-yellow-50';
    case 2:
      return 'border-gray-400 bg-gray-50';
    case 3:
      return 'border-orange-500 bg-orange-50';
    default:
      return 'border-gray-200 bg-white';
  }
};

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return `#${rank}`;
  }
};

export default function VotingCard({ candidate, onVote, hasVoted, rank, totalVotes, isAdmin = false }: VotingCardProps) {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    setIsVoting(true);
    await onVote(candidate.id);
    setIsVoting(false);
  };

  const getVotePercentage = () => {
    if (totalVotes === 0) return 0;
    return ((candidate.votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <div className={`rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${getRankColor(rank)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold ${rank <= 3 ? 'animate-pulse-slow' : ''}`}>
            {getRankBadge(rank)}
          </span>
          <img 
            src={candidate.image} 
            alt={candidate.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div>
            <h3 className="text-xl font-bold">{candidate.name}</h3>
            <p className="opacity-75">{candidate.description}</p>
          </div>
        </div>
        <div className="text-right">
          {isAdmin ? (
            <>
              <div className="text-3xl font-bold text-blue-600">{candidate.votes}</div>
              <div className="text-sm text-gray-500">votes</div>
            </>
          ) : (
            <div className="text-2xl font-bold text-blue-600">{getVotePercentage()}%</div>
          )}
        </div>
      </div>
      
      <button
        onClick={handleVote}
        disabled={hasVoted || isVoting}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          hasVoted 
            ? 'bg-green-100 text-green-700 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
        }`}
      >
        {hasVoted ? (
          <>
            <CheckCircle size={20} />
            Voted
          </>
        ) : isVoting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Voting...
          </>
        ) : (
          <>
            <Vote size={20} />
            Vote
          </>
        )}
      </button>
    </div>
  );
}