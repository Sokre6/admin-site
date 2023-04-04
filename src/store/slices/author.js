import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authorApi, blogApi } from "../../http/services";

const initialState = {
  tableData: [],
  authorDataById: [],
};

export const fetchAuthorsThunk = createAsyncThunk(
  "authors/getAuthors",
  async () => {
    return await authorApi.getAuthors();
  }
);

export const fetchAuthorByIdThunk = createAsyncThunk(
  "author/getAuthorById",
  async (id) => {
    return await authorApi.getAuthorById(id);
  }
);

export const updateAuthorThunk = createAsyncThunk(
  "author/updateAuthor",
  async (args) => {
    return await authorApi.updateAuthor(args.id, args.data);
  }
);

export const createNewAuthorThunk = createAsyncThunk(
  "author/createAuthor",
  async (args) => {
    const insertData = {
      givenName: args.data.givenName,
      familyName: args.data.familyName,

      descriptions: [
        {
          locale: args.locale,
          description: args.data.description,
        },
      ],
      photoId: args.photo || null,
      socialMediaProfiles: [
        { type: "LINKEDIN", value: args?.data.linkedInProfile },
        { type: "TWITTER", value: args?.data.twitterProfile },
      ].filter((item) => item.value),
    };
    return await authorApi.createAuthor(insertData);
  }
);

export const deleteAuthorThunk = createAsyncThunk(
  "author/deleteAuthor",
  async (args) => {
    return await authorApi.deleteAuthorById(args.id);
  }
);

const authorSlice = createSlice({
  name: "author",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAuthorsThunk.fulfilled, (state, action) => {
      return { ...state, tableData: action.payload };
    });
    builder.addCase(fetchAuthorsThunk.rejected, (state, action) => {
      return { ...state, tableData: [] };
    });
    builder.addCase(fetchAuthorByIdThunk.fulfilled, (state, action) => {
      return { ...state, authorDataById: action.payload };
    });
  },
});

const { reducer } = authorSlice;
export { reducer as authorReducer };
