import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { countriesApi } from "../../http/services";

const initialState = {
  tableData: [],
  tableDataById: [],
  status: null,
};

export const fetchCountriesDataThunk = createAsyncThunk(
  "countries/getCountries",
  async () => {
    return await countriesApi.getCountries();
  }
);

  export const fetchCountriesByIdThunk = createAsyncThunk(
    "countries/getCountriesById",
    async (args) => {
      return await countriesApi.getCountriesByCode(args);
    }
  );

export const updateCountries = createAsyncThunk(
  "countries/updateCountries",
  async (args) => {
    return await countriesApi.updateCountry(args);
  }
);

export const createCountryThunk = createAsyncThunk(
  "countries/createCountries",
  async (args) => {

    const obj={
      countryCode: args?.countryCode,
      countryNames: [{locale:args.locale,name:args?.data?.name}],
      applicability: {
        countryOfOrigin: args?.data?.countryOfOrigin,
        countryOfDelivery: args?.data?.countryOfDelivery,
      },
      activity: args.data.activity ? "ACTIVE" : "INACTIVE",
    
    }

    return await countriesApi.createCountry(obj);
  }
);

export const deleteCountryThunk = createAsyncThunk(
  "countries/deleteCountry",
  async (args) => {
    await countriesApi.deleteCountry(args);
  }
);

const countriesSlice = createSlice({
  name: "countries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCountriesDataThunk.pending, (state) => {
      return { ...state, status: "pending" };
    });
    builder.addCase(fetchCountriesDataThunk.fulfilled, (state, action) => {
      return {
        ...state,
        status: "fulfilled",
        tableData: action.payload,
      };
    });
    builder.addCase(fetchCountriesDataThunk.rejected, (state) => {
      return { ...state, status: "rejected", tableData: [] };
    });
    builder.addCase(fetchCountriesByIdThunk.fulfilled, (state,action) => {
      return { ...state, tableDataById: action.payload };
    });
  },
});

const { reducer } = countriesSlice;
export { reducer as countriesReducer };
