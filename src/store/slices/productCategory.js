import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productCategoryApi } from "../../http/services";

const initialState = {
  tableData: [],
  productCategoryLocalizationTableData: [],
};

export const fetchProductCategoryDataThunk = createAsyncThunk(
  "productCategory/getProductCategory",
  async () => {
    return await productCategoryApi.getProductCategory();
  }
);

export const fetchProductCategoryByIdThunk = createAsyncThunk(
  "productCategory/getProductCategoryById",
  async (args) => {
    return await productCategoryApi.getProductCategoryById(args);
  }
);

export const updateProductCategoryThunk = createAsyncThunk(
  "productCategory/updateProductCategory",
  async (args) => {
    return await productCategoryApi.updateProductCategory(args);
  }
);

export const insertProductCategoryThunk = createAsyncThunk(
  "productCategory/insertProductCategory",
  async (args) => {
    return await productCategoryApi.createProductCategory(args);
  }
);
export const deleteProductCategoryThunk = createAsyncThunk(
  "productCategory/deleteProductCategory",
  async (args,thunkAPI) => {
    try {
      return await productCategoryApi.deleteProductCategory(args);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
    
  }
);

const productCategorySlice = createSlice({
  name: "productCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchProductCategoryDataThunk.fulfilled,
      (state, action) => {
        return { ...state, tableData: action.payload };
      }
    );
    builder.addCase(
      fetchProductCategoryByIdThunk.fulfilled,
      (state, action) => {
        return {
          ...state,
          productCategoryLocalizationTableData: action.payload,
        };
      }
    );
  },
});
const { reducer } = productCategorySlice;
export { reducer as productCategoryReducer };
