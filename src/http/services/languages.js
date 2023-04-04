import axios from "../axios";

export const getLanguageByCode = async (code) => {
  var response = await axios.get(
    `aurodomus/api/v1/applicable-languages/${code}`
  );
  return response.data;
};

export const getLanguagesData = async () => {
  var response = await axios.get(`aurodomus/api/v1/applicable-languages`);
  return response.data;
};
export const updateLanguage = async (code, args, activity) => {

  var response = await axios.put(
    `aurodomus/api/v1/applicable-languages/${code}`,
    {
      names: args,
      activity,
    }
  );
  return response.data;
};

export const createLanguage = async (args) => {
  var response = await axios.post(
    `aurodomus/api/v1/applicable-languages`,
    args
  );
  return response.data;
};

export const deleteLanguageByCode = async (args) => {
  var response = await axios.delete(
    `aurodomus/api/v1/applicable-languages/${args}`
  );
  return response.data;
};
