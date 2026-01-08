import { X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateSettings } from '../store/settingsSlice';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      dispatch(updateSettings({ [key]: !settings[key] }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#111111] rounded-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-[#1F1F1F] px-6 py-4 flex items-center justify-between border-b border-[#2A2A2A]">
          <h2 className="text-white text-xl font-medium">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2A2A2A] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Enable Notifications</p>
                    <p className="text-gray-400 text-sm">Get notified about new messages</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.notifications ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Sound</p>
                    <p className="text-gray-400 text-sm">Play sound for notifications</p>
                  </div>
                  <button
                    onClick={() => handleToggle('soundEnabled')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.soundEnabled ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white text-lg font-medium mb-4">Privacy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Read Receipts</p>
                    <p className="text-gray-400 text-sm">Let others know when you've read their messages</p>
                  </div>
                  <button
                    onClick={() => handleToggle('readReceipts')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.readReceipts ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.readReceipts ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Last Seen</p>
                    <p className="text-gray-400 text-sm">Show when you were last online</p>
                  </div>
                  <button
                    onClick={() => handleToggle('lastSeenVisible')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.lastSeenVisible ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.lastSeenVisible ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <p className="text-white mb-2">Profile Photo</p>
                  <select
                    value={settings.profilePhotoVisible}
                    onChange={(e) =>
                      dispatch(
                        updateSettings({ profilePhotoVisible: e.target.value as any })
                      )
                    }
                    className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">My Contacts</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white text-lg font-medium mb-4">Chat Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Enter to Send</p>
                    <p className="text-gray-400 text-sm">Press Enter to send messages</p>
                  </div>
                  <button
                    onClick={() => handleToggle('enterToSend')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.enterToSend ? 'bg-[#00A884]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.enterToSend ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
