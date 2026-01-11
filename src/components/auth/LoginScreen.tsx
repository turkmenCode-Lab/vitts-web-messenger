import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/authSlice';
import { User } from '../../types';

interface LoginScreenProps {
  onSwitchToSignUp: () => void;
}

export default function LoginScreen({ onSwitchToSignUp }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your phone number or email');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    // For demo purposes - in real app this would be API call
    const isPhone = identifier.startsWith('+');
    const mockUser: User = {
      id: 'demo-user-' + Date.now(),
      phone: isPhone ? identifier : '',
      email: isPhone ? '' : identifier,
      username: 'user_' + Math.floor(Math.random() * 10000),
      name: 'Demo User',
      about: 'Hey there! I am using this chat app.',
      lastSeen: Date.now(),
      isOnline: true,
    };

    dispatch(login(mockUser));
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00A884] mb-6 mx-auto">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">Sign In</h1>
          <p className="text-gray-400 text-sm">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#00A884] text-sm mb-2">
              Phone number or email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[#00A884] text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-950/30 p-3 rounded border border-red-800/50">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#00A884] hover:bg-[#00c896] text-white py-3.5 rounded-lg font-medium transition-colors mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-[#00A884] hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="mt-10 text-center text-gray-500 text-xs">
          <p className="flex items-center justify-center gap-1.5">
            <span className="text-[#00A884]">🔒</span>
            End-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
}