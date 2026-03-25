import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../types/index";
import { RootState } from "../../store";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [] as Product[],
  reducers: {
    addToFavorites: (state, action: PayloadAction<Product>) => {
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<Product>) => {
      return state.filter((product) => product._id !== action.payload._id);
    },
    setFavorites: (state, action: PayloadAction<Product[]>) => {
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;
export const selectFavoriteProduct = (state: RootState) => state.favorites;
export default favoriteSlice.reducer;
