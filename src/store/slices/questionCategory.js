import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { questionCategoryApi } from "../../http/services";

const initialState = {
  tableData: [],
  questionCategoryData: [],
};

export const fetchQuestionCategoryDataThunk = createAsyncThunk(
  "questionCategory/getData",
  async () => {
    return await questionCategoryApi.getQuestionCategories();
  }
);

export const fetchQuestionCategoryByCodeThunk = createAsyncThunk(
  "questionCategory/getQuestionCategory",
  async (args) => {
    return await questionCategoryApi.getQuestionCategoryByCode(args);
  }
);

export const insertNewQuestionCategoryThunk = createAsyncThunk(
  "questionCategory/insert",
  async (args) => {
    return await questionCategoryApi.createQuestionCategory(args);
  }
);

export const updateQuestionCategoryThunk = createAsyncThunk(
  "questionCategory/update",
  async (args) => {
    return await questionCategoryApi.updateQuestionCategory(
      args.updateData.id,
      args.dataForUpdate
    );
  }
);

export const deleteQuestionCategoryThunk = createAsyncThunk(
  "questionCategory/insert",
  async (args) => {
    return await questionCategoryApi.deleteQuestionCategoryByCode(args);
  }
);

const questionCategorySlice = createSlice({
  name: "questionCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchQuestionCategoryDataThunk.fulfilled,
      (state, action) => {
        return { ...state, tableData: action.payload };
      }
    );
    builder.addCase(
      fetchQuestionCategoryDataThunk.rejected,
      (state, action) => {
        return { ...state, tableData: [] };
      }
    );
    builder.addCase(
      fetchQuestionCategoryByCodeThunk.fulfilled,
      (state, action) => {
        return { ...state, questionCategoryData: action.payload };
      }
    );
    builder.addCase(
      fetchQuestionCategoryByCodeThunk.rejected,
      (state, action) => {
        return { ...state, questionCategoryData: [] };
      }
    );
  },
});

const { reducer } = questionCategorySlice;
export { reducer as questionCategoryReducer };
