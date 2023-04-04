import axios from "../axios";

export const getPackageDimension = async () => {
  let response = await axios.get("product/api/v1/package-dimensions");
  return response.data;
};

export const createPackageDimension = async (args) => {
  const response = await axios.post(
    "product/api/v1/package-dimensions",
    args
  );
  return response.data;
};

export const updatePackageDimension = async (args) => {
  const response = await axios.put(
    `product/api/v1/package-dimensions/${args.id}`,
    args
  );
  return response.data;
};

export const deletePackageDimension = async (args) => {
  const response = await axios.delete(
    `product/api/v1/package-dimensions/${args.id}`
  );
  return response.data;
};
