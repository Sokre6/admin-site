import axios from "../axios";

export const getProductMaterials = async () => {
  var response = await axios.get("product/api/v1/materials");
  return response.data;
};
