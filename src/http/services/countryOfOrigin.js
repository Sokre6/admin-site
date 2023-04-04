import axios from "../axios";

export const getCountriesOfOrigin = async () => {
  var response = await axios.get("/aurodomus/api/v1/countries-of-origin");
  return response.data;
};

export const getCountryOfOriginByCode = async (code) => {
  var response = await axios.get(
    `/aurodomus/api/v1/countries-of-origin/${code}`
  );
  return response.data;
};

export const createCountryOfOrigin = async (args) => {
  var response = await axios.post(
    "/aurodomus/api/v1/countries-of-origin",
    args
  );
  return response.data;
};

export const updateCountryOfOrigin = async (code, args) => {
  var response = await axios.put(
    `/aurodomus/api/v1/countries-of-origin/${code}`,
    {
      names: args,
    }
  );
  return response.data;
};

export const deleteCountryOfOriginByCode = async (args) => {
  var response = await axios.delete(
    `/aurodomus/api/v1/countries-of-origin/${args}`
  );
  return response.data;
};
