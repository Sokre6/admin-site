import axios from "../axios";

export const getProductData = async () => {
  var response = await axios.get("product/api/v1/products");
  return response.data;
};

export const getProductById = async (id) => {
  var response = await axios.get(`product/api/v1/products/${id}`);
  return response.data;
};
export const updateProduct = async (id, args) => {
  var response = await axios.put(`product/api/v1/products/${id}`, args);
  return response.data;
};
