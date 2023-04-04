import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { goldFinenessApi } from "../../http/services";

export const fetchGoldFinenessDataThunk = createAsyncThunk(
  "goldFineness/getData",
  async () => {
    return await goldFinenessApi.getGoldFinenessData();
  }
);

export const createGoldFinenessThunk = createAsyncThunk(
  "goldFineness/insert",
  async (args) => {
    return await goldFinenessApi.createGoldFineness(args);
  }
);

export const updateGoldFinenessThunk = createAsyncThunk(
  "goldFineness/update",
  async (args) => {
    return await goldFinenessApi.updateGoldFineness(args);
  }
);

export const deleteGoldFinenessThunk = createAsyncThunk(
  "goldFineness/update",
  async (args,thunkAPI) => {
    try {
      return await goldFinenessApi.deleteGoldFineness(args);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
    
  }
);

const initialState = {
  tableData: [],
};

const goldFinenessSlice = createSlice({
  name: "goldFineness",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGoldFinenessDataThunk.fulfilled, (state, action) => {
      return { ...state, tableData: action.payload };
    });
  },
});
const { reducer } = goldFinenessSlice;
export { reducer as goldFinenessReducer };
