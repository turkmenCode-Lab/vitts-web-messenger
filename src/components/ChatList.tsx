import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, Users, Star, CheckSquare, CheckCircle, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setActiveChat, setSearchQuery, setFilter } from '../store/chatsSlice';
import { logout } from '../store/authSlice';
import { formatTimestamp } from '../utils/formatters';

interface ChatListProps {
  onMenuClick: () => void;
  onStoryClick: () => void;
  onSettingsClick: () => void; // ← функция открытия настроек
}

export default function ChatList({ onMenuClick, onStoryClick, onSettingsClick }: ChatListProps) {
  const { chats, searchQuery, filter, activeChat } = useAppSelector((state) => state.chats);
  const { stories } = useAppSelector((state) => state.stories);
  const { currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню по клику вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleLogout = () => {
    dispatch(logout());
    setShowMenu(false);
  };

  const filteredChats = chats.filter((chat) => {
    const chatName = chat.name || '';
    const matchesSearch = chatName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && chat.unreadCount > 0) ||
      (filter === 'favourites' && chat.isFavourite) ||
      (filter === 'groups' && (chat.type === 'group' || chat.type === 'channel'));
    return matchesSearch && matchesFilter && !chat.isArchived;
  });

  const hasStories = Object.keys(stories).length > 0;

  return (
    <div className="h-full flex flex-col bg-[#111111] border-r border-[#2A2A2A] relative">
      {/* Header */}
      <div className="bg-[#1F1F1F] p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-medium flex-1 text-left">VITTS</h2>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-[#2A2A2A] rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>

            {/* Анимированное меню + оверлей */}
            <AnimatePresence>
              {showMenu && (
                <>
                  {/* Оверлей */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowMenu(false)}
                  />

                  {/* Меню */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`
                      absolute top-full mt-1 w-52 bg-[#1F1F1F] rounded-xl shadow-2xl overflow-hidden z-50
                      pt-1 pb-1
                      ${window.innerWidth >= 1024 ? 'left-0' : 'right-0'}
                    `}
                  >
                    {/* Десктоп/планшет версия */}
                    <div className="hidden lg:block">
                      <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#2A2A2A]/70 text-white text-left transition-colors text-xs">
                        <Users size={15} className="text-gray-400" />
                        <span>New Group</span>
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#2A2A2A]/70 text-white text-left transition-colors text-xs">
                        <Star size={15} className="text-gray-400" />
                        <span>Starred Messages</span>
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#2A2A2A]/70 text-white text-left transition-colors text-xs">
                        <CheckSquare size={15} className="text-gray-400" />
                        <span>Select Chats</span>
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#2A2A2A]/70 text-white text-left transition-colors text-xs">
                        <CheckCircle size={15} className="text-gray-400" />
                        <span>Mark all as read</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#2A2A2A]/70 text-red-400 text-left transition-colors text-xs"
                      >
                        <LogOut size={15} />
                        <span>Logout</span>
                      </button>
                    </div>

                    {/* Мобильная версия */}
                    <div className="lg:hidden">
                      <button className="w-full px-3 py-2 hover:bg-[#2A2A2A]/70 text-white text-left transition-colors text-xs">
                        New group
                      </button>
                      <button className="w-full px-3 py-2 hover:bg-[#2A2A2A]/70 text-white text-left transition-colors text-xs">
                        New channel
                      </button>
                      <button className="w-full px-3 py-2 hover:bg-[#2A2A2A]/70 text-white text-left transition-colors text-xs">
                        Linked devices
                      </button>
                      <button className="w-full px-3 py-2 hover:bg-[#2A2A2A]/70 text-white text-left transition-colors text-xs">
                        Starred
                      </button>
                      <button className="w-full px-3 py-2 hover:bg-[#2A2A2A]/70 text-white text-left transition-colors text-xs">
                        Read all
                      </button>
                      {/* Settings — открывает модальное окно настроек */}
                      <button
                        onClick={() => {
                          onSettingsClick(); // ← открывает настройки
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 hover:bg-[#2A2A2A]/70 text-white text-left transition-colors text-xs"
                      >
                        Settings
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Поиск или новый чат"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-[#111111] text-white pl-10 pr-4 py-2 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none"
          />
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {['all', 'unread', 'favourites', 'groups'].map((f) => (
            <button
              key={f}
              onClick={() => dispatch(setFilter(f as any))}
              className={`px-3 py-1 text-xs rounded-full transition-colors flex-shrink-0 ${
                filter === f ? 'bg-[#00A884] text-white' : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#333333]'
              }`}
            >
              {f === 'all' ? 'Все' :
               f === 'unread' ? 'Непрочит.' :
               f === 'favourites' ? 'Избран.' :
               'Группы'}
            </button>
          ))}
        </div>
      </div>

      {/* Мой статус */}
      {hasStories && (
        <button
          onClick={onStoryClick}
          className="flex items-center gap-3 p-4 hover:bg-[#1F1F1F] border-b border-[#2A2A2A] flex-shrink-0"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00A884] to-[#075E54] p-0.5">
              <div className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center text-white font-medium text-lg">
                {currentUser?.name?.charAt(0).toUpperCase() || 'V'}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00A884] rounded-full border-4 border-[#111111] flex items-center justify-center">
              <span className="text-white text-sm font-bold">+</span>
            </div>
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-medium">Мой статус</p>
            <p className="text-gray-400 text-sm">Нажмите, чтобы добавить обновление</p>
          </div>
        </button>
      )}

      {/* Список чатов */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Чаты не найдены</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => dispatch(setActiveChat(chat.id))}
              className={`w-full flex items-center gap-3 p-4 hover:bg-[#1F1F1F] transition-colors border-b border-[#2A2A2A] ${
                activeChat === chat.id ? 'bg-[#1F1F1F]' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white font-medium text-lg">
                  {(chat.name || '?').charAt(0).toUpperCase()}
                </div>
                {(chat.type === 'group' || chat.type === 'channel') && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#00A884] rounded-full border-2 border-[#111111] flex items-center justify-center">
                    {chat.type === 'group' ? (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l-3.293 3.293a1 1 0 01-1.414 0L4.22 15H2a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h2.586a1 1 0 01.707.293L11 16.586l3.293-3.293a1 1 0 01.707-.293H17a1 1 0 001-1V5a1 1 0 00-1-1H5z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-medium truncate">{chat.name || 'Неизвестный чат'}</h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">{formatTimestamp(chat.lastMessage.timestamp)}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm truncate">
                    {chat.lastMessage?.content || 'Сообщений пока нет'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="ml-2 min-w-[20px] h-5 px-2 bg-[#00A884] text-white text-xs rounded-full flex items-center justify-center">
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}