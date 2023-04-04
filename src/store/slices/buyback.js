import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buybackApi } from "../../http/services";

export const fetchBuybackThunk = createAsyncThunk(
  "buyback/getbuyback",
  async (args) => {
    return await buybackApi.getbuyback(args);
  }
);

export const fetchBuybackByIdThunk = createAsyncThunk(
  "buyback/getbuybackById",
  async (id) => {
    return await buybackApi.getbuybackById(id);
  }
);

export const updateBuybackTrackingThunk = createAsyncThunk(
  "buyback/updateBuybackTracking",
  async (args) => {
    return await buybackApi.updateBuybackTracking(args.id, args.data);
  }
);

export const completeBuybackThunk = createAsyncThunk(
  "buyback/completeBuyback",
  async (args) => {
    return await buybackApi.completeBuyback(args.id, args.data);
  }
);

export const cancelBuybackThunk = createAsyncThunk(
  "buyback/cancelBuyback",
  async (args) => {
    return await buybackApi.cancelBuyback(args.id, args.data);
  }
);

export const updateBuybackAppraisalThunk = createAsyncThunk(
  "buyback/updateBuybackAppraisal",
  async (args) => {
    return await buybackApi.updateBuybackAppraisal(args.id, args.data);
  }
);

const initialState = {
  buybackData: [],
  buybackByIdData: [],
  buybackId: "",
  status: "",
};

const buybackSlice = createSlice({
  name: "buyback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBuybackThunk.pending, (state) => {
      return { ...state, status: "pending" };
    });
    builder.addCase(fetchBuybackThunk.rejected, (state) => {
      return {
        ...state,
        status: "rejected",
        buybackData: [],
      };
    });
    builder.addCase(fetchBuybackThunk.fulfilled, (state, action) => {
      return {
        ...state,
        status: "fulfilled",
        buybackData: action.payload,
      };
    });
    builder.addCase(fetchBuybackByIdThunk.pending, (state) => {
      return { ...state, status: "pending" };
    });
    builder.addCase(fetchBuybackByIdThunk.rejected, (state) => {
      return {
        ...state,
        status: "rejected",
        buybackByIdData: [],
      };
    });
    builder.addCase(fetchBuybackByIdThunk.fulfilled, (state, action) => {
      return {
        ...state,
        status: "fulfilled",
        buybackByIdData: action.payload,
        buybackId: action.meta.arg,
      };
    });
  },
});
const { reducer } = buybackSlice;
export { reducer as buybackReducer };
