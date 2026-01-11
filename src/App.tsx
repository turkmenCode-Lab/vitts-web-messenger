import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { setChats } from './store/chatsSlice';
import { setMessages } from './store/messagesSlice';
import { setStories, cleanupExpiredStories } from './store/storiesSlice';
import { generateMockChats, generateMockMessages, generateMockStories } from './utils/mockData';

// Auth screens
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';

// Main application components
import Sidebar from './components/Sidebar';
import MobileTabBar from './components/MobileTabBar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Stories from './components/Stories';
import ProfileView from './components/ProfileView';
import Settings from './components/Settings';

function App() {
  // ── UI States ───────────────────────────────────────────────────────────────
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'chats' | 'channels' | 'groups' | 'calls'>('chats');
  const [showStories, setShowStories] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Auth view switching
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // ── Redux States ────────────────────────────────────────────────────────────
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { chats, activeChat } = useAppSelector((state) => state.chats);
  const { theme } = useAppSelector((state) => state.settings);

  const dispatch = useAppDispatch();

  // Load mock data only once after successful authentication
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

  // Periodic cleanup of expired stories
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(cleanupExpiredStories());
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [dispatch]);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleMenuClick = (menu: string) => {
    if (menu === 'profile') setShowProfile(true);
    if (menu === 'settings') setShowSettings(true);
    setIsSidebarOpen(false);
  };

  // ── Not authenticated → show auth screens ──────────────────────────────────
  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginScreen onSwitchToSignUp={() => setAuthView('signup')} />
    ) : (
      <SignUpScreen onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  // ── Authenticated → main WhatsApp-like interface ───────────────────────────
  return (
    <div className={`h-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#111111]' : 'bg-gray-50'}`}>
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (left drawer) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onMenuClick={handleMenuClick}
        />

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel - Chat list / Channels / Groups / Calls */}
          <div
            className={`
              flex-shrink-0 w-full lg:w-[420px] flex flex-col border-r border-gray-800/40
              transition-transform duration-300 lg:translate-x-0
              ${activeChat ? 'hidden lg:block' : 'block'}
            `}
          >
            {mobileTab === 'chats' && (
              <ChatList
                onMenuClick={() => setIsSidebarOpen(true)}
                onStoryClick={() => setShowStories(true)}
              />
            )}

            {mobileTab === 'channels' && (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#0f0f0f]">
                <div className="text-center px-6">
                  <h2 className="text-2xl font-medium mb-3">Channels</h2>
                  <p className="text-sm opacity-70">Feature coming soon...</p>
                </div>
              </div>
            )}

            {mobileTab === 'groups' && (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#0f0f0f]">
                <div className="text-center px-6">
                  <h2 className="text-2xl font-medium mb-3">Groups</h2>
                  <p className="text-sm opacity-70">Feature coming soon...</p>
                </div>
              </div>
            )}

            {mobileTab === 'calls' && (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#0f0f0f]">
                <div className="text-center px-6">
                  <h2 className="text-2xl font-medium mb-3">Calls</h2>
                  <p className="text-sm opacity-70">Feature coming soon...</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat window / placeholder */}
          <div className="flex-1 min-w-0 relative bg-[#0f0f0f]">
            {activeChat ? (
              <ChatWindow
                onBack={() => dispatch({ type: 'chats/setActiveChat', payload: null })}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <div className="w-28 h-28 rounded-full bg-[#00A884]/10 flex items-center justify-center mb-8">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00A884"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-300 mb-2">Select a chat</h2>
                <p className="text-sm opacity-70 max-w-xs text-center">
                  Start a conversation with your friends and family
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation - shown only when no chat is selected */}
      {!activeChat && (
        <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />
      )}

      {/* Modals / Overlays */}
      {showStories && <Stories onClose={() => setShowStories(false)} />}
      {showProfile && <ProfileView onClose={() => setShowProfile(false)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;