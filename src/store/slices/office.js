import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { officeApi } from "../../http/services";

export const fetchApplicableCountriesThunk = createAsyncThunk(
  "offices/getApplicableCountriesData",
  async () => {
    return await officeApi.getApplicableCountriesData();
  }
);

export const fetchOfficesThunk = createAsyncThunk(
  "offices/getOfficesData",
  async (args) => {
    return await officeApi.getOfficesData(args);
  }
);

const initialState = {
  tableData: [],
  applicableCountriesData: [],
};

const officesSlice = createSlice({
  name: "offices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchApplicableCountriesThunk.fulfilled,
      (state, action) => {
        return { ...state, applicableCountriesData: action.payload };
      }
    );
    builder.addCase(fetchApplicableCountriesThunk.rejected, (state, action) => {
      return { ...state, applicableCountriesData: [] };
    });
    builder.addCase(fetchOfficesThunk.fulfilled, (state, action) => {
      return { ...state, tableData: action.payload };
    });
  },
});
const { reducer } = officesSlice;
export { reducer as officesReducer };
