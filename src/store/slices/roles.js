import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { rolesApi } from "../../http/services";

export const fetchRolesDataThunk = createAsyncThunk(
    "roles/getData",
    async () => {
      return await rolesApi.getRoles()
    }
  );
  
  const initialState = {
      data: [],
      userRoles: [],
    };
  
    const rolesSlice = createSlice({
      name: "roles",
      initialState,
      reducers: {
        setUserRoles: (state, action) => {
          return { ...state, userRoles:action.payload}
        }
      },
      extraReducers: (builder) => {
        builder.addCase(fetchRolesDataThunk.fulfilled, (state, action) => {
          return { ...state, data: action.payload };
        });
      },
    });
    const { actions, reducer } = rolesSlice;
    export const { setUserRoles } = actions;
    export { reducer as rolesReducer };