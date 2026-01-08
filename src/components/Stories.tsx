import { useState } from 'react';
import { X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addStory, viewStory } from '../store/storiesSlice';
import { Story } from '../types';

interface StoriesProps {
  onClose: () => void;
}

export default function Stories({ onClose }: StoriesProps) {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [newStoryText, setNewStoryText] = useState('');
  const [showAddStory, setShowAddStory] = useState(false);

  const { stories } = useAppSelector((state) => state.stories);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { chats } = useAppSelector((state) => state.chats);
  const dispatch = useAppDispatch();

  const userIds = Object.keys(stories);
  const currentUserId = userIds[currentUserIndex];
  const userStories = currentUserId ? stories[currentUserId] : [];
  const currentStory = userStories[currentStoryIndex];

  const getUserName = (userId: string) => {
    if (userId === currentUser?.id) return 'You';
    const chat = chats.find((c) => c.participants.includes(userId));
    return chat?.name || 'Unknown';
  };

  const handleNext = () => {
    if (currentStoryIndex < userStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentUserIndex < userIds.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
      const prevUserId = userIds[currentUserIndex - 1];
      setCurrentStoryIndex(stories[prevUserId].length - 1);
    }
  };

  const handleAddStory = () => {
    if (!newStoryText.trim() || !currentUser) return;

    const newStory: Story = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: newStoryText.trim(),
      type: 'text',
      backgroundColor: '#00A884',
      timestamp: Date.now(),
      views: [],
    };

    dispatch(addStory(newStory));
    setNewStoryText('');
    setShowAddStory(false);
  };

  if (showAddStory) {
    return (
      <div className="fixed inset-0 bg-[#111111] z-50 flex items-center justify-center">
        <button
          onClick={() => setShowAddStory(false)}
          className="absolute top-4 right-4 p-2 hover:bg-[#2A2A2A] rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="w-full max-w-md p-8">
          <h2 className="text-white text-2xl font-medium mb-6">Add Status</h2>
          <div className="space-y-4">
            <textarea
              value={newStoryText}
              onChange={(e) => setNewStoryText(e.target.value)}
              placeholder="Type your status..."
              className="w-full h-40 bg-[#1F1F1F] text-white px-4 py-3 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none resize-none"
              autoFocus
            />
            <button
              onClick={handleAddStory}
              disabled={!newStoryText.trim()}
              className="w-full bg-[#00A884] hover:bg-[#00A884]/90 disabled:bg-[#00A884]/50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
              Share Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStory) {
    return (
      <div className="fixed inset-0 bg-[#111111] z-50 flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[#2A2A2A] rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="text-center">
          <button
            onClick={() => setShowAddStory(true)}
            className="w-32 h-32 rounded-full bg-[#00A884] flex items-center justify-center mb-4 hover:bg-[#00A884]/90 transition-colors"
          >
            <Plus className="w-12 h-12 text-white" />
          </button>
          <p className="text-white text-lg">Add your first status</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#111111] z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-[#2A2A2A] rounded-full transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {currentUserIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 hover:bg-[#2A2A2A] rounded-full transition-colors z-10"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}

      {(currentStoryIndex < userStories.length - 1 || currentUserIndex < userIds.length - 1) && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 hover:bg-[#2A2A2A] rounded-full transition-colors z-10"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}

      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex gap-1 mb-4">
            {userStories.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx <= currentStoryIndex ? 'bg-[#00A884]' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white font-medium">
              {getUserName(currentUserId).charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-medium">{getUserName(currentUserId)}</h3>
              <p className="text-gray-400 text-sm">
                {new Date(currentStory.timestamp).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
          </div>

          <div
            className="w-full aspect-[9/16] rounded-lg flex items-center justify-center p-8"
            style={{
              backgroundColor: currentStory.backgroundColor || '#2A2A2A',
            }}
          >
            {currentStory.type === 'text' ? (
              <p className="text-white text-2xl text-center break-words">
                {currentStory.content}
              </p>
            ) : (
              <img
                src={currentStory.mediaUrl}
                alt="Story"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>

          {currentStory.views.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                👁️ {currentStory.views.length} view{currentStory.views.length > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
