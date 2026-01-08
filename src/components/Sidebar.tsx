import { useState, useEffect } from 'react';
import {
  Archive,
  User,
  Users,
  Phone,
  Bookmark,
  Settings,
  Moon,
  Sun,
  MessageCircle,
  Radio,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleTheme } from '../store/settingsSlice';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuClick: (menu: string) => void;
}

export default function Sidebar({ isOpen, onClose, onMenuClick }: SidebarProps) {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const menuItems = [
    { id: 'profile', icon: User, label: 'My Profile' },
    { id: 'archived', icon: Archive, label: 'Archived Chats' },
    { id: 'new-group', icon: Users, label: 'New Group' },
    { id: 'new-channel', icon: Radio, label: 'New Channel' },
    { id: 'contacts', icon: MessageCircle, label: 'Contacts' },
    { id: 'calls', icon: Phone, label: 'Calls' },
    { id: 'saved', icon: Bookmark, label: 'Saved Messages' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  // НОВАЯ ШИРИНА: collapsed — 64px, expanded — 280px (w-72)
  const sidebarWidth = isCollapsed ? 'w-16' : 'w-72';
  const textVisibility = isCollapsed ? 'hidden' : 'block';

  return (
    <>
      {/* Overlay для мобильных */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Сайдбар */}
      <div
        className={`fixed lg:relative top-0 left-0 h-full bg-[#111111] border-r border-[#2A2A2A] z-50 flex flex-col transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarWidth}`}
      >
        {/* Кнопка сворачивания */}
        <div className="hidden lg:flex justify-end p-3">
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg text-gray-400 hover:bg-[#1F1F1F] transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Меню — кнопки на всю ширину */}
        <nav className="flex-1 overflow-hidden">
          <div className={`flex flex-col ${isCollapsed ? 'items-center gap-4' : 'gap-1'}`}>
            {menuItems.map((item) => (
              <div key={item.id} className="relative group w-full">
                <button
                  onClick={() => {
                    onMenuClick(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-4 py-3 rounded-lg text-gray-300 hover:bg-[#1F1F1F] transition-colors ${
                    isCollapsed
                      ? 'justify-center'
                      : 'justify-start pl-5 pr-4'  // чуть меньше отступ слева для компактности
                  }`}
                >
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  <span className={`text-sm font-medium ${textVisibility} truncate`}>
                    {item.label}
                  </span>
                </button>

                {/* Tooltip в свёрнутом режиме */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-4 py-2 bg-[#1F1F1F] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Нижняя часть */}
        <div className="border-t border-[#2A2A2A] p-4 space-y-3">
          {/* Переключатель темы */}
          <div className="relative group w-full">
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`w-full flex items-center gap-4 py-3 rounded-lg text-gray-300 hover:bg-[#1F1F1F] transition-colors ${
                isCollapsed ? 'justify-center' : 'justify-start pl-5 pr-4'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-6 h-6 flex-shrink-0" /> : <Moon className="w-6 h-6 flex-shrink-0" />}
              <span className={`text-sm font-medium ${textVisibility}`}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-4 py-2 bg-[#1F1F1F] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </div>
            )}
          </div>

          {/* Профиль */}
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'pl-1'}`}>
            <div className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center text-white text-lg font-medium flex-shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={`min-w-0 ${textVisibility}`}>
              <h3 className="text-white text-sm font-medium truncate">
                {currentUser?.name || 'User'}
              </h3>
              <p className="text-[#00A884] text-xs">Online</p>
            </div>
          </div>

          {/* Версия */}
          <p className={`text-center text-xs text-gray-500 ${textVisibility}`}>
            WhatsApp Web Clone v1.0
          </p>
        </div>
      </div>
    </>
  );
}