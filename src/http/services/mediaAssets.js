import axios from "../axios";

export const getMediaAssets = async (args) => {
  const response = await axios.get("/aurodomus-blog/api/v1/media-assets", {
    params: {
      title: args.title || null,
      altText: args.altText|| null,
      caption: args.caption|| null,
      fileName: args.fileName|| null,
      sortBy:args.sortBy|| null,
      page: args.page,
      size: args.size,
    },
  });
  return response.data;
};

export const getMediaAssetsId = async (id) => {
  const response = await axios.get(`/aurodomus-blog/api/v1/media-assets/${id}`);
  return response.data;
};

export const createMediaAssets = async (args) => {
  const response = await axios.post(
    "/aurodomus-blog/api/v1/media-assets",
    args
  );
  return response.data;
};

export const updateMediaAssets = async (id, args) => {
  const response = await axios.put(
    `/aurodomus-blog/api/v1/media-assets/${id}`,
    args
  );
  return response.data;
};
export const deleteMediaAssets = async (id) => {
  const response = await axios.delete(
    `/aurodomus-blog/api/v1/media-assets/${id}`
  );
  return response.data;
};
