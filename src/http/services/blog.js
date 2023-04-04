import axios from "../axios";

export const getBlogs = async () => {
  const response = await axios.get("/aurodomus-blog/api/v1/blog-categories");
  return response.data;
};

export const getBlogById = async (id) => {
  const response = await axios.get(`/aurodomus-blog/api/v1/blog-categories/${id}`);
  return response.data;
};

export const createBlog = async (args) => {
  const response = await axios.post("/aurodomus-blog/api/v1/blog-categories", args);
  return response.data;
};

export const updateBlog = async (id, args) => {
  const response = await axios.put(`/aurodomus-blog/api/v1/blog-categories/${id}`, {
    colorHexCode: args.colorHexCode,
    names: args.names,
  });
  return response.data;
};
export const deleteBlogById = async (id) => {
  const response = await axios.delete(`/aurodomus-blog/api/v1/blog-categories/${id}`);
  return response.data;
};
