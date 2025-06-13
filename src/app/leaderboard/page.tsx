'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProtectedLeaderboard from '@/components/ProtectedLeaderboard';

export default function LeaderboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_LEADERBOARD_SECRET) {
      setIsAuthenticated(true);
      toast.success('Access granted');
    } else {
      toast.error('Invalid password');
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Protected Leaderboard</h1>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ProtectedLeaderboard />
      )}
    </>
  );
}