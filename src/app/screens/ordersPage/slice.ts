import { createSlice } from "@reduxjs/toolkit";
import { Order } from "../../../lib/types/order";
import { OrdersPageState } from "../../../lib/types/screen";

const initialState: OrdersPageState = {
  pendingOrders: [],
  paidOrders: [],
  shippedOrders: [],
  deliveredOrders: [],
  cancelledOrders: [],
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setPendingOrders: (state, action) => {
      state.pendingOrders = action.payload;
    },
    setPaidOrders: (state, action) => {
      state.paidOrders = action.payload;
    },
    setShippedOrders: (state, action) => {
      state.shippedOrders = action.payload;
    },
    setDeliveredOrders: (state, action) => {
      state.deliveredOrders = action.payload;
    },
    setCancelledOrders: (state, action) => {
      state.cancelledOrders = action.payload;
    },
  },
});

export const {
  setPendingOrders,
  setPaidOrders,
  setShippedOrders,
  setDeliveredOrders,
  setCancelledOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
