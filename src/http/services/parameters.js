import axios from "../axios";


export const getParametersValidation = async (type) => {
    const response = await axios.get(`aurodomus/api/v1/parameters`);
  
    return response.data;
  };