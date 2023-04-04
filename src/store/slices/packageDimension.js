import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { packageDimensionApi } from "../../http/services";

const initialState = {
  tableData: [],
};

export const fetchPackageDimensionDataThunk = createAsyncThunk(
  "packageDimension/getData",
  async () => {
    return await packageDimensionApi.getPackageDimension();
  }
);

export const createPackageDimensionDataThunk = createAsyncThunk(
  "packageDimension/createPackageDimension",
  async (args) => {
    return await packageDimensionApi.createPackageDimension(args);
  }
);

export const updatePackageDimensionDataThunk = createAsyncThunk(
  "packageDimension/updatePackageDimension",
  async (args) => {
    return await packageDimensionApi.updatePackageDimension(args);
  }
);

export const deletePackageDimensionDataThunk = createAsyncThunk(
  "packageDimension/deletePackageDimension",
  async (args, thunkAPI) => {
    try {
      return await packageDimensionApi.deletePackageDimension(args);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
  }
);

const packageDimensionSlice = createSlice({
  name: "packageDimension",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchPackageDimensionDataThunk.fulfilled,
      (state, action) => {
        return {
          ...state,
          tableData: action.payload,
        };
      }
    );
    builder.addCase(
      fetchPackageDimensionDataThunk.rejected,
      (state, action) => {
        return { ...state, tableData: [] };
      }
    );
  },
});

const { reducer } = packageDimensionSlice;
export { reducer as packageDimensionReducer };
