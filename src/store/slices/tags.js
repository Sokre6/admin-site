import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tagsApi } from "../../http/services";

const initialState = {
  data: [],
};

export const fetchTagsThunk = createAsyncThunk("tags/getData", async () => {
  return await tagsApi.getTags();
});

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTagsThunk.fulfilled, (state, action) => {
      return { ...state, data: action.payload };
    });
    builder.addCase(fetchTagsThunk.rejected, (state) => {
      return { ...state, data: [] };
    });
  },
});

const { reducer } = tagsSlice;
export { reducer as tagsReducer };
