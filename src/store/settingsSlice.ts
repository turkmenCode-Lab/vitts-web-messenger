import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Settings } from '../types';

const loadFromStorage = (): Settings => {
  const stored = localStorage.getItem('settings');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    theme: 'dark',
    notifications: true,
    soundEnabled: true,
    enterToSend: true,
    readReceipts: true,
    lastSeenVisible: true,
    profilePhotoVisible: 'everyone',
    language: 'en',
  };
};

const initialState: Settings = loadFromStorage();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      Object.assign(state, action.payload);
      localStorage.setItem('settings', JSON.stringify(state));
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('settings', JSON.stringify(state));
    },
  },
});

export const { updateSettings, toggleTheme } = settingsSlice.actions;
export default settingsSlice.reducer;