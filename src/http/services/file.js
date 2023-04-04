import axios from "../axios";

export const createFile = async (file) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await axios.post(`aurodomus-file/api/v1/files`, file, config);
  //debugger;
console.log(response)
  return response.headers;
};

export const getFileById = async (id) => {
  const response = await axios.get(`aurodomus-file/api/v1/files/${id}`, {
    responseType: "blob",
  });
  return response.data;
};
