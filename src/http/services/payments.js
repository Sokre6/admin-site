
import axios from "../axios";

export const createPaymentsConfirm = async (args) => {
  const response = await axios.post(
    "aurodomus-checkout/api/v1/payments/confirm/platform/transaction",
    args
  );
  return response.data;
};

