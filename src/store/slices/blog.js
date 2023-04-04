import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { blogApi } from "../../http/services";



const initialState = {
    tableData: [],
    blogDataById:[]
  };


  export const fetchBlogsThunk = createAsyncThunk(
    "blogs/getData",
    async () => {
      return await blogApi.getBlogs();
    }
  );

  export const fetchBlogByIdThunk = createAsyncThunk(
    "blog/getBlogById",
    async (id) => {
    
      return await blogApi.getBlogById(id);
    }
  );

  export const updateBlogThunk = createAsyncThunk(
    "blog/updateBlog",
    async (args) => {

      return await blogApi.updateBlog(
        args.id,
        args.data
      );
    }
  );

  export const insertNewBlogThunk = createAsyncThunk(
    "blog/insertBlog",
    async (args) => {
      const insertData = {
        colorHexCode: args.data.colorHexCode,
        names: [
          {
            locale: args.locale,
            name: args.data.name,
          },
        ],
      };
      return await blogApi.createBlog(insertData);
    }
  );
  


  const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchBlogsThunk.fulfilled, (state, action) => {
        return { ...state, tableData: action.payload };
      });
      builder.addCase(fetchBlogsThunk.rejected, (state, action) => {
        return { ...state, tableData: [] };
      });
      builder.addCase(fetchBlogByIdThunk.fulfilled, (state, action) => {
        return { ...state, blogDataById: action.payload };
      });
    },
  });

  const { reducer } = blogSlice;
export { reducer as blogReducer };