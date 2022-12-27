import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { RootState } from "../store";

export interface CartState {
  cartItems: Product[];
  cartTotalAmount: number;
  cartTotalQuantity: number;
}

const initialState: CartState = {
  cartItems: [],
  cartTotalAmount: 0,
  cartTotalQuantity: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity += 1;
      } else {
        const tempProduct = { ...action.payload, quantity: 1 };
        state.cartItems.push(tempProduct);
      }

      toast.success(`${action.payload.title} adicionando no carrinho`);
    },
    removeCart: (state, action) => {
      const nextCartItems = state.cartItems.filter(
        (index) => index._id !== action.payload._id
      );
      state.cartItems = nextCartItems;

      toast.error(`${action.payload.title} removido do carrinho`);
    },
    incrementQuantity: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );
      state.cartItems[itemIndex].quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );

      if (state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
      } else {
        const nextCartItems = state.cartItems.filter(
          (index) => index._id !== action.payload._id
        );
        state.cartItems = nextCartItems;

        toast.error(`${action.payload.title} removido do carrinho`);
      }
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.quantity * item.price;
        total += item.quantity;
      });

      state.cartTotalAmount = amount;
      state.cartTotalQuantity = total;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addCart,
  calculateTotals,
  decrementQuantity,
  incrementQuantity,
  removeCart,
  clearCart,
} = cartSlice.actions;

// Selectors
export const cartSelector = (state: RootState) => state.cart.cartItems;
export const totalAmountSelector = (state: RootState) =>
  state.cart.cartTotalAmount;
export const totalQuantitySelector = (state: RootState) =>
  state.cart.cartTotalQuantity;

export default cartSlice.reducer;
