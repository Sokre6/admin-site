import axios from "../axios";

export const getPaymentMethods = async () => {
  const response = await axios.get(
    "aurodomus-checkout/api/v1/payment-methods"
  );
  return response.data;
};

export const getPaymentMethodsById = async (id) => {
  const response = await axios.get(
    `aurodomus-checkout/api/v1/payment-methods/${id}`
  );
  return response.data;
};