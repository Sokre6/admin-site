import axios from '../axios';

export const getMobileUserAccountAdministration = async () => {
  let response = await axios.get('user_management/api/v1/users/mobile');
  return response.data;
};

export const getMobileUserAccountAdministrationPaged = async args => {
  let response = await axios.get('user_management/api/v1/users/mobile', {
    params: {first: args.first, max: args.max},
  });
  return response.data;
};
