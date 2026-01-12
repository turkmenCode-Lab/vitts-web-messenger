import { configureStore, isPlain } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatsReducer from './chatsSlice';
import messagesReducer from './messagesSlice';
import storiesReducer from './storiesSlice';
import settingsReducer from './settingsSlice';

// Опционально: кастомная проверка сериализуемости (если хочешь быть строже)
const isSerializable = (value: unknown): boolean => {
  // Разрешаем Date → преобразуется в строку при JSON.stringify
  if (value instanceof Date) return true;
  // Разрешаем другие типы, если они действительно нужны
  return isPlain(value);
};

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
      // Самый эффективный способ убрать предупреждения при большом количестве сообщений
      serializableCheck: {
        // Отключаем проверку для частей стора, где много данных
        ignoredActions: [
          'messages/setMessages',
          'messages/addMessage',
          'messages/updateMessage',
          // добавь другие actions, которые часто работают с большими массивами
        ],
        ignoredPaths: [
          'messages',      // весь слайс messages
          'chats.list',    // если у тебя chats содержит большой массив
          'stories.items', // если сторис тоже могут быть тяжёлыми
        ],
        // Если хочешь быть очень строгим, можно оставить проверку только для auth и settings
        // warnAfter: 100, // можно увеличить порог предупреждения (по умолчанию 32 мс)
      },

      immutableCheck: {
        // Аналогично — отключаем для тяжёлых частей
        ignoredPaths: [
          'messages',
          'chats.list',
          'stories.items',
        ],
        // warnAfter: 100,
      },
    }),
  // devTools: process.env.NODE_ENV !== 'production',  // по умолчанию включены в dev
});

// Типы для использования в хуках
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Опционально: для удобства типизации thunk'ов и т.п.
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState
) => ReturnType;