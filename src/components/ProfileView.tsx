import { X, Phone, Mail, User, Calendar } from 'lucide-react';
import { useAppSelector } from '../store/hooks';

interface ProfileViewProps {
  userId?: string;
  onClose: () => void;
}

export default function ProfileView({ userId, onClose }: ProfileViewProps) {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { chats } = useAppSelector((state) => state.chats);

  const isOwnProfile = !userId || userId === currentUser?.id;
  const user = isOwnProfile ? currentUser : null;
  const chat = userId ? chats.find((c) => c.participants.includes(userId)) : null;

  const displayName = isOwnProfile ? user?.name : chat?.name || 'Unknown';
  const displayPhone = isOwnProfile ? user?.phone : '+1 234 567 8900';
  const displayAbout = isOwnProfile ? user?.about : 'Hey there! I am using WhatsApp.';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111111] rounded-lg overflow-hidden">
        <div className="bg-[#1F1F1F] px-6 py-4 flex items-center justify-between border-b border-[#2A2A2A]">
          <h2 className="text-white text-xl font-medium">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2A2A2A] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full bg-[#00A884] flex items-center justify-center text-white text-4xl font-medium mb-4">
              {displayName?.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-white text-2xl font-medium">{displayName}</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-[#00A884] text-sm mb-1">Phone</p>
                <p className="text-white">{displayPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-[#00A884] text-sm mb-1">About</p>
                <p className="text-white">{displayAbout}</p>
              </div>
            </div>

            {user?.username && (
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-[#00A884] text-sm mb-1">Username</p>
                  <p className="text-white">@{user.username}</p>
                </div>
              </div>
            )}

            {user?.birthday && (
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-[#00A884] text-sm mb-1">Birthday</p>
                  <p className="text-white">{user.birthday}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <div className="px-6 pb-6">
            <button className="w-full bg-[#00A884] hover:bg-[#00A884]/90 text-white py-3 rounded-lg font-medium transition-colors">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
