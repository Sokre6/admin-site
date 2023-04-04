import axios from "../axios";

export const getCurrencyData = async () => {
  var response = await axios.get("aurodomus/api/v1/applicable-currencies");
  return response.data;
};
export const getCurrencyByCode = async (code) => {
  var response = await axios.get(
    `aurodomus/api/v1/applicable-currencies/${code}`
  );
  return response.data;
};

export const updateCurrency = async (code, args) => {
  var response = await axios.put(
    `aurodomus/api/v1/applicable-currencies/${code}`,
    {
      names: args,
    }
  );
  return response.data;
};

export const createCurrency = async (args) => {
  var response = await axios.post(
    "aurodomus/api/v1/applicable-currencies",
    args
  );
  return response.data;
};

export const deleteCurrencyByCode = async (args) => {
  var response = await axios.delete(
    `aurodomus/api/v1/applicable-currencies/${args}`
  );
  return response.data;
};
