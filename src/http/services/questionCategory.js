import axios from "../axios";

export const getQuestionCategories = async () => {
  var response = await axios.get("aurodomus/api/v1/question-categories");
  return response.data;
};

export const getQuestionCategoryByCode = async (id) => {
  var response = await axios.get(`aurodomus/api/v1/question-categories/${id}`);
  return response.data;
};

export const createQuestionCategory = async (args) => {
  var response = await axios.post("aurodomus/api/v1/question-categories", args);
  return response.data;
};

export const updateQuestionCategory = async (id, args) => {
  var response = await axios.put(`aurodomus/api/v1/question-categories/${id}`, args);
  return response.data;
};

export const deleteQuestionCategoryByCode = async (id) => {
  var response = await axios.delete(`aurodomus/api/v1/question-categories/${id}`);
  return response.data;
};
