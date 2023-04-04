import Keycloak from "keycloak-js";
import config from "../config";
import { setUserRoles } from "../store/slices/roles";


const keycloakConfig = {
  realm: config.REACT_APP_AUTH_REALM,
  clientId: config.REACT_APP_AUTH_CLIENT_ID,
  url: config.REACT_APP_AUTH_URL,
};

export const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = (onAuthenticatedCallback, store) => {
  keycloak
    .init({
      onLoad: "login-required",
      redirectUri: window?.location?.href,
    })
    .then((authenticated) => {
      if (!authenticated) {
        keycloak.login();
      }
      store.dispatch(setUserRoles(keycloak.tokenParsed['aurodomus_roles']))
      onAuthenticatedCallback();
    })
    .catch(console.error);
};
export default keycloak;
