import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/authSlice';
import { User } from '../types';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const dispatch = useAppDispatch();

  // Валидация каждого шага
  const validatePhone = () => {
    if (!phone.startsWith('+') || phone.length < 11 || /\D/.test(phone.slice(1))) {
      setError('Номер должен начинаться с "+" и содержать минимум 10 цифр');
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Пожалуйста, введите корректный email');
      return false;
    }
    return true;
  };

  const validateUsername = () => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,}$/;

    if (!usernameRegex.test(username)) {
      if (!username) {
        setError('Введите имя пользователя');
      } else if (!/^[a-zA-Z]/.test(username)) {
        setError('Имя пользователя должно начинаться с буквы');
      } else if (username.length < 3) {
        setError('Минимум 3 символа');
      } else {
        setError('Разрешены только буквы, цифры и нижнее подчёркивание (_)');
      }
      return false;
    }
    return true;
  };

  const validateName = () => {
    if (!name.trim()) {
      setError('Пожалуйста, введите ваше имя');
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return false;
    }
    return true;
  };

  const validateConfirmPassword = () => {
    if (confirmPassword !== password) {
      setError('Пароли не совпадают');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validators = [
      validatePhone,
      validateEmail,
      validateUsername,
      validateName,
      validatePassword,
      validateConfirmPassword,
    ];

    if (validators[step - 1]()) {
      setDirection('forward');
      if (step < 6) {
        setStep(step + 1);
      } else {
        // Финальная регистрация
        const user: User = {
          id: 'current-user',
          phone,
          email,
          username,
          name: name.trim(),
          about: 'Hey there! I am using WhatsApp.',
          lastSeen: Date.now(),
          isOnline: true,
        };
        dispatch(login(user));
      }
    }
  };

  const handleBack = () => {
    setError('');
    setDirection('back');
    setStep(step - 1);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Разрешаем только + в начале и цифры дальше
    if (value === '' || value.startsWith('+')) {
      value = '+' + value.slice(1).replace(/\D/g, '');
    } else {
      value = value.replace(/\D/g, '');
    }
    setPhone(value);
  };

  // Контент текущего шага
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Номер телефона</label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+12345678900"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
            <p className="text-gray-500 text-xs mt-2">Начинайте с знака "+"</p>
          </>
        );

      case 2:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="example@email.com"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
          </>
        );

      case 3:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ivan123"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
            <p className="text-gray-500 text-xs mt-2">
              Начинается с буквы, минимум 3 символа (буквы, цифры, _)
            </p>
          </>
        );

      case 4:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Полное имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван Иванов"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
          </>
        );

      case 5:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
            <p className="text-gray-500 text-xs mt-2">Минимум 8 символов</p>
          </>
        );

      case 6:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">Подтвердите пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
          </>
        );

      default:
        return null;
    }
  };

  // Определяем, активна ли кнопка "Далее"
  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return phone.length < 11 || !phone.startsWith('+');
      case 2:
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      case 3:
        return !/^[a-zA-Z][a-zA-Z0-9_]{2,}$/.test(username);
      case 4:
        return !name.trim();
      case 5:
        return password.length < 8;
      case 6:
        return !confirmPassword || confirmPassword !== password;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Заголовок */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00A884] mb-6 mx-auto">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">WhatsApp Web</h1>
          <p className="text-gray-400 text-sm">Создайте аккаунт за минуту</p>
        </div>

        {/* Контейнер с анимацией */}
        <div className="relative overflow-hidden min-h-[260px]">
          <div
            key={step}
            className={`
              absolute inset-0 transition-all duration-400 ease-in-out
              ${direction === 'forward' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'}
              [&.active]:translate-x-0
              [&.active]:opacity-100
            `}
          >
            <form onSubmit={handleSubmit} className="space-y-6 active">
              <div>
                {renderStepContent()}

                {error && (
                  <p className="text-red-400 text-xs mt-3 bg-red-950/40 p-3 rounded-lg border border-red-900/50">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white py-3.5 rounded-lg font-medium transition-colors"
                  >
                    Назад
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isNextDisabled()}
                  className="flex-1 bg-[#00A884] hover:bg-[#00A884]/90 disabled:bg-[#00A884]/40 disabled:cursor-not-allowed text-white py-3.5 rounded-lg font-medium transition-colors"
                >
                  {step < 6 ? 'Далее' : 'Создать аккаунт'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="flex justify-center gap-2.5 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i + 1 <= step
                  ? 'bg-[#00A884] scale-110'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Футер */}
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