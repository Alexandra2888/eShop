import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
  }
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
