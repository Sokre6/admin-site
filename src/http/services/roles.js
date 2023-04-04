import axios from "../axios";

export const getRoles = async () => {
  let response = await axios.get(
    "user_management/api/v1/roles/admin"
  );
  return response.data;
};
