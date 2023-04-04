import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { languageApi } from "../../http/services";
const initialState = {
  tableData: [],
  languageData: [],
};

export const fetchLanguagesDataThunk = createAsyncThunk(
  "language/getData",
  async () => {
    return await languageApi.getLanguagesData();
  }
);

export const fetchLanguageByCodeThunk = createAsyncThunk(
  "language/getLanguageByCode",
  async (args) => {
    return await languageApi.getLanguageByCode(args);
  }
);

export const updateLanguageThunk = createAsyncThunk(
  "language/update",
  async (args) => {
   
    return await languageApi.updateLanguage(
      args.code,
      args.names,
      args.activity
    );
  }
);

export const insertNewLanguageThunk = createAsyncThunk(
  "language/insert",
  async (args) => {
    var insertData = {
      code: args.data.code,
      activity: args.data.activity ? "ACTIVE" : "INACTIVE",
      names: [
        {
          locale: args.locale,
          name: args.data.name,
        },
      ],
    };
    return await languageApi.createLanguage(insertData);
  }
);

export const deleteLanguageThunk = createAsyncThunk(
  "language/delete",
  async (args) => {
    return await languageApi.deleteLanguageByCode(args.code);
  }
);

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLanguagesDataThunk.fulfilled, (state, action) => {
      return { ...state, tableData: action.payload };
    });
    builder.addCase(fetchLanguagesDataThunk.rejected, (state, action) => {
      return { ...state, tableData: [] };
    });
    builder.addCase(fetchLanguageByCodeThunk.fulfilled, (state, action) => {
      return { ...state, languageData: action.payload };
    });
    builder.addCase(fetchLanguageByCodeThunk.rejected, (state, action) => {
      return { ...state, languageData: [] };
    });
  },
});

const { reducer } = languageSlice;
export { reducer as languageReducer };
