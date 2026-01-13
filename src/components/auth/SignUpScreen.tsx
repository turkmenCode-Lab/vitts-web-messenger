import { useState } from "react";
import { MessageCircle, Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "../../store/hooks";
import { login } from "../../store/authSlice";
import type { User } from "../../types";

interface SignUpScreenProps {
  onSwitchToLogin: () => void;
}

export default function SignUpScreen({ onSwitchToLogin }: SignUpScreenProps) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});
  const [registerError, setRegisterError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const getPhoneDigits = (val: string) => val.replace(/[^\d]/g, "");

  const validationRules = [
    {
      check: () => {
        const digits = getPhoneDigits(phone);
        return !phone.startsWith("+") || digits.length < 10;
      },
      message: 'Номер должен начинаться с "+" и содержать минимум 10 цифр',
    },
    {
      check: () => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
      message: "Введите корректный email",
    },
    {
      check: () => !/^[a-zA-Z][a-zA-Z0-9_]{2,}$/.test(username.trim()),
      message:
        "Имя пользователя: начинается с буквы, минимум 3 символа (буквы, цифры, _)",
    },
    {
      check: () => !name.trim(),
      message: "Введите ваше имя",
    },
    {
      check: () =>
        password.length < 8 ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password),
      message: "Пароль: минимум 8 символов, строчная буква и цифра",
    },
    {
      check: () => confirmPassword !== password,
      message: "Пароли не совпадают",
    },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    const currentRule = validationRules[step - 1];
    if (currentRule?.check()) {
      setFieldErrors((prev) => ({ ...prev, [step]: currentRule.message }));
      return;
    }

    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[step];
      return newErrors;
    });

    if (step < 6) {
      setStep(step + 1);
      return;
    }

    // Регистрация
    setRegisterError(null);

    try {
      const stored = localStorage.getItem("users");
      let users: Array<User & { password: string }> = [];

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) users = parsed;
        } catch {
          console.warn(
            "Повреждённые данные users → начинаем с пустого массива"
          );
        }
      }

      const trimmedPhone = phone.trim();
      const trimmedEmail = email.trim();
      const trimmedUsername = username.trim();
      const trimmedName = name.trim();

      // Проверка уникальности
      if (users.some((u) => u.username === trimmedUsername)) {
        setFieldErrors((prev) => ({
          ...prev,
          3: "Это имя пользователя уже занято",
        }));
        return;
      }
      if (users.some((u) => u.phone === trimmedPhone)) {
        setFieldErrors((prev) => ({
          ...prev,
          1: "Этот номер телефона уже зарегистрирован",
        }));
        return;
      }
      if (users.some((u) => u.email === trimmedEmail)) {
        setFieldErrors((prev) => ({
          ...prev,
          2: "Этот email уже зарегистрирован",
        }));
        return;
      }

      const newUser: User & { password: string } = {
        id: `user-${Date.now()}${Math.floor(Math.random() * 1000)}`,
        phone: trimmedPhone,
        email: trimmedEmail,
        username: trimmedUsername,
        name: trimmedName,
        about: "Привет! Я использую это приложение.",
        lastSeen: Date.now(),
        isOnline: true,
        password, // ← просто пароль как строка (без хеширования)
      };

      const updated = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(updated));

      // Автологин
      const { password: _, ...safeUser } = newUser;
      dispatch(login(safeUser));

      console.log("Аккаунт успешно создан:", trimmedUsername);
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      setRegisterError("Не удалось создать аккаунт. Попробуйте позже.");
    }
  };

  const handleBack = () => {
    setFieldErrors({});
    setRegisterError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const isCurrentStepValid = !validationRules[step - 1]?.check();

  const renderCurrentField = () => {
    const error = fieldErrors[step];

    switch (step) {
      case 1:
        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">
              Номер телефона
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                let val = e.target.value;
                val = "+" + val.replace(/[^\d+]/g, "").replace(/^\+/, "");
                setPhone(val);
              }}
              placeholder="+821012341234"
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs mt-2 bg-red-950/30 p-2 rounded">
                {error}
              </p>
            )}
          </>
        );

      case 2:
      case 3:
      case 4:
        const fields = [
          null,
          null,
          {
            label: "Email",
            value: email,
            setter: setEmail,
            placeholder: "example@email.com",
          },
          {
            label: "Имя пользователя",
            value: username,
            setter: setUsername,
            placeholder: "johndoe123",
          },
          {
            label: "Полное имя",
            value: name,
            setter: setName,
            placeholder: "John Doe",
          },
        ];

        const field = fields[step];
        if (!field) return null;

        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs mt-2 bg-red-950/30 p-2 rounded">
                {error}
              </p>
            )}
          </>
        );

      case 5:
      case 6:
        const isConfirm = step === 6;
        const show = isConfirm ? showConfirmPassword : showPassword;
        const toggle = isConfirm ? setShowConfirmPassword : setShowPassword;
        const value = isConfirm ? confirmPassword : password;
        const setValue = isConfirm ? setConfirmPassword : setPassword;
        const label = isConfirm ? "Подтвердите пароль" : "Пароль";

        return (
          <>
            <label className="block text-[#00A884] text-sm mb-2">{label}</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1F1F1F] text-white px-4 py-3.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] pr-11"
                autoFocus
              />
              <button
                type="button"
                onClick={() => toggle(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-2 bg-red-950/30 p-2 rounded">
                {error}
              </p>
            )}
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
          <h1 className="text-3xl font-light text-white mb-2">Регистрация</h1>
          <p className="text-gray-400 text-sm">Шаг {step} из 6</p>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          <div>{renderCurrentField()}</div>

          {registerError && (
            <p className="text-red-400 text-sm text-center bg-red-950/40 p-3 rounded border border-red-800/50">
              {registerError}
            </p>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-[#2A2A2A] hover:bg-[#333333] text-white py-3.5 rounded-lg font-medium transition-colors"
              >
                Назад
              </button>
            )}
            <button
              type="submit"
              disabled={!isCurrentStepValid}
              className={`flex-1 py-3.5 rounded-lg font-medium transition-colors ${
                isCurrentStepValid
                  ? "bg-[#00A884] hover:bg-[#00c896] text-white"
                  : "bg-[#00A884]/50 cursor-not-allowed text-white/60"
              }`}
            >
              {step < 6 ? "Далее" : "Создать аккаунт"}
            </button>
          </div>
        </form>

        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i + 1 <= step ? "bg-[#00A884]" : "bg-gray-700"
              }`}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Уже есть аккаунт?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#00A884] hover:underline font-medium"
            >
              Войти
            </button>
          </p>
        </div>

        <div className="mt-8 text-center text-gray-500 text-xs">
          <p className="flex items-center justify-center gap-1.5">
            <span className="text-[#00A884]">🔒</span>
            Сквозное шифрование
          </p>
        </div>
      </div>
    </div>
  );
}
