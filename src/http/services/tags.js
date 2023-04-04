import axios from "../axios";

export const getTags = async () => {
  const response = await axios.get("/aurodomus-blog/api/v1/tags");
  return response.data;
};