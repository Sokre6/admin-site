import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {mobileUserAccountAdministrationApi} from '../../http/services';

export const fetchMobileUserAccountAdministrationDataThunk = createAsyncThunk(
  'mobileUserAccountAdministration/getData',
  async () => {
    return await mobileUserAccountAdministrationApi.getMobileUserAccountAdministration();
  },
);

export const fetchMobileUserAccountAdministrationPagedDataThunk =
  createAsyncThunk(
    'mobileUserAccountAdministration/getDataPaged',
    async args => {
      return await mobileUserAccountAdministrationApi.getMobileUserAccountAdministrationPaged(
        args,
      );
    },
  );

const initialState = {
  allTableData: [],
  tableData: [],
  totalCount: 0,
};

const mobileUserAccountAdministrationSlice = createSlice({
  name: 'mobileUserAccountAdministration',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      fetchMobileUserAccountAdministrationDataThunk.fulfilled,
      (state, action) => {
        return {
          ...state,
          allTableData: action.payload,
          totalCount: action.payload.length,
        };
      },
    );
    builder.addCase(
      fetchMobileUserAccountAdministrationPagedDataThunk.fulfilled,
      (state, action) => {
        return {
          ...state,
          tableData: action.payload,
        };
      },
    );
  },
});
const {reducer} = mobileUserAccountAdministrationSlice;
export {reducer as mobileUserAccountAdministrationReducer};
