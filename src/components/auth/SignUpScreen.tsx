import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/authSlice';
import { User } from '../../types';

interface SignUpScreenProps {
  onSwitchToLogin: () => void;
}

export default function SignUpScreen({ onSwitchToLogin }: SignUpScreenProps) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const dispatch = useAppDispatch();

  const validations = [
    () => {
      if (!phone.startsWith('+') || phone.length < 11 || /\D/.test(phone.slice(1))) {
        setError('Phone must start with "+" and contain at least 10 digits');
        return false;
      }
      return true;
    },
    () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return false;
      }
      return true;
    },
    () => {
      const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,}$/;
      if (!usernameRegex.test(username)) {
        setError('Username must start with a letter and be 3+ characters (letters, numbers, _)');
        return false;
      }
      return true;
    },
    () => {
      if (!name.trim()) {
        setError('Please enter your full name');
        return false;
      }
      return true;
    },
    () => {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
      return true;
    },
    () => {
      if (confirmPassword !== password) {
        setError('Passwords do not match');
        return false;
      }
      return true;
    },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (validations[step - 1]()) {
      setDirection('forward');
      if (step < 6) {
        setStep(step + 1);
      } else {
        // Success - create user
        const newUser: User = {
          id: 'user-' + Date.now(),
          phone,
          email,
          username,
          name: name.trim(),
          about: 'Hey there! I am using this chat app.',
          lastSeen: Date.now(),
          isOnline: true,
        };
        dispatch(login(newUser));
      }
    }
  };

  const handleBack = () => {
    setError('');
    setDirection('back');
    setStep(step - 1);
  };

  const getCurrentField = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                let val = e.target.value;
                if (!val || val.startsWith('+')) {
                  val = '+' + val.slice(1).replace(/\D/g, '');
                } else {
                  val = val.replace(/\D/g, '');
                }
                setPhone(val);
              }}
              placeholder="+66 123 456 789"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none"
              autoFocus
            />
          </>
        );

      case 2:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none"
              autoFocus
            />
          </>
        );

      case 3:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe123"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none"
              autoFocus
            />
            <p className="text-gray-500 text-xs mt-2">Starts with letter, 3+ characters</p>
          </>
        );

      case 4:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none"
              autoFocus
            />
          </>
        );

      case 5:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none"
              autoFocus
            />
          </>
        );

      case 6:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none"
              autoFocus
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00A884] mb-6 mx-auto">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Step {step} of 6</p>
        </div>

        <div className="relative overflow-hidden min-h-[240px]">
          <div
            key={step}
            className={`
              absolute inset-0 transition-all duration-400 ease-in-out
              ${direction === 'forward' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'}
              [&.active]:translate-x-0 [&.active]:opacity-100
            `}
          >
            <form onSubmit={handleNext} className="space-y-6 active">
              <div>
                {getCurrentField()}
                {error && (
                  <p className="text-red-400 text-xs mt-3 bg-red-950/40 p-2.5 rounded border border-red-800/60">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-[#2A2A2A] hover:bg-[#333333] text-white py-3.5 rounded-lg font-medium transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-[#00A884] hover:bg-[#00c896] text-white py-3.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!validations[step - 1]()}
                >
                  {step < 6 ? 'Next' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2.5 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i + 1 <= step ? 'bg-[#00A884] scale-110' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#00A884] hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="mt-8 text-center text-gray-500 text-xs">
          <p className="flex items-center justify-center gap-1.5">
            <span className="text-[#00A884]">🔒</span>
            End-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
}