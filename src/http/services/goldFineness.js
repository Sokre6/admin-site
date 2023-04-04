import axios from "../axios";

export const getGoldFinenessData = async () => {
  let response = await axios.get("product/api/v1/finenesses");
  return response.data;
};

export const createGoldFineness = async (args) => {
  let response = await axios.post("product/api/v1/finenesses", args);
  return response.data;
};

export const updateGoldFineness = async (args) => {
  let response = await axios.put(
    `product/api/v1/finenesses/${args.id}`,
    args
  );
  return response.data;
};

export const deleteGoldFineness = async (args) => {
  let response = await axios.delete(
    `product/api/v1/finenesses/${args.id}`
  
  );
  return response.data;
};
