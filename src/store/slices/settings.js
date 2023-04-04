import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import i18n from "../../i18n/i18n";

export const changeLanguage = createAsyncThunk(
  "settings/changeLanguage",
  async (args, { getState, dispatch }) => {
    i18n.changeLanguage(args.language);
    dispatch(updateLanguage(args.language));
  }
);
const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    language: "en"
  },
  reducers: {
    updateLanguage: (state, action) => {
      return { ...state, language: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      if (action.payload?.settings?.language) {
        i18n.changeLanguage(action.payload.settings.language);
      }
    });
  },
});

const { actions, reducer } = settingsSlice;
export const { updateLanguage } = actions;
export { reducer as settingsReducer };

