import axios from '../axios';

export const getUserAccountAdministration = async () => {
  let response = await axios.get('user_management/api/v1/users/admin');
  return response.data;
};
export const getUserAccountAdministrationPaged = async args => {
  let response = await axios.get('user_management/api/v1/users/admin', {
    params: {first: args.first, max: args.max},
  });
  return response.data;
};

export const createUserAccountAdministration = async args => {
  let response = await axios.post('user_management/api/v1/users', args);
  return response.data;
};

export const updateUserAccountAdministration = async args => {
  let response = await axios.put(
    `user_management/api/v1/users/${args.id}`,
    args.data,
  );
  return response.data;
};

export const deleteUserAccountAdministration = async args => {
  var response = await axios.delete(`user_management/api/v1/users/${args.id}`);
  return response.data;
};

export const resendUserAccountMail = async args => {
  let response = await axios.put(
    `user_management/api/v1/users/${args.id}/resend-mail`,
  );
  return response.data;
};
