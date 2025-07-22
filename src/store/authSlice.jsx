import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
// file nay quan ly trang thai dang nhap cua user, an hien popup dang nhap

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

//trang thai ban dau user la null
const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {// luu user vao state khi da login
      state.user = action.payload;
      state.showLoginPopup = false; // tắt popup khi đã login
    },
    clearUser: (state) => {// xóa user khỏi state khi logout
      state.user = null;
    },
    showLogin: (state) => {// hiển thị popup đăng nhập
      state.showLoginPopup = true;
    },
    hideLogin: (state) => {// ẩn popup đăng nhập
      state.showLoginPopup = false;
    },
  },
});

export const { setUser, clearUser, showLogin, hideLogin } = authSlice.actions;
export default authSlice.reducer;
