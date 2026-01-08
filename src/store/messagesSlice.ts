import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../types';

interface MessagesState {
  messages: Record<string, Message[]>;
}

const loadFromStorage = (): Record<string, Message[]> => {
  const stored = localStorage.getItem('messages');
  if (stored) {
    return JSON.parse(stored);
  }
  return {};
};

const initialState: MessagesState = {
  messages: loadFromStorage(),
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      state.messages[action.payload.chatId] = action.payload.messages;
      localStorage.setItem('messages', JSON.stringify(state.messages));
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const chatId = action.payload.chatId;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(action.payload);
      localStorage.setItem('messages', JSON.stringify(state.messages));
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const chatId = action.payload.chatId;
      if (state.messages[chatId]) {
        const index = state.messages[chatId].findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.messages[chatId][index] = action.payload;
          localStorage.setItem('messages', JSON.stringify(state.messages));
        }
      }
    },
    deleteMessage: (state, action: PayloadAction<{ chatId: string; messageId: string }>) => {
      const { chatId, messageId } = action.payload;
      if (state.messages[chatId]) {
        state.messages[chatId] = state.messages[chatId].filter(m => m.id !== messageId);
        localStorage.setItem('messages', JSON.stringify(state.messages));
      }
    },
    addReaction: (state, action: PayloadAction<{ chatId: string; messageId: string; emoji: string; userId: string }>) => {
      const { chatId, messageId, emoji, userId } = action.payload;
      if (state.messages[chatId]) {
        const message = state.messages[chatId].find(m => m.id === messageId);
        if (message) {
          if (!message.reactions) {
            message.reactions = [];
          }
          const existing = message.reactions.find(r => r.userId === userId);
          if (existing) {
            existing.emoji = emoji;
          } else {
            message.reactions.push({ emoji, userId });
          }
          localStorage.setItem('messages', JSON.stringify(state.messages));
        }
      }
    },
  },
});

export const { setMessages, addMessage, updateMessage, deleteMessage, addReaction } = messagesSlice.actions;
export default messagesSlice.reducer;
