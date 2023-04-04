import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deliveryMethodApi } from "../../http/services";

const initialState = {
  tableData: [],
  deliveryMethodData: [],
};

export const fetchDeliveryMethodDataThunk = createAsyncThunk(
  "deliveryMethod/getData",
  async () => {
    return await deliveryMethodApi.getDeliveryMethodData();
  }
);

export const fetchDeliveryMethodByIdThunk = createAsyncThunk(
  "deliveryMethod/getDeliveryMethodByCode",
  async (args) => {
    return await deliveryMethodApi.getDeliveryMethodById(args);
  }
);

export const updateDeliveryMethodThunk = createAsyncThunk(
  "deliveryMethod/update",
  async (args) => {
    return await deliveryMethodApi.updateDeliveryMethod(args.id, args.names);
  }
);
const deliveryMethodSlice = createSlice({
  name: "deliveryMethod",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDeliveryMethodDataThunk.fulfilled, (state, action) => {
      return { ...state, tableData: action.payload };
    });
    builder.addCase(fetchDeliveryMethodDataThunk.rejected, (state, action) => {
      return { ...state, tableData: [] };
    });
    builder.addCase(fetchDeliveryMethodByIdThunk.fulfilled, (state, action) => {
      return { ...state, deliveryMethodData: action.payload };
    });
    builder.addCase(fetchDeliveryMethodByIdThunk.rejected, (state, action) => {
      return { ...state, deliveryMethodData: [] };
    });
  },
});
const { reducer } = deliveryMethodSlice;
export { reducer as deliveryMethodReducer };
