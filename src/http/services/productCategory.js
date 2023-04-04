import axios from "../axios";

export const getProductCategory = async () => {
  let response = await axios.get(
    "product/api/v1/product-categories/all-flat"
  );
  return response.data;
};

export const getProductCategoryById = async (args) => {
  let response = await axios.get(
    `product/api/v1/product-categories/${args.id}`
  );
  return response.data;
};

export const createProductCategory = async (args) => {
  let response = await axios.post("product/api/v1/product-categories", args);
  return response.data;
};

export const deleteProductCategory = async (args) => {
  let response = await axios.delete(
    `product/api/v1/product-categories/${args.id}`
  );
  return response.data;
};

export const updateProductCategory = async (args) => {
  let response = await axios.put(
    `product/api/v1/product-categories/${args.id}`,
    args.data
  );
  return response.data;
};
