import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, increment, addDoc, deleteDoc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Candidate } from '@/lib/types';
import toast from 'react-hot-toast';

export const useVoting = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // Check if user has already voted
    const voted = localStorage.getItem('has_voted');
    setHasVoted(!!voted);

    // Listen to candidates collection
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

  const vote = async (candidateId: string) => {
    if (hasVoted) {
      toast.error('You have already voted!');
      return;
    }

    const deviceId = getDeviceId();
    
    try {
      // Check if device has already voted
      const votesRef = collection(db, 'votes');
      const voteQuery = await getDocs(query(votesRef, where('deviceId', '==', deviceId)));
      
      if (!voteQuery.empty) {
        toast.error('This device has already voted!');
        setHasVoted(true);
        return;
      }

      // Update candidate votes
      const candidateRef = doc(db, 'candidates', candidateId);
      await updateDoc(candidateRef, {
        votes: increment(1)
      });

      // Record the vote with device ID
      await addDoc(collection(db, 'votes'), {
        candidateId,
        timestamp: Date.now(),
        deviceId
      });

      localStorage.setItem('has_voted', 'true');
      localStorage.setItem('voted_for', candidateId);
      setHasVoted(true);
      
      toast.success('Vote recorded successfully!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  const getDeviceId = () => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  };

  return { candidates, loading, hasVoted, vote };
};