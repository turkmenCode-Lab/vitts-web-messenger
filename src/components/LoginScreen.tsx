import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/authSlice';
import { User } from '../types';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'phone' | 'name'>('phone');
  const dispatch = useAppDispatch();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('name');
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const user: User = {
        id: 'current-user',
        phone,
        name: name.trim(),
        about: 'Hey there! I am using WhatsApp.',
        lastSeen: Date.now(),
        isOnline: true,
      };
      dispatch(login(user));
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00A884] mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">WhatsApp Web</h1>
          <p className="text-gray-400 text-sm">Send and receive messages without keeping your phone online.</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label className="block text-[#00A884] text-sm mb-2">Phone number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="+1 234 567 8900"
                  className="w-full bg-[#1F1F1F] text-white px-4 py-3 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Enter your phone number to continue
              </p>
            </div>

            <button
              type="submit"
              disabled={phone.length < 10}
              className="w-full bg-[#00A884] hover:bg-[#00A884]/90 disabled:bg-[#00A884]/50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
              Next
            </button>
          </form>
        ) : (
          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div>
              <label className="block text-[#00A884] text-sm mb-2">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-[#1F1F1F] text-white px-4 py-3 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
                autoFocus
              />
              <p className="text-gray-500 text-xs mt-2">
                This name will be visible to your contacts
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="flex-1 bg-[#2A2A2A] hover:bg-[#333333] text-white py-3 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 bg-[#00A884] hover:bg-[#00A884]/90 disabled:bg-[#00A884]/50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-gray-500 text-xs">
          <p className="flex items-center justify-center gap-1">
            <span className="text-[#00A884]">🔒</span>
            End-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
