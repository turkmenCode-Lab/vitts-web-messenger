import { Search, Menu, MoreVertical } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setActiveChat, setSearchQuery, setFilter } from '../store/chatsSlice';
import { formatTimestamp } from '../utils/formatters';

interface ChatListProps {
  onMenuClick: () => void;
  onStoryClick: () => void;
}

export default function ChatList({ onMenuClick, onStoryClick }: ChatListProps) {
  const { chats, searchQuery, filter, activeChat } = useAppSelector((state) => state.chats);
  const { stories } = useAppSelector((state) => state.stories);
  const { currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && chat.unreadCount > 0) ||
      (filter === 'favourites' && chat.isFavourite) ||
      (filter === 'groups' && chat.type === 'group');
    return matchesSearch && matchesFilter && !chat.isArchived;
  });

  const hasStories = Object.keys(stories).length > 0;

  return (
    <div className="w-full lg:w-[400px] bg-[#111111] border-r border-[#2A2A2A] flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#1F1F1F] p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-[#2A2A2A] rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
          <h2 className="text-white text-xl font-medium flex-1 lg:flex-none">Chats</h2>
          <button className="p-2 hover:bg-[#2A2A2A] rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-[#111111] text-white pl-10 pr-4 py-2 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {['all', 'unread', 'favourites', 'groups'].map((f) => (
            <button
              key={f}
              onClick={() => dispatch(setFilter(f as any))}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-[#00A884] text-white'
                  : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#333333]'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* My Status */}
      {hasStories && (
        <button
          onClick={onStoryClick}
          className="flex items-center gap-3 p-4 hover:bg-[#1F1F1F] transition-colors border-b border-[#2A2A2A]"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00A884] to-[#075E54] p-0.5">
              <div className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center text-white font-medium">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-medium">My Status</p>
            <p className="text-gray-400 text-sm">Tap to add status update</p>
          </div>
        </button>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => dispatch(setActiveChat(chat.id))}
            className={`w-full flex items-center gap-3 p-4 hover:bg-[#1F1F1F] transition-colors border-b border-[#2A2A2A] ${
              activeChat === chat.id ? 'bg-[#1F1F1F]' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white font-medium">
                {chat.name.charAt(0).toUpperCase()}
              </div>
              {chat.type === 'group' && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#00A884] rounded-full border-2 border-[#111111]" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-white font-medium truncate">{chat.name}</h3>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(chat.lastMessage.timestamp)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm truncate">
                  {chat.lastMessage?.content || 'No messages yet'}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 min-w-[20px] h-5 px-2 bg-[#00A884] text-white text-xs rounded-full flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
}