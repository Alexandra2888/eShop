import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, Product, ShopState } from "../../../types/index";

const initialState: ShopState = {
  categories: [],
  products: [],
  checked: [],
  radio: [],
  brandCheckboxes: {},
  checkedBrands: [],
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setChecked: (state, action: PayloadAction<string[]>) => {
      state.checked = action.payload;
    },
    setRadio: (state, action: PayloadAction<number[]>) => {
      state.radio = action.payload;
    },
    setSelectedBrand: (state, action: PayloadAction<string>) => {
      state.selectedBrand = action.payload;
    },
  },
});

export const {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setSelectedBrand,
} = shopSlice.actions;

export default shopSlice.reducer;
