import axios from "../axios";

export const getQuestions = async () => {
  var response = await axios.get("aurodomus/api/v1/frequently-asked-questions");
  return response.data;
};

export const getQuestionById = async (id) => {
  var response = await axios.get(`aurodomus/api/v1/frequently-asked-questions/${id}`);
  return response.data;
};

export const createQuestion = async (args) => {
  var response = await axios.post(
    "aurodomus/api/v1/frequently-asked-questions",
    args
  );
  return response.data;
};

export const deleteQuestion = async (args) => {
  var response = await axios.delete(
    `aurodomus/api/v1/frequently-asked-questions/${args}`
  );
  return response.data;
};

export const updateQuestion = async (id, args) => {
  var response = await axios.put(
    `aurodomus/api/v1/frequently-asked-questions/${id}`,
    args
  );
  return response.data;
};

export const updateQuestionActivity = async (id, activity) => {
  var response = await axios.patch(
    `aurodomus/api/v1/frequently-asked-questions/${id}`,
    null,
    { params: { activity } }
  );
  return response.data;
};
