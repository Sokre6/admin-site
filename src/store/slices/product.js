import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productApi } from "../../http/services";
let _store;

export const injectStoreForProducts = (store) => {
  _store = store;
};

const initialState = {
  tableData: [],
  productData: [],
  productDataById:[],
  status:null
};

export const fetchProductDataThunk = createAsyncThunk(
  "product/getData",
  async () => {
    return await productApi.getProductData();
  }
);

export const fetchProductByIdThunk = createAsyncThunk(
  "product/getProductById",
  async (args) => {
    return await productApi.getProductById(args);
  }
);




export const updateProductThunk = createAsyncThunk(
  "product/update",
  async (args,thunkAPI) => {
    try {
      return await productApi.updateProduct(
        args.updateData.id,
        args.updateObject
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.status);
    }
    
  }
);

const prepareDataForLocalization = (data) => {
  var tableData = [];
  data.names.sort((a, b) => a.locale.localeCompare(b.locale));
  data.descriptions.sort((a, b) => a.locale.localeCompare(b.locale));
  let length =
    data.names.length > data.descriptions.length
      ? data.names.length
      : data.descriptions.length;
  for (var i = 0; i < length; i++) {
    var object = {
      id: data.id,
      locale:
        data.names.length - 1 < i
          ? data.answers[i].locale
          : data.names[i].locale,
      name: data.names.length - 1 < i ? "" : data.names[i].name,
      description:
        data.descriptions.length - 1 < i
          ? ""
          : data.descriptions[i].description,
    };
    tableData = [...tableData, object];
  }
  return tableData;
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductDataThunk.pending, (state, action) => {
      return { ...state,status:"pending" };
    });
    builder.addCase(fetchProductDataThunk.fulfilled, (state, action) => {
      return {
        ...state,
        status:"fulfilled",
        tableData: action.payload,
      };
    });
    builder.addCase(fetchProductDataThunk.rejected, (state, action) => {
      return { ...state,status:"rejected", tableData: [] };
    });
    builder.addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
      return {
        ...state,
        productData: prepareDataForLocalization(action.payload),
        productDataById:action.payload
      };
    });
    builder.addCase(fetchProductByIdThunk.rejected, (state, action) => {
      return { ...state, productData: [] };
    });
  },
});

const { reducer } = productSlice;
export { reducer as productReducer };
