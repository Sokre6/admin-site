import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import config from "../config";
import keycloak from "../keycloak";
import { clearIdentity, setIdentity } from "../store/slices/identity";

let _store;
export const injectStoreForAxios = (store) => {
  _store = store;
};

export const createAxios = () => {
  return axios.create({
    timeout: 60000,
    baseURL: config.REACT_APP_HTTP_API_GATEWAY,
  });
};

const instance = createAxios();

//Authorization interceptor
instance.interceptors.request.use((request) => {
  if (!!keycloak.token) {
    request.headers["Authorization"] = `Bearer ${keycloak.token}`;
  }
  return request;
});

// Language interceptor
instance.interceptors.request.use(async (request) => {
  const { language } = _store.getState().settings;
  if (language) {
    request.headers["Accept-Language"] = language;
  }
  return request;
});

//Token refresh interceptor
createAuthRefreshInterceptor(
  instance,
  async (failedRequest) => {
    await keycloak
      .updateToken(5)
      .then(function (refreshed) {
        if (refreshed) {
          _store.dispatch(
            setIdentity({
              idToken: keycloak.idToken,
              idTokenParsed: keycloak.idTokenParsed,
            })
          );
          failedRequest.response.config.headers[
            "Authorization"
          ] = `Bearer ${keycloak.token}`;
        }
        return Promise.resolve();
      })
      .catch(function () {
        keycloak.login().then(() => _store.dispatch(clearIdentity()));
        return Promise.reject(failedRequest);
      });
  },
  {
    pauseInstanceWhileRefreshing: true,
  }
);

export default instance;
