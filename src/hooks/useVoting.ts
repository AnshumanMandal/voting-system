import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, increment, addDoc, deleteDoc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Candidate } from '@/lib/types';
import toast from 'react-hot-toast';

export const useVoting = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVotingEnabled, setIsVotingEnabled] = useState(false);

  useEffect(() => {
    // Listen to voting status
    const unsubscribeVotingStatus = onSnapshot(doc(db, 'settings', 'votingStatus'), (doc) => {
      if (doc.exists()) {
        const enabled = doc.data()?.isEnabled || false;
        console.log('Voting status updated:', enabled); // Debug log
        setIsVotingEnabled(enabled);
      }
    });

    // Listen to candidates
    const unsubscribeCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const candidatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Candidate[];
      setCandidates(candidatesData.sort((a, b) => b.votes - a.votes));
      setLoading(false);
    });

    return () => {
      unsubscribeVotingStatus();
      unsubscribeCandidates();
    };
  }, []);

  const checkPrivateMode = async () => {
    try {
      // Try to write to localStorage
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      
      // Try to write a test cookie
      document.cookie = "testCookie=1; SameSite=Strict";
      
      return false; // Not in private mode
    } catch (e) {
      return true; // In private mode
    }
  };

  const vote = async (candidateId: string) => {
    // Check for private browsing first
    const isPrivateMode = await checkPrivateMode();
    if (isPrivateMode) {
      toast.error('Voting is not allowed in private/incognito mode');
      return;
    }

    if (hasVoted) {
      toast.error('You have already voted!');
      return;
    }

    const deviceId = getDeviceId();
    
    try {
      // Additional check for device ID
      if (!localStorage.getItem('device_id')) {
        toast.error('Voting is not allowed in private/incognito mode');
        return;
      }

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
      toast.error('Please use a regular browser window to vote');
      return;
    }
  };

  const getDeviceId = () => {
    try {
      let deviceId = localStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('device_id', deviceId);
      }
      return deviceId;
    } catch (error) {
      // If localStorage fails, we're likely in private mode
      return null;
    }
  };

  return { candidates, loading, hasVoted, vote, isVotingEnabled };
};