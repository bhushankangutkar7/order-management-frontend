// store/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },

    cancelOrder: (state, action) => {
      state.orders = state.orders.filter((order) => order.id !== action.payload);
    },
  },
});

export const { addOrder, cancelOrder } = orderSlice.actions;
export default orderSlice.reducer;