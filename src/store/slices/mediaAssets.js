import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { mediaAssetsApi } from "../../http/services";

const initialState = {
  tableData: [],
  mediaAssetsDataById:[],
  status:""
};

export const fetchMediaAssetsThunk = createAsyncThunk(
  "mediaAssets/getData",
  async (args) => {
    return await mediaAssetsApi.getMediaAssets(args);
  }
);

export const fetchMediaAssetsByIdThunk = createAsyncThunk(
  "mediaAssets/getmediaAssetsById",
  async (id) => {
    return await mediaAssetsApi.getMediaAssetsId(id);
  }
);

export const updateMediaAssetsThunk = createAsyncThunk(
  "mediaAssets/updateMediaAssets",
  async (args) => {
    return await mediaAssetsApi.updateMediaAssets(args.id, args.data);
  }
);

export const createMediaAssetsThunk = createAsyncThunk(
  "mediaAssets/createMediaAssets",
  async (args) => {
    return await mediaAssetsApi.createMediaAssets(args);
  }
);

export const deleteMediaAssetsThunk = createAsyncThunk(
  "mediaAssets/delete",
  async (args,thunkAPI) => {
    try {
      return await mediaAssetsApi.deleteMediaAssets(args);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
    
  }
);


const mediaAssetsSlice = createSlice({
    name: "mediaAssets",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchMediaAssetsThunk.pending, (state, action) => {
        return { ...state, status:"pending" };
      });
      builder.addCase(fetchMediaAssetsThunk.fulfilled, (state, action) => {
        return { ...state,status:"fulfilled", tableData: action.payload };
      });
      builder.addCase(fetchMediaAssetsThunk.rejected, (state, action) => {
        return { ...state, tableData: [] };
      });
      builder.addCase(fetchMediaAssetsByIdThunk.fulfilled, (state, action) => {
        return { ...state, mediaAssetsDataById: action.payload };
      });
    },
  });

  const { reducer } = mediaAssetsSlice;
export { reducer as mediaAssetsReducer };