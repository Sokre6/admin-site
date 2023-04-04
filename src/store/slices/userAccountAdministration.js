import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {userAccountAdministrationApi} from '../../http/services';

export const fetchUserAccountAdministrationDataThunk = createAsyncThunk(
  'userAccountAdministration/getData',
  async () => {
    return await userAccountAdministrationApi.getUserAccountAdministration();
  },
);

export const fetchUserAccountAdministrationPagedDataThunk = createAsyncThunk(
  'userAccountAdministration/getDataPaged',
  async args => {
    return await userAccountAdministrationApi.getUserAccountAdministrationPaged(
      args,
    );
  },
);

export const createUserAccountAdministrationDataThunk = createAsyncThunk(
  'createAccountAdministration/createUser',
  async args => {
    return await userAccountAdministrationApi.createUserAccountAdministration(
      args,
    );
  },
);

export const updateUserAccountAdministrationDataThunk = createAsyncThunk(
  'updateAccountAdministration/updateUser',
  async args => {
    return await userAccountAdministrationApi.updateUserAccountAdministration(
      args,
    );
  },
);

export const deleteUserAccountAdministrationDataThunk = createAsyncThunk(
  'deleteAccountAdministration/deleteUser',
  async args => {
    return await userAccountAdministrationApi.deleteUserAccountAdministration(
      args,
    );
  },
);

export const resendUserAccountMailThunk = createAsyncThunk(
  'resendUserAccountMail/resendMail',
  async args => {
    return await userAccountAdministrationApi.resendUserAccountMail(args);
  },
);

const initialState = {
  allTableData: [],
  tableData: [],
  totalCount: 0,
};

const userAccountAdministrationSlice = createSlice({
  name: 'userAccountAdministration',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      fetchUserAccountAdministrationDataThunk.fulfilled,
      (state, action) => {
        return {
          ...state,
          allTableData: action.payload,
          totalCount: action.payload.length,
        };
      },
    );
    builder.addCase(
      fetchUserAccountAdministrationPagedDataThunk.fulfilled,
      (state, action) => {
        return {
          ...state,
          tableData: action.payload,
        };
      },
    );
  },
});
const {reducer} = userAccountAdministrationSlice;
export {reducer as userAccountAdministrationReducer};
