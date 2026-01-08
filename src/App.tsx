import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { setChats } from './store/chatsSlice';
import { setMessages } from './store/messagesSlice';
import { setStories, cleanupExpiredStories } from './store/storiesSlice';
import { generateMockChats, generateMockMessages, generateMockStories } from './utils/mockData';

import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Stories from './components/Stories';
import ProfileView from './components/ProfileView';
import Settings from './components/Settings';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStories, setShowStories] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { chats, activeChat } = useAppSelector((state) => state.chats);
  const { theme } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated && chats.length === 0) {
      const mockChats = generateMockChats();
      const mockMessages = generateMockMessages();
      const mockStories = generateMockStories();

      dispatch(setChats(mockChats));
      Object.keys(mockMessages).forEach((chatId) => {
        dispatch(setMessages({ chatId, messages: mockMessages[chatId] }));
      });
      dispatch(setStories(mockStories));
    }
  }, [isAuthenticated, chats.length, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(cleanupExpiredStories());
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleMenuClick = (menu: string) => {
    if (menu === 'profile') {
      setShowProfile(true);
    } else if (menu === 'settings') {
      setShowSettings(true);
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#111111]' : 'bg-gray-50'}`}>
      <div className="h-screen flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onMenuClick={handleMenuClick}
        />

        {/* Главная область: ChatList + ChatWindow */}
        <div className="flex flex-1 overflow-hidden">
          {/* ChatList — фиксированная ширина, скрывается на мобильных при открытом чате */}
          <div className={`flex-shrink-0 w-full lg:w-[400px] ${activeChat ? 'hidden lg:flex' : 'flex'} flex-col`}>
            <ChatList
              onMenuClick={() => setIsSidebarOpen(true)}
              onStoryClick={() => setShowStories(true)}
            />
          </div>

          {/* ChatWindow — занимает ВСЁ оставшееся место */}
          <div className={`flex-1 ${activeChat ? 'flex' : 'hidden lg:flex'}`}>
            <ChatWindow
              onBack={() => dispatch({ type: 'chats/setActiveChat', payload: null })}
            />
          </div>
        </div>
      </div>

      {/* Модалки */}
      {showStories && <Stories onClose={() => setShowStories(false)} />}
      {showProfile && <ProfileView onClose={() => setShowProfile(false)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;