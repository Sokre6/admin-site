import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fileApi } from "../../http/services";
const initialState = {
  file: [],
};

export const insertNewFileThunk = createAsyncThunk(
  "file/insert",
  async (args) => {
    return await fileApi.createFile(args);
  }
);

export const fetchFileByIdThunk = createAsyncThunk(
  "file/getById",
  async (args) => {
   
    return await fileApi.getFileById(args);
  }
);

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

const { reducer } = fileSlice;
export { reducer as fileReducer };
