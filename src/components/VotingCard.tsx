'use client';
import { useState, useEffect } from 'react';
import { Candidate } from '@/lib/types';
import { Vote, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Changed from react-toastify to react-hot-toast

interface VotingCardProps {
  candidate: Candidate;
  onVote: (id: string) => Promise<void>;
  hasVoted: boolean;
  rank: number;
  totalVotes: number;
  isAdmin?: boolean;
  isVotingEnabled?: boolean;
}

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'border-yellow-500 bg-yellow-50';
    case 2:
      return 'border-gray-400 bg-gray-50';
    case 3:
      return 'border-orange-400 bg-orange-50';
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
      return rank;
  }
};

const generateRandomColor = (id: string) => {
  const colors = [
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  const index = Math.abs(id.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0)) % colors.length;
  
  return colors[index];
};

export default function VotingCard({ 
  candidate, 
  onVote, 
  hasVoted, 
  rank, 
  totalVotes,
  isAdmin = false
}: VotingCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const avatarColor = generateRandomColor(candidate.id);

  useEffect(() => {
    // Check for private mode on component mount
    const checkPrivateMode = async () => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        setIsPrivateMode(false);
      } catch (e) {
        setIsPrivateMode(true);
      }
    };
    checkPrivateMode();
  }, []);

  const handleVote = async () => {
    if (isPrivateMode) {
      toast.error('Please use a regular browser window to vote');
      return;
    }
    setIsVoting(true);
    await onVote(candidate.id);
    setIsVoting(false);
  };

  const getVotePercentage = () => {
    if (totalVotes === 0) return 0;
    return ((candidate.votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${getRankColor(rank)}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-bold ${rank <= 3 ? 'animate-pulse-slow' : ''}`}>
              {getRankBadge(rank)}
            </span>
            <div 
              className={`w-16 h-16 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-2xl shadow-md`}
            >
              {candidate.name.charAt(0).toUpperCase()}
            </div>
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
        
        {/* Only show vote button if not hidden */}
        {!isAdmin && (
          <button
            onClick={handleVote}
            disabled={hasVoted || isVoting || isPrivateMode}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 
              ${hasVoted 
                ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                : isPrivateMode
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {hasVoted 
              ? '✅ Voted' 
              : isPrivateMode 
              ? '🚫 Use Regular Browser'
              : isVoting 
              ? '⏳ Voting...' 
              : '🗳️ Vote'}
          </button>
        )}
      </div>
    </div>
  );
}