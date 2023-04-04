import axios from "../axios";

export const createLegalDocumentsByType = async (args) => {
  const response = await axios.post("aurodomus/api/v1/legal-documents", args);
  return response.data;
};

export const getLegalDocumentsByType = async (type) => {
  const response = await axios.get(`aurodomus/api/v1/legal-documents`, {
    params: { type },
  });

  return response.data;
};

export const getLegalDocumentsByTypeId = async (id) => {
  const response = await axios.get(`aurodomus/api/v1/legal-documents/${id}`);
  return response.data;
};

export const updateLegalDocumentsByType = async (id, args) => {
  const response = await axios.put(
    `aurodomus/api/v1/legal-documents/${id}`,
    args
  );
  return response.data;
};
