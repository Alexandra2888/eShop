import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateCart } from "../../../utils/cartUtils";
import { CartItem, CartState, ShippingAddress } from "../../../types/index";

const initialState: CartState = (() => {
  try {
    const stored = localStorage.getItem("cart");
    return stored
      ? JSON.parse(stored)
      : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };
  } catch (error) {
    console.warn("Failed to parse cart from localStorage:", error);
    localStorage.removeItem("cart");
    return { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };
  }
})();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { user, rating, numReviews, reviews, ...item } =
        action.payload as any;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (x) => x._id !== action.payload
      );
      return updateCart(state);
    },

    saveShippingAddress: (
      state,
      action: PayloadAction<Partial<ShippingAddress>>
    ) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = "PayPal";
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
