import axios from "../axios";

export const getDeliveryCost = async () => {
  var response = await axios.get("aurodomus-checkout/api/v1/delivery-cost/policies");
  return response.data;
};

export const createDeliveryCost = async (args) => {
  var response = await axios.post("aurodomus-checkout/api/v1/delivery-cost/policies", args);
  return response.data;
};

export const updateDeliveryCost = async (id, args) => {
  var response = await axios.put(`aurodomus-checkout/api/v1/delivery-cost/policies/${id}`, args);
  return response.data;
};

export const deleteDeliveryCostById = async (id) => {
  var response = await axios.delete(`aurodomus-checkout/api/v1/delivery-cost/policies/${id}`);
  return response.data;
};
