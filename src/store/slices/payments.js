import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { paymentsApi } from "../../http/services";

export const createPaymentsConfirmThunk = createAsyncThunk(
  "payments/paymentsConfirm",
  async (args) => {
    try {
      return await paymentsApi.createPaymentsConfirm(args);
    } catch (error) {
      return error;
    }
  }
);


const paymentsConfirmSlice = createSlice({
  name: "paymentsConfirm",
  initialState: {},
  reducers: {},
});
const { reducer } = paymentsConfirmSlice;
export { reducer as paymentsConfirmReducer };

