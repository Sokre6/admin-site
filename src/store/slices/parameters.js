import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { parametersAdministrationApi } from "../../http/services";

const initialState = {
  data: [],
};

export const fetchParametersValidationsThunk = createAsyncThunk(
  "parametersValidations/getValidations",
  async () => {
    return await parametersAdministrationApi.getParametersAdministration();
  }
);

const parametersValidations = createSlice({
  name: "parametersValidations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchParametersValidationsThunk.fulfilled,
      (state, action) => {
        return {
          ...state,
          data: action.payload,
        };
      }
    );
    builder.addCase(fetchParametersValidationsThunk.rejected, (state) => {
      return { ...state, data: initialState };
    });
  },
});

const { reducer } = parametersValidations;
export { reducer as parametersValidationsReducer };
