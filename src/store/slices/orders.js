import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ordersApi } from "../../http/services";

export const fetchOrdersThunk = createAsyncThunk(
  "orders/getOrders",
  async (args) => {
    return await ordersApi.getOrders(args);
  }
);

export const fetchOrdersByIdThunk = createAsyncThunk(
  "orders/getOrdersById",
  async (id) => {
    return await ordersApi.getOrdersById(id);
  }
);

export const sendMailOrderThunk = createAsyncThunk(
  "orders/sendMailOrder",
  async (args) => {
    return await ordersApi.sendMailOrder(args);
  }
);

const initialState = {
  ordersData: [],
  ordersDataById: [],
  status: "",
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrdersThunk.pending, (state) => {
      return { ...state, status: "pending" };
    });
    builder.addCase(fetchOrdersThunk.rejected, (state) => {
      return { ...state, status: "rejected", ordersData: [] };
    });
    builder.addCase(fetchOrdersThunk.fulfilled, (state, action) => {
      return { ...state, status: "fulfilled", ordersData: action.payload };
    });
    builder.addCase(fetchOrdersByIdThunk.pending, (state) => {
      return { ...state, status: "pending" };
    });
    builder.addCase(fetchOrdersByIdThunk.rejected, (state) => {
      return { ...state, status: "rejected", ordersDataById: [] };
    });
    builder.addCase(fetchOrdersByIdThunk.fulfilled, (state, action) => {
      return { ...state, status: "fulfilled", ordersDataById: action.payload };
    });
  },
});
const { reducer } = ordersSlice;
export { reducer as ordersReducer };
