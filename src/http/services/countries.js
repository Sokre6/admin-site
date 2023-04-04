import axios from "../axios";

export const getCountries = async () => {
  const response = await axios.get(`aurodomus/api/v1/countries`);
  return response.data;
};

export const getCountriesByCode = async (countryCode) => {
  const response = await axios.get(`aurodomus/api/v1/countries/${countryCode}`);
  return response.data;
};


export const createCountry = async (args) => {
  const response = await axios.put(
    `aurodomus/api/v1/countries/${args.countryCode}`,
    args
  );
  return response.data;
};

export const updateCountry = async (args) => {
  const response = await axios.put(
    `aurodomus/api/v1/countries/${args.countryCode}`,
    args.data
  );
  return response.data;
};

export const deleteCountry = async (args) => {
  const response = await axios.delete(
    `aurodomus/api/v1/countries/${args.countryCode}`,
  );
  return response.data;
};
