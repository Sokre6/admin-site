import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deliveryCostApi } from "../../http/services";

const initialState = {
  tableData: [],
};

export const fetchDeliveryCostData = createAsyncThunk(
  "deliveryCost/getData",
  async () => {
    return await deliveryCostApi.getDeliveryCost();
  }
);

export const insertNewDeliveryCostThunk = createAsyncThunk(
  "deliveryCost/insert",
  async (args) => {
    return await deliveryCostApi.createDeliveryCost(args);
  }
);

export const updateDeliveryCostThunk = createAsyncThunk(
  "deliveryCost/update",
  async (args) => {
    return await deliveryCostApi.updateDeliveryCost(args.id, args.data);
  }
);

export const deleteDeliveryCostThunk = createAsyncThunk(
  "deliveryCost/delete",
  async (args) => {
    return await deliveryCostApi.deleteDeliveryCostById(args);
  }
);
const deliveryCostSlice = createSlice({
  name: "deliveryCost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDeliveryCostData.fulfilled, (state, action) => {
      return { ...state, tableData: action.payload };
    });
    builder.addCase(fetchDeliveryCostData.rejected, (state, action) => {
      return { ...state, tableData: [] };
    });
  },
});
const { reducer } = deliveryCostSlice;
export { reducer as deliveryCostReducer };
