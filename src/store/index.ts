import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatsReducer from './chatsSlice';
import messagesReducer from './messagesSlice';
import storiesReducer from './storiesSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    messages: messagesReducer,
    stories: storiesReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
