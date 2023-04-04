import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postsApi } from "../../http/services";

const initialState = {
  status: null,
  tableData: [],
  tableDataById: [],
};

export const fetchPostsThunk = createAsyncThunk(
  "posts/getPosts",
  async (args) => {
    return await postsApi.getPosts(args);
  }
);

export const fetchPostsByIdThunk = createAsyncThunk(
  "posts/getPostsById",
  async (args) => {
    return await postsApi.getPostsById(args);
  }
);

export const patchPostsThunk = createAsyncThunk(
  "posts/patchPosts",
  async (args) => {
    return await postsApi.patchPosts(args);
  }
);
export const deletePostsThunk = createAsyncThunk(
  "posts/deletePosts",
  async (id) => {
    return await postsApi.deletePosts(id);
  }
);

export const updatePostsThunk = createAsyncThunk(
  "posts/updatePosts",
  async (args) => {
  
    const obj = {
      authorId: args?.data?.authorId,
      blogCategoryId: args?.data?.blogCategoryId,
      contents: args?.contentsData,
      seoData: args?.seoData,
      titles: args?.titlesData,
      publishedAt: args?.data?.publishedAt,
      tags: args?.tags,

      coverPhoto: {
        id: args?.coverPhoto?.id,
        localizations: args?.coverPhoto?.localization,
        title:args.coverPhoto?.title
      },
      thumbnailPhoto: {
        id: args?.thumbnailPhoto?.id,
        localizations: args?.thumbnailPhoto?.localization,
        title:args.thumbnailPhoto?.title
      },
    };
    
    return await postsApi.updatePosts(args.id, obj);
  }
);

export const createPostsThunk = createAsyncThunk(
  "posts/createPosts",
  async (args) => {
    
    const obj = {
      authorId: args?.data?.authorId,
      blogCategoryId: args?.data?.blogCategoryId,
      contents: [{ locale: args?.locale, content: args?.data?.contentValue,shortContent:args?.data?.shortContent }],
      seoData: [
        {
          locale: args?.locale,
          title: args?.data?.seoTitle,
          metaDescription: args?.data?.metaDescription,
          metaKeywords: args?.data?.metaKeywords,
        },
      ],
      titles: [{ locale: args?.locale, title: args?.data?.title }],
      publishedAt: args?.data?.publishedAt,
      tags: args?.tags,

      coverPhoto: {
        id: args?.coverPhotoId,
        title:args?.coverPhotoTitle,
        localizations: [
          {
            altText: args?.data?.altTextCoverPhoto,
            caption: args?.data?.captionCoverPhoto,
            locale: args?.locale,
          },
        ],
      },
      thumbnailPhoto: {
        id: args?.thumbnailPhotoId,
        title:args?.thumbnailPhotoTitle,
        localizations: [
          {
            altText: args?.data?.altTextThumbnailPhoto,
            caption: args?.data?.captionThumbnailPhoto,
            locale: args?.locale,
          },
        ],
      },
      
    };

    return await postsApi.createPosts(obj);
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPostsThunk.pending, (state) => {
      return { ...state, status: "pending" };
    });
    builder.addCase(fetchPostsThunk.fulfilled, (state, action) => {
      return { ...state, tableData: action.payload, status: "fulfilled" };
    });
    builder.addCase(fetchPostsThunk.rejected, (state) => {
      return { ...state, tableData: [], status: "rejected" };
    });
    builder.addCase(fetchPostsByIdThunk.pending, (state) => {
      return { ...state, status: "pending" };
    });
    builder.addCase(fetchPostsByIdThunk.fulfilled, (state, action) => {
      return { ...state, tableDataById: action.payload, status: "fulfilled" };
    });
    builder.addCase(fetchPostsByIdThunk.rejected, (state) => {
      return { ...state, tableDataById: [], status: "rejected" };
    });
  },
});

const { reducer } = postsSlice;
export { reducer as postsReducer };
