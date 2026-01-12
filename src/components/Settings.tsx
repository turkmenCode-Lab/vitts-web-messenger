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

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      dispatch(updateSettings({ [key]: !settings[key] }));
    }
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    onClose();
  };

  return (
    <>
      {/* Основное окно настроек — адаптивное */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-[#111111] rounded-xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl border border-[#2A2A2A]">
          {/* Заголовок — адаптивный */}
          <div className="bg-[#1F1F1F] px-5 py-4 sm:px-6 flex items-center justify-between border-b border-[#2A2A2A]">
            <h2 className="text-white text-lg sm:text-xl font-medium">Настройки</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2A2A2A] rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Контент — скроллится, адаптивные отступы */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8 sm:space-y-10">
            {/* Notifications */}
            <div>
              <h3 className="text-white text-base sm:text-lg font-medium mb-3 sm:mb-4">Уведомления</h3>
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm sm:text-base">Включить уведомления</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Получать уведомления о новых сообщениях</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications')}
                    className={`relative w-11 h-6 sm:w-12 sm:h-6 rounded-full transition-colors duration-200 ${
                      settings.notifications ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.notifications ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm sm:text-base">Звук уведомлений</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Воспроизводить звук при получении сообщений</p>
                  </div>
                  <button
                    onClick={() => handleToggle('soundEnabled')}
                    className={`relative w-11 h-6 sm:w-12 sm:h-6 rounded-full transition-colors duration-200 ${
                      settings.soundEnabled ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.soundEnabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div>
              <h3 className="text-white text-base sm:text-lg font-medium mb-3 sm:mb-4">Конфиденциальность</h3>
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm sm:text-base">Квитанции прочтения</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Показывать другим, когда вы прочитали сообщение</p>
                  </div>
                  <button
                    onClick={() => handleToggle('readReceipts')}
                    className={`relative w-11 h-6 sm:w-12 sm:h-6 rounded-full transition-colors duration-200 ${
                      settings.readReceipts ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.readReceipts ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm sm:text-base">Время последнего входа</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Показывать время вашей последней активности</p>
                  </div>
                  <button
                    onClick={() => handleToggle('lastSeenVisible')}
                    className={`relative w-11 h-6 sm:w-12 sm:h-6 rounded-full transition-colors duration-200 ${
                      settings.lastSeenVisible ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.lastSeenVisible ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <p className="text-white text-sm sm:text-base mb-2">Фото профиля видно</p>
                  <select
                    value={settings.profilePhotoVisible}
                    onChange={(e) =>
                      dispatch(updateSettings({ profilePhotoVisible: e.target.value as any }))
                    }
                    className="w-full bg-[#1F1F1F] text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors text-sm"
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
              <h3 className="text-white text-base sm:text-lg font-medium mb-3 sm:mb-4">Настройки чата</h3>
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm sm:text-base">Отправка по Enter</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Отправлять сообщение нажатием клавиши Enter</p>
                  </div>
                  <button
                    onClick={() => handleToggle('enterToSend')}
                    className={`relative w-11 h-6 sm:w-12 sm:h-6 rounded-full transition-colors duration-200 ${
                      settings.enterToSend ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.enterToSend ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
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
                className="w-full flex items-center justify-center gap-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 py-3 sm:py-3.5 rounded-lg font-medium transition-colors border border-red-800/40 text-sm sm:text-base"
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

      {/* Модальное окно подтверждения выхода — тоже responsive */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111111] rounded-xl w-full max-w-xs sm:max-w-sm overflow-hidden border border-[#2A2A2A] shadow-2xl">
            <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-[#2A2A2A]">
              <h3 className="text-white text-lg sm:text-xl font-medium text-center">
                Выйти из аккаунта?
              </h3>
            </div>

            <div className="p-5 sm:p-6 text-center">
              <p className="text-gray-300 text-sm sm:text-base mb-5 sm:mb-6">
                Вы будете разлогинены и вернётесь на экран входа.
              </p>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-[#2A2A2A] hover:bg-[#333333] text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  Отмена
                </button>

                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
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