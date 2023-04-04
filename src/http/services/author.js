import axios from "../axios";

export const getAuthors = async () => {
  const response = await axios.get("/aurodomus-blog/api/v1/authors");
  return response.data;
};

export const getAuthorById = async (id) => {
  const response = await axios.get(`/aurodomus-blog/api/v1/authors/${id}`);
  return response.data;
};

export const updateAuthor = async (id, args) => {
  const response = await axios.put(`/aurodomus-blog/api/v1/authors/${id}`, {
    givenName: args.givenName,
    familyName:args.familyName,
    photoId:args.photoId,
    descriptions: args.descriptions,
    socialMediaProfiles:args.socialMediaProfiles
  });
  return response.data;
};

export const createAuthor = async (args) => {
  const response = await axios.post("/aurodomus-blog/api/v1/authors", args);
  return response.data;
};

export const deleteAuthorById = async (id) => {
  const response = await axios.delete(`/aurodomus-blog/api/v1/authors/${id}`);
  return response.data;
};
