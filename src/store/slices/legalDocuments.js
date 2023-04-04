import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { legalDocumentsApi } from "../../http/services";

export const fetchLegalDocumentsByTypeThunk = createAsyncThunk(
  "legalDocuments/getLegalDocumentsByType",
  async (type) => {
    return await legalDocumentsApi.getLegalDocumentsByType(type);
  }
);
export const fetchLegalDocumentsByTypeIdThunk = createAsyncThunk(
  "legalDocuments/getLegalDocumentsByTypeId",
  async (args) => {
    return await legalDocumentsApi.getLegalDocumentsByTypeId(args);
  }
);

export const createLegalDocumentsByTypeThunk = createAsyncThunk(
  "legalDocuments/createLegalDocumentsByType",
  async (args) => {
  

    const obj = {
      validFrom: args.data.validFrom,
      validTo: args.data.validTo,
      contents: [
        {
          locale: args.locale,
          name: args.data.name,
          content: args?.data?.content||null,
          fileId:args?.fileId||null
        },
      ],
      type: args.data.type,
    };
    return await legalDocumentsApi.createLegalDocumentsByType(obj);
  }
);

export const updateLegalDocumentsByTypeThunk = createAsyncThunk(
  "legalDocuments/updateLegalDocuments",
  async (args) => {
    
    return await legalDocumentsApi.updateLegalDocumentsByType(
      args.id,
      args.data
    );
  }
);

const initialState = {
  tableData: [],
  legalDocumentsByTypeId: [],
};

const legalDocumentsByType = createSlice({
  name: "legalDocumentsByType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchLegalDocumentsByTypeThunk.fulfilled,
      (state, action) => {
        return { ...state, tableData: action.payload };
      }
    );
    builder.addCase(fetchLegalDocumentsByTypeThunk.rejected, (state) => {
      return { ...state, tableData: [] };
    });
    builder.addCase(
      fetchLegalDocumentsByTypeIdThunk.fulfilled,
      (state, action) => {
        return { ...state, legalDocumentsByTypeId: action.payload };
      }
    );
    builder.addCase(
      fetchLegalDocumentsByTypeIdThunk.rejected,
      (state, action) => {
        return { ...state, legalDocumentsByTypeId: [] };
      }
    );
  },
});
const { reducer } = legalDocumentsByType;
export { reducer as legalDocumentsByTypeReducer };
