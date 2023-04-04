import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { manufacturersApi } from "../../http/services";

export const fetchManufacturersThunk = createAsyncThunk(
  "manufacturers/getData",
  async () => {
    return await manufacturersApi.getManufacturersData();
  }
);

export const createManufacturersThunk = createAsyncThunk(
  "manufacturers/insert",
  async (args) => {
    return await manufacturersApi.createManufacturers(args);
  }
);

export const updateManufacturersThunk = createAsyncThunk(
  "manufacturers/update",
  async (args) => {
    return await manufacturersApi.updateManufacturers(args);
  }
);

export const deleteManufacturersThunk = createAsyncThunk(
  "manufacturers/delete",
  async (args,thunkAPI) => {
    try {
      return await manufacturersApi.deleteManufacturers(args);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
    
  }
);

const initialState = {
  tableData: [],
};

const manufacturersSlice = createSlice({
  name: "manufacturers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchManufacturersThunk.fulfilled, (state, action) => {
      return { ...state, tableData: action.payload };
    });
    builder.addCase(fetchManufacturersThunk.rejected, (state, action) => {
      return { ...state, tableData: [] };
    });
  },
});
const { reducer } = manufacturersSlice;
export { reducer as manufacturersReducer };
