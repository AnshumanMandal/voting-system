import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, getDocs, query, where, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Candidate } from '@/lib/types';

export const useVoting = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const candidatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Candidate[];
      setCandidates(candidatesData.sort((a, b) => b.votes - a.votes));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isPrivateMode = () => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return false;
    } catch (e) {
      return true;
    }
  };

  const vote = async (candidateId: string) => {
    if (isPrivateMode()) {
      toast.error('Voting is not allowed in private/incognito mode');
      return;
    }

    if (hasVoted) {
      toast.error('You have already voted!');
      return;
    }

    const deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      toast.error('Unable to identify device. Please use a regular browser.');
      return;
    }

    try {
      const votesRef = collection(db, 'votes');
      const voteQuery = await getDocs(query(votesRef, where('deviceId', '==', deviceId)));

      if (!voteQuery.empty) {
        toast.error('This device has already voted!');
        setHasVoted(true);
        return;
      }

      // Record the vote
      const candidateRef = doc(db, 'candidates', candidateId);
      await updateDoc(candidateRef, {
        votes: increment(1)
      });

      // Record the vote in votes collection
      await addDoc(votesRef, {
        candidateId,
        deviceId,
        timestamp: Date.now()
      });

      setHasVoted(true);
      toast.success('Vote recorded successfully!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  return { candidates, loading, hasVoted, vote };
};