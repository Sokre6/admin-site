import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { paymentMethodsApi } from "../../http/services";

export const fetchPaymentMethodsThunk = createAsyncThunk(
  "paymentMethods/getPaymentMethods",
  async () => {
    return await paymentMethodsApi.getPaymentMethods();
  }
);

export const fetchPaymentMethodsByIdThunk = createAsyncThunk(
  "paymentMethods/getPaymentMethodsById",
  async (id) => {
    return await paymentMethodsApi.getPaymentMethodsById(id);
  }
);

const initialState = {
  paymentMethodsData: [],
  paymentMethodsDataById: [],
};

const paymentMethodsSlice = createSlice({
  name: "paymentMethods",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPaymentMethodsThunk.fulfilled, (state, action) => {
      return { ...state, paymentMethodsData: action.payload };
    });
    builder.addCase(fetchPaymentMethodsThunk.rejected, (state) => {
      return { ...state, paymentMethodsData: [] };
    });

    builder.addCase(fetchPaymentMethodsByIdThunk.fulfilled, (state, action) => {
      return { ...state, paymentMethodsDataById: action.payload };
    });
    builder.addCase(fetchPaymentMethodsByIdThunk.rejected, (state) => {
      return { ...state, paymentMethodsDataById: [] };
    });
  },
});
const { reducer } = paymentMethodsSlice;
export { reducer as paymentMethodsReducer };
