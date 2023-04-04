import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productMaterialApi } from "../../http/services";

const initialState = {
  tableData: [],
};

export const fetchProductMaterialDataThunk = createAsyncThunk(
  "productMaterial/getData",
  async () => {
    return await productMaterialApi.getProductMaterials();
  }
);

const productMaterialSlice = createSlice({
  name: "productMaterial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchProductMaterialDataThunk.fulfilled,
      (state, action) => {
        return {
          ...state,
          tableData: action.payload,
        };
      }
    );
    builder.addCase(fetchProductMaterialDataThunk.rejected, (state, action) => {
      return { ...state, tableData: [] };
    });
  },
});

const { reducer } = productMaterialSlice;
export { reducer as productMaterialReducer };
