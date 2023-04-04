import axios from "../axios";

export const getOrders = async (args) => {
  const response = await axios.get("aurodomus-checkout/api/v1/orders", {
    params: {
      createdStart: args?.createdStart || null,
      createdEnd: args?.createdEnd || null,
      totalPriceAmountFrom: args?.totalPriceAmountFrom || null,
      totalPriceAmountTo: args?.totalPriceAmountTo || null,
      paymentMethodType: args?.paymentMethodType || null,
      customerName: args?.customerName !== "" ? args?.customerName : null,
      customerEmail: args?.customerEmail !== "" ? args?.customerEmail : null,
      orderNumber: args?.orderNumber !== "" ? args?.orderNumber : null,
      status: args?.status || null,
      deliveryMethodType: args?.deliveryMethodType || null,
      page: args?.page,
      size: args?.size,
      sort: args?.sort.length === 0 ? null : args?.sort.toString(),
    },
  });
  return response.data;
};

export const getOrdersById = async (id) => {
  const response = await axios.get(`aurodomus-checkout/api/v1/orders/${id}`);
  return response.data;
};



export const sendMailOrder = async (args) => {
  const response = await axios.post(
    `aurodomus-checkout/api/v1/orders/${args.orderId}/documents/${args.documentId}/mail`
  );
  return response.data;
};
