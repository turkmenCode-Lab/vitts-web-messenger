import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const loadFromStorage = (): AuthState => {
  try {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Basic validation to prevent corrupted state
      if (parsed && typeof parsed.isAuthenticated === 'boolean') {
        return parsed as AuthState;
      }
    }
  } catch (error) {
    console.warn('Failed to load auth from localStorage:', error);
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
    // Login / successful registration
    login: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('auth', JSON.stringify(state));
    },

    // Full logout — clear auth completely
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth');
      // Optional: clear other user-related data
      // localStorage.removeItem('user-preferences');
    },

    // Update current user's profile fields
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
        localStorage.setItem('auth', JSON.stringify(state));
      }
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;