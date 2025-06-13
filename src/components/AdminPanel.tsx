'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Candidate } from '@/lib/types';

export default function AdminPanel() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    description: '',
    votes: 0
  });
  const [pendingVotes, setPendingVotes] = useState<{[key: string]: number}>({});
  const [isVotingEnabled, setIsVotingEnabled] = useState(false);

  // Listen to candidates
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

  // Initialize and listen to voting status
  useEffect(() => {
    // Get initial voting status
    const getInitialStatus = async () => {
      const statusRef = doc(db, 'settings', 'votingStatus');
      const statusDoc = await getDoc(statusRef);
      if (statusDoc.exists()) {
        setIsVotingEnabled(statusDoc.data()?.isEnabled || false);
      }
    };
    getInitialStatus();

    // Listen for changes
    const unsubscribe = onSnapshot(doc(db, 'settings', 'votingStatus'), (doc) => {
      if (doc.exists()) {
        setIsVotingEnabled(doc.data()?.isEnabled || false);
      }
    });

    return () => unsubscribe();
  }, []);

  const addCandidate = async () => {
    // Validate required fields
    if (!newCandidate.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!newCandidate.description.trim()) {
      toast.error('Description is required');
      return;
    }

    try {
      const candidateData = {
        name: newCandidate.name.trim(),
        description: newCandidate.description.trim(),
        votes: 0,
        createdAt: Date.now() // Add timestamp when creating
      };

      await addDoc(collection(db, 'candidates'), candidateData);
      
      // Reset form and close modal
      setNewCandidate({
        name: '',
        description: '',
        votes: 0
      });
      setShowAddForm(false);
      toast.success('Candidate added successfully!');
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add candidate');
    }
  };

  const updateCandidate = async (id: string, field: string, value: any) => {
    try {
      const candidateRef = doc(db, 'candidates', id);
      await updateDoc(candidateRef, { [field]: value });
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (error) {
      console.error('Error updating candidate:', error);
      toast.error('Failed to update candidate');
    }
  };

  const deleteCandidate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;

    try {
      await deleteDoc(doc(db, 'candidates', id));
      toast.success('Candidate deleted');
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Failed to delete candidate');
    }
  };

  const updateVotes = async (id: string, newVotes: number) => {
    try {
      const candidateRef = doc(db, 'candidates', id);
      await updateDoc(candidateRef, {
        votes: newVotes
      });
      toast.success('Votes updated successfully');
    } catch (error) {
      console.error('Error updating votes:', error);
      toast.error('Failed to update votes');
    }
  };

  // Function to generate random color for candidate circle
  const generateRandomColor = (id: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    const index = parseInt(id.substring(0, 8), 16) % colors.length;
    return colors[index];
  };

  // Update the toggle function
  const toggleVoting = async () => {
    try {
      const statusRef = doc(db, 'settings', 'votingStatus');
      const newStatus = !isVotingEnabled;
      
      // Add retry logic
      const maxRetries = 3;
      let retryCount = 0;
      
      const updateStatus = async () => {
        try {
          await setDoc(statusRef, {
            isEnabled: newStatus,
            lastUpdated: Date.now()
          });
          console.log('Voting status updated successfully');
          toast.success(`Voting is now ${newStatus ? 'open' : 'closed'}`);
        } catch (error) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying update... Attempt ${retryCount}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
            return updateStatus();
          }
          throw error;
        }
      };

      await updateStatus();
    } catch (error) {
      console.error('Failed to update voting status:', error);
      toast.error('Failed to update voting status. Please check your connection and try again.');
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with total votes */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-600 mt-2">
              Total Votes: {candidates.reduce((sum, c) => sum + c.votes, 0)}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleVoting}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 
                ${isVotingEnabled 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
              {isVotingEnabled ? '🔴 Close Voting' : '🟢 Open Voting'}
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Candidate
            </button>
          </div>
        </div>

        {/* Add Candidate Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Add New Candidate</h2>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Description"
                  value={newCandidate.description}
                  onChange={(e) => setNewCandidate({...newCandidate, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <input
                  type="number"
                  placeholder="Initial Votes"
                  value={newCandidate.votes}
                  onChange={(e) => setNewCandidate({...newCandidate, votes: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addCandidate}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Add Candidate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Candidates Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Candidate</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Votes</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Percentage</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(candidate => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full ${generateRandomColor(candidate.id)} flex items-center justify-center text-white font-bold`}>
                          {candidate.name.charAt(0).toUpperCase()}
                        </div>
                        {editingId === candidate.id ? (
                          <input
                            type="text"
                            value={candidate.name}
                            onChange={(e) => {
                              const updated = candidates.map(c => 
                                c.id === candidate.id ? {...c, name: e.target.value} : c
                              );
                              setCandidates(updated);
                            }}
                            className="font-medium text-gray-900 border-b-2 border-blue-500 focus:outline-none"
                            onBlur={() => updateCandidate(candidate.id, 'name', candidate.name)}
                          />
                        ) : (
                          <span className="font-medium text-gray-900">{candidate.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {editingId === candidate.id ? (
                        <input
                          type="text"
                          value={candidate.description}
                          onChange={(e) => {
                            const updated = candidates.map(c => 
                              c.id === candidate.id ? {...c, description: e.target.value} : c
                            );
                            setCandidates(updated);
                          }}
                          className="w-full border-b-2 border-blue-500 focus:outline-none"
                          onBlur={() => updateCandidate(candidate.id, 'description', candidate.description)}
                        />
                      ) : (
                        candidate.description
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={pendingVotes[candidate.id] ?? candidate.votes}
                          onChange={(e) => {
                            const newVotes = Math.max(0, parseInt(e.target.value) || 0);
                            setPendingVotes({
                              ...pendingVotes,
                              [candidate.id]: newVotes
                            });
                          }}
                          className="w-20 px-2 py-1 text-center border border-gray-300 rounded"
                          min="0"
                        />
                        {pendingVotes[candidate.id] !== undefined && 
                          pendingVotes[candidate.id] !== candidate.votes && (
                          <button
                            onClick={() => updateVotes(candidate.id, pendingVotes[candidate.id])}
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {((candidate.votes / candidates.reduce((sum, c) => sum + c.votes, 0)) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingId(editingId === candidate.id ? null : candidate.id)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteCandidate(candidate.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}