import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { setChats } from './store/chatsSlice';
import { setMessages } from './store/messagesSlice';
import { setStories, cleanupExpiredStories } from './store/storiesSlice';
import { generateMockChats, generateMockMessages, generateMockStories } from './utils/mockData';

// Auth screens
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';

// Main components
import Sidebar from './components/Sidebar';
import MobileTabBar from './components/MobileTabBar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Stories from './components/Stories';
import ProfileView from './components/ProfileView';
import Settings from './components/Settings';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'chats' | 'channels' | 'groups' | 'calls'>('chats');
  const [showStories, setShowStories] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { chats, activeChat } = useAppSelector((state) => state.chats);
  const { theme } = useAppSelector((state) => state.settings);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated || chats.length > 0) return;

    const initializeMockData = () => {
      const mockChats = generateMockChats();
      const mockMessages = generateMockMessages();
      const mockStories = generateMockStories();

      dispatch(setChats(mockChats));
      Object.entries(mockMessages).forEach(([chatId, messages]) => {
        dispatch(setMessages({ chatId, messages }));
      });
      dispatch(setStories(mockStories));
    };

    initializeMockData();
  }, [isAuthenticated, chats.length, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => dispatch(cleanupExpiredStories()), 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleMenuClick = (menu: string) => {
    if (menu === 'profile') setShowProfile(true);
    if (menu === 'settings') setShowSettings(true);
    setIsSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginScreen onSwitchToSignUp={() => setAuthView('signup')} />
    ) : (
      <SignUpScreen onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#111111]' : 'bg-gray-50'}`}>
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onMenuClick={handleMenuClick}
        />

        <div className="flex-1 flex overflow-hidden">
          <div
            className={`
              flex-shrink-0 w-full lg:w-[420px] flex flex-col border-r border-gray-800/40
              ${activeChat ? 'hidden lg:block' : 'block'}
            `}
          >
            {mobileTab === 'chats' && (
              <ChatList
                onMenuClick={() => setIsSidebarOpen(true)}
                onStoryClick={() => setShowStories(true)}
              />
            )}
            {mobileTab === 'channels' && <div className="flex-1 flex items-center justify-center text-gray-400">Channels (coming soon)</div>}
            {mobileTab === 'groups' && <div className="flex-1 flex items-center justify-center text-gray-400">Groups (coming soon)</div>}
            {mobileTab === 'calls' && <div className="flex-1 flex items-center justify-center text-gray-400">Calls (coming soon)</div>}
          </div>

          <div className="flex-1 min-w-0 relative bg-[#0f0f0f]">
            {activeChat ? (
              <ChatWindow onBack={() => dispatch({ type: 'chats/setActiveChat', payload: null })} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <div className="w-28 h-28 rounded-full bg-[#00A884]/10 flex items-center justify-center mb-8">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#00A884" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-300 mb-2">Выберите чат</h2>
                <p className="text-sm opacity-70 max-w-xs text-center">Начните общение с друзьями</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {!activeChat && <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />}

      {showStories && <Stories onClose={() => setShowStories(false)} />}
      {showProfile && <ProfileView onClose={() => setShowProfile(false)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;