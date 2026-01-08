import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Story } from '../types';

interface StoriesState {
  stories: Record<string, Story[]>;
}

const loadFromStorage = (): Record<string, Story[]> => {
  const stored = localStorage.getItem('stories');
  if (stored) {
    const stories = JSON.parse(stored);
    const now = Date.now();
    const filtered: Record<string, Story[]> = {};

    Object.keys(stories).forEach(userId => {
      const userStories = stories[userId].filter(
        (story: Story) => now - story.timestamp < 24 * 60 * 60 * 1000
      );
      if (userStories.length > 0) {
        filtered[userId] = userStories;
      }
    });

    return filtered;
  }
  return {};
};

const initialState: StoriesState = {
  stories: loadFromStorage(),
};

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setStories: (state, action: PayloadAction<Record<string, Story[]>>) => {
      state.stories = action.payload;
      localStorage.setItem('stories', JSON.stringify(state.stories));
    },
    addStory: (state, action: PayloadAction<Story>) => {
      const userId = action.payload.userId;
      if (!state.stories[userId]) {
        state.stories[userId] = [];
      }
      state.stories[userId].push(action.payload);
      localStorage.setItem('stories', JSON.stringify(state.stories));
    },
    viewStory: (state, action: PayloadAction<{ userId: string; storyId: string; viewerId: string }>) => {
      const { userId, storyId, viewerId } = action.payload;
      if (state.stories[userId]) {
        const story = state.stories[userId].find(s => s.id === storyId);
        if (story && !story.views.includes(viewerId)) {
          story.views.push(viewerId);
          localStorage.setItem('stories', JSON.stringify(state.stories));
        }
      }
    },
    cleanupExpiredStories: (state) => {
      const now = Date.now();
      Object.keys(state.stories).forEach(userId => {
        state.stories[userId] = state.stories[userId].filter(
          story => now - story.timestamp < 24 * 60 * 60 * 1000
        );
        if (state.stories[userId].length === 0) {
          delete state.stories[userId];
        }
      });
      localStorage.setItem('stories', JSON.stringify(state.stories));
    },
  },
});

export const { setStories, addStory, viewStory, cleanupExpiredStories } = storiesSlice.actions;
export default storiesSlice.reducer;
