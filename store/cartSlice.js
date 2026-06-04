// store/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.items.find(
        (i) => i._id === item._id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: 1,
        });
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (i) => i._id === action.payload
      );

      if (item) item.quantity += 1;
    },

    decreaseQuantity: (state, action) => {
      const itemIndex = state.items.findIndex(
        (i) => i._id === action.payload
      );
    
      if (itemIndex === -1) return;
    
      const item = state.items[itemIndex];
    
      if (item.quantity === 1) {
        // REMOVE ITEM COMPLETELY
        state.items.splice(itemIndex, 1);
      } else {
        item.quantity -= 1;
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;