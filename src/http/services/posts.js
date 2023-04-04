import axios from "../axios";

export const getPosts = async (args) => {
  const response = await axios.get(
    "/aurodomus-blog/api/v1/posts",
    args && {
      params: {
        page: args?.page,
        size: args?.pageSize,
        sortBy: args?.sortBy || null,
        title: args?.title || null,
        blogCategoryId: args?.blogCategoryId || null,
        authorId: args?.authorId || null,
        status: args?.status || null,
      },
    }
  );
  /* const response = await axios.get(
    `/aurodomus-blog/api/v1/posts?title=${title}&blogCategoryId=${blogCategoryId}&authorId=${authorId}&status=${status}&sortBy=[""]`,
    
  ); */
  return response.data;
};

export const getPostsById = async (id) => {
  const response = await axios.get(`/aurodomus-blog/api/v1/posts/${id}`);
  return response.data;
};

export const updatePosts = async (id, args) => {
  const response = await axios.put(`/aurodomus-blog/api/v1/posts/${id}`, args);
  return response.data;
};

export const createPosts = async (args) => {
  const response = await axios.post("/aurodomus-blog/api/v1/posts", args);
  return response.data;
};

export const patchPosts = async (args) => {
  const response = await axios.patch(
    `/aurodomus-blog/api/v1/posts/${args.id}/${args.type}`,
    args.type === "publish" && { publishedAt: args.publishedAt }
  );
  return response.data;
};

export const deletePosts = async (id) => {
  const response = await axios.delete(`/aurodomus-blog/api/v1/posts/${id}`);
  return response.data;
};
