// src/store/index.ts или src/store.ts
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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // игнорируем предупреждения о несериализуемых значениях в тяжёлых слайсах
        ignoredActions: ['messages/setMessages', 'messages/addMessage'],
        ignoredPaths: ['messages', 'chats.list', 'stories.items'],
      },
      immutableCheck: {
        ignoredPaths: ['messages', 'chats.list', 'stories.items'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;