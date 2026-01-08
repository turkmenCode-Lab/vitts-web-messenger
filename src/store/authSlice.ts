import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const loadFromStorage = (): AuthState => {
  const stored = localStorage.getItem('auth');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    currentUser: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = loadFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        localStorage.setItem('auth', JSON.stringify(state));
      }
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
