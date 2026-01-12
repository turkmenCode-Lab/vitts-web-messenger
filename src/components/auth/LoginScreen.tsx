import { useState } from 'react';
import { MessageCircle, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/authSlice';
import { User } from '../../types';

interface LoginScreenProps {
  onSwitchToSignUp: () => void;
}

export default function LoginScreen({ onSwitchToSignUp }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const dispatch = useAppDispatch();

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Пароль должен содержать минимум 8 символов';
    if (!/[A-Z]/.test(pwd)) return 'Пароль должен содержать хотя бы одну заглавную букву';
    if (!/[a-z]/.test(pwd)) return 'Пароль должен содержать хотя бы одну строчную букву';
    if (!/[0-9]/.test(pwd)) return 'Пароль должен содержать хотя бы одну цифру';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Введите номер телефона или email';
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    } else if (!password) {
      newErrors.password = 'Введите пароль';
    }

    setErrors(newErrors);

    // Если ошибок нет → логин
    if (Object.keys(newErrors).length === 0) {
      const isPhone = identifier.startsWith('+');
      const mockUser: User = {
        id: 'demo-user-' + Date.now(),
        phone: isPhone ? identifier : '',
        email: isPhone ? '' : identifier,
        username: 'user_' + Math.floor(Math.random() * 10000),
        name: 'Demo User',
        about: 'Привет! Я использую это приложение.',
        lastSeen: Date.now(),
        isOnline: true,
      };
      dispatch(login(mockUser));
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00A884] mb-6 mx-auto">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">Вход</h1>
          <p className="text-gray-400 text-sm">С возвращением!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Поле Телефон / Email */}
          <div>
            <label className="block text-[#00A884] text-sm mb-2">Телефон или email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="+66 123 456 789 или example@email.com"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
            {errors.identifier && (
              <p className="text-red-400 text-xs mt-2 bg-red-950/30 p-2 rounded border border-red-800/50">
                {errors.identifier}
              </p>
            )}
          </div>

          {/* Поле Пароль */}
          <div>
            <label className="block text-[#00A884] text-sm mb-2">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} /> }
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-2 bg-red-950/30 p-2 rounded border border-red-800/50">
                {errors.password}
              </p>
            )}
          </div>

          {/* Кнопка */}
          <button
            type="submit"
            className="w-full bg-[#00A884] hover:bg-[#00c896] text-white py-3.5 rounded-lg font-medium transition-colors mt-4"
          >
            Войти
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Нет аккаунта?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-[#00A884] hover:underline font-medium"
            >
              Зарегистрироваться
            </button>
          </p>
        </div>

        <div className="mt-10 text-center text-gray-500 text-xs">
          <p className="flex items-center justify-center gap-1.5">
            <span className="text-[#00A884]">🔒</span>
            Сквозное шифрование
          </p>
        </div>
      </div>
    </div>
  );
}