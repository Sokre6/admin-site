import axios from "../axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    isAccepted: true,
  },
};

export const getParametersAdministration = async () => {
  let response = await axios.get("aurodomus/api/v1/parameters");
  return response.data;
};

export const getParametersAdministrationId = async (key) => {
  const response = await axios.get(`aurodomus/api/v1/parameters/${key}`);
  return response.data;
};

export const updateParametersAdministration = async (key, value) => {
  const response = await axios.put(`aurodomus/api/v1/parameters/${key}`, null, {
    params: { value },
  });
  return response.data;
};
