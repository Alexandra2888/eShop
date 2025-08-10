import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: (() => {
    try {
      const stored = localStorage.getItem("userInfo");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn("Failed to parse userInfo from localStorage:", error);
      localStorage.removeItem("userInfo"); // Clean up corrupted data
      return null;
    }
  })(),
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      console.log("setCredentials called with:", action.payload);
      
      if (!action.payload || typeof action.payload !== 'object') {
        console.error("Invalid payload received in setCredentials:", action.payload);
        return;
      }
      
      const { token, ...userData } = action.payload;
      
      if (!token) {
        console.error("No token found in payload:", action.payload);
        return;
      }
      
      state.userInfo = userData;
      state.token = token;
      
      try {
        localStorage.setItem("userInfo", JSON.stringify(userData));
        localStorage.setItem("token", token);
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime);
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;