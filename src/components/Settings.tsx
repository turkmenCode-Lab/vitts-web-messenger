import { useState } from 'react';
import { X, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateSettings } from '../store/settingsSlice';
import { logout } from '../store/authSlice';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  // Состояние для модального окна выхода
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      dispatch(updateSettings({ [key]: !settings[key] }));
    }
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    onClose(); // закрываем настройки после выхода
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-[#111111] rounded-xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl border border-[#2A2A2A]">
          {/* Заголовок */}
          <div className="bg-[#1F1F1F] px-6 py-4 flex items-center justify-between border-b border-[#2A2A2A]">
            <h2 className="text-white text-xl font-medium">Настройки</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2A2A2A] rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Контент настроек */}
          <div className="flex-1 overflow-y-auto p-6 space-y-10">
            {/* Notifications */}
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Уведомления</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Включить уведомления</p>
                    <p className="text-gray-400 text-sm">Получать уведомления о новых сообщениях</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings.notifications ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Звук уведомлений</p>
                    <p className="text-gray-400 text-sm">Воспроизводить звук при получении сообщений</p>
                  </div>
                  <button
                    onClick={() => handleToggle('soundEnabled')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings.soundEnabled ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Конфиденциальность</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Квитанции прочтения</p>
                    <p className="text-gray-400 text-sm">Показывать другим, когда вы прочитали сообщение</p>
                  </div>
                  <button
                    onClick={() => handleToggle('readReceipts')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings.readReceipts ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.readReceipts ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Время последнего входа</p>
                    <p className="text-gray-400 text-sm">Показывать время вашей последней активности</p>
                  </div>
                  <button
                    onClick={() => handleToggle('lastSeenVisible')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings.lastSeenVisible ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.lastSeenVisible ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <p className="text-white mb-2">Фото профиля видно</p>
                  <select
                    value={settings.profilePhotoVisible}
                    onChange={(e) =>
                      dispatch(updateSettings({ profilePhotoVisible: e.target.value as any }))
                    }
                    className="w-full bg-[#1F1F1F] text-white px-4 py-2.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
                  >
                    <option value="everyone">Всем</option>
                    <option value="contacts">Моим контактам</option>
                    <option value="nobody">Никому</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Chat Settings */}
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Настройки чата</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Отправка по Enter</p>
                    <p className="text-gray-400 text-sm">Отправлять сообщение нажатием клавиши Enter</p>
                  </div>
                  <button
                    onClick={() => handleToggle('enterToSend')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings.enterToSend ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.enterToSend ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Кнопка выхода */}
            <div className="pt-8 mt-8 border-t border-[#2A2A2A]">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center justify-center gap-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 py-3.5 rounded-lg font-medium transition-colors border border-red-800/40"
              >
                <LogOut className="w-5 h-5" />
                Выйти из аккаунта
              </button>
              <p className="text-gray-500 text-xs text-center mt-2">
                Выход завершит текущую сессию
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения выхода */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111111] rounded-xl max-w-sm w-full overflow-hidden border border-[#2A2A2A] shadow-2xl">
            {/* Заголовок модалки */}
            <div className="px-6 py-5 border-b border-[#2A2A2A]">
              <h3 className="text-white text-xl font-medium text-center">
                Выйти из аккаунта?
              </h3>
            </div>

            {/* Текст */}
            <div className="p-6 text-center">
              <p className="text-gray-300 mb-6">
                Вы будете разлогинены и вернётесь на экран входа.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-[#2A2A2A] hover:bg-[#333333] text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Отмена
                </button>

                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}