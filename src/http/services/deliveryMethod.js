import axios from "../axios";

export const getDeliveryMethodData = async () => {
  var response = await axios.get("aurodomus-checkout/api/v1/delivery-methods");
  return response.data;
};

export const getDeliveryMethodById = async (id) => {
  var response = await axios.get(`aurodomus-checkout/api/v1/delivery-methods/${id}`);
  return response.data;
};

export const updateDeliveryMethod = async (id, args) => {
  var response = await axios.put(`aurodomus-checkout/api/v1/delivery-methods/${id}`, {
    names: args,
  });
  return response.data;
};
