import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { parametersAdministrationApi } from "../../http/services";



export const fetchParametersAdministrationThunk = createAsyncThunk(
    "parametersAdministration/getParamsAdminData",
    async () => {
      return await parametersAdministrationApi.getParametersAdministration();
    }
  );

  export const fetchParametersAdministrationByIdThunk = createAsyncThunk(
    "parametersAdministration/getParamsAdminDataById",
    async (key) => {
    
      return await parametersAdministrationApi.getParametersAdministrationId(key);
    }
  );

  export const updateParametersAdministrationThunk = createAsyncThunk(
    "parametersAdministration/updateParamsAdminData",
    async (args) => {

      return await parametersAdministrationApi.updateParametersAdministration(
        args.key,
        args.value
      );
    }
  );

  const initialState = {
    tableData: [],
    parametersAdminDataById:[]
  };
  
  const parametersAdministrationSlice = createSlice({
    name: "parametersAdministration",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchParametersAdministrationThunk.fulfilled, (state, action) => {
        return { ...state, tableData: action.payload };
      });
      builder.addCase(fetchParametersAdministrationThunk.rejected, (state, action) => {
        return { ...state, tableData: [] };
      });
      builder.addCase(fetchParametersAdministrationByIdThunk.fulfilled, (state, action) => {
        return { ...state, parametersAdminDataById: action.payload };
      });
      builder.addCase(fetchParametersAdministrationByIdThunk.rejected, (state, action) => {
        return { ...state, parametersAdminDataById: [] };
      });
    },
  });
  const { reducer } = parametersAdministrationSlice;
  export { reducer as parametersAdministrationReducer };