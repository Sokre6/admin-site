import axios from "../axios";

export const getApplicableCountriesData = async () => {
  let response = await axios.get(
    "aurodomus/api/v1/offices/applicable-countries"
  );
  return response.data;
};

export const getOfficesData = async (args) => {
  let response = await axios.get("aurodomus/api/v1/offices", {
    params: { countryCode: args },
  });
  return response.data;
};
