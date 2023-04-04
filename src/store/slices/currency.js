import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { currencyApi } from "../../http/services";
const initialState = {
  tableData: [],
  currencyData: [],
};

export const fetchCurrencyDataThunk = createAsyncThunk(
  "currency/getData",
  async () => {
    return await currencyApi.getCurrencyData();
  }
);
export const fetchCurrencyByCodeThunk = createAsyncThunk(
  "currency/getCurrencyByCode",
  async (args) => {
    return await currencyApi.getCurrencyByCode(args);
  }
);

export const updateCurrencyThunk = createAsyncThunk(
  "currency/update",
  async (args) => {
    return await currencyApi.updateCurrency(args.code, args.names);
  }
);

export const insertNewCurrencyThunk = createAsyncThunk(
  "currency/insert",
  async (args) => {
    var insertData = {
      code: args.data.code,
      names: [
        {
          locale: args.locale,
          name: args.data.name,
        },
      ],
    };
    return await currencyApi.createCurrency(insertData);
  }
);

export const deleteCurrencyThunk = createAsyncThunk(
  "currency/delete",
  async (args) => {
    return await currencyApi.deleteCurrencyByCode(args.code);
  }
);

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrencyDataThunk.fulfilled, (state, action) => {
      return { ...state, tableData: action.payload };
    });
    builder.addCase(fetchCurrencyDataThunk.rejected, (state, action) => {
      return { ...state, tableData: [] };
    });
    builder.addCase(fetchCurrencyByCodeThunk.fulfilled, (state, action) => {
      return { ...state, currencyData: action.payload };
    });
    builder.addCase(fetchCurrencyByCodeThunk.rejected, (state, action) => {
      return { ...state, currencyData: [] };
    });
  },
});
const { reducer } = currencySlice;
export { reducer as currencyReducer };
