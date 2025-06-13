'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Candidate } from '@/lib/types';
import { TrendingUp, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Results() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const candidatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Candidate[];
      
      const sortedCandidates = candidatesData.sort((a, b) => b.votes - a.votes);
      setCandidates(sortedCandidates);
      setTotalVotes(sortedCandidates.reduce((sum, c) => sum + c.votes, 0));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-yellow-100 border-yellow-500';
      case 2: return 'bg-gray-100 border-gray-500';
      case 3: return 'bg-orange-100 border-orange-500';
      default: return 'bg-white border-gray-200';
    }
  };

  const getRankEmoji = (rank: number) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return rank;
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center pt-2 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Final Results
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Award size={24} />
            <span>Total Votes: {totalVotes}</span>
          </div>
        </div>

        <div className="space-y-4">
          {candidates.map((candidate, index) => {
            const percentage = totalVotes === 0 ? 0 : ((candidate.votes / totalVotes) * 100);
            
            return (
              <div
                key={candidate.id}
                className={`rounded-lg border-2 p-6 transition-all duration-300 ${getRankColor(index + 1)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold w-10">
                      {getRankEmoji(index + 1)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {candidate.name}
                      </h3>
                      <p className="text-gray-600">{candidate.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {percentage.toFixed(1)}%
                    </div>
                    <div className="text-gray-500">
                      {candidate.votes} votes
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8 text-gray-500">
          <p>Results are updated in real-time</p>
        </div>
      </div>
    </div>
  );
}