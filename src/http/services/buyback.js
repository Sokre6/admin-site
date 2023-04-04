import axios from "../axios";

export const getbuyback = async (args) => {
  const response = await axios.get("product/api/v1/buyback-requests", {
    params: {
      number: args?.number || null,
      serialNumber: args?.serialNumber || null,
      status: args?.status || null,
      createdAtStart: args?.createdAtStart || null,
      createdAtEnd: args?.createdAtEnd || null,
      appraisalPriceAmountFrom: args?.appraisalPriceAmountFrom || null,
      appraisalPriceAmountTo: args?.appraisalPriceAmountTo || null,
      productId: args?.productId || null,
      subjectRef: args?.subjectRef || null,
      productSkuId: args?.productSkuId || null,
      productSkuName: args?.productSkuName || null,
      productCategoryId: args?.productCategoryId || null,
      productCategoryName: args?.productCategoryName || null,
      sortBy: args?.sort.length === 0 ? null : args?.sort.toString(),
      subjRef: args?.subjRef,
      page: args?.page,
      size: args?.size,
    },
  });
  return response.data;
};

export const getbuybackById = async (id) => {
  const response = await axios.get(`product/api/v1/buyback-requests/${id}`);
  return response.data;
};

export const updateBuybackTracking = async (id, args) => {
  const response = await axios.put(
    `product/api/v1/buyback-requests/${id}/tracking`,
    {
      trackingNumber: args.trackingNumber,
      courierCode: args.courierCode,
    }
  );
  return response.data;
};

export const completeBuyback = async (id, args) => {
  const response = await axios.put(
    `product/api/v1/buyback-requests/${id}/complete`,
    {
      note: args.note,
    }
  );
  return response.data;
};

export const cancelBuyback = async (id, args) => {
  console.log("CANCEL BUYBACK ARGS ------------->", args);

  const response = await axios.put(
    `product/api/v1/buyback-requests/${id}/cancel`,
    {
      note: args.note,
    }
  );
  return response.data;
};

export const updateBuybackAppraisal = async (id, args) => {
  const response = await axios.put(
    `product/api/v1/buyback-requests/${id}/appraisal-price`,
    {
      amount: args.amount,
      currency: args.currency,
    }
  );
  return response.data;
};
