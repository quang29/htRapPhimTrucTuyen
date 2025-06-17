// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Thunk để load user từ Firestore theo uid
export const fetchUserFromFirestore = createAsyncThunk(
  'auth/fetchUserFromFirestore',
  async (uid, thunkAPI) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        return thunkAPI.rejectWithValue('User not found');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.showLoginPopup = false; // tắt popup khi đã login
    },
    clearUser: (state) => {
      state.user = null;
    },
    showLogin: (state) => {
      state.showLoginPopup = true;
    },
    hideLogin: (state) => {
      state.showLoginPopup = false;
    },
  },
});

export const { setUser, clearUser, showLogin, hideLogin } = authSlice.actions;
export default authSlice.reducer;
