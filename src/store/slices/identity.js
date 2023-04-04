import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  idToken: null,
  idTokenParsed: null,
};

const identitySlice = createSlice({
  name: "identity",
  initialState: initialState,
  reducers: {
    setIdentity: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearIdentity: () => {
      return initialState;
    },
  },
});

const { actions, reducer } = identitySlice;
export const { setIdentity, clearIdentity } = actions;
export { reducer as identityReducer };
