import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { injectStoreForAxios } from "./http/axios";
import "./index.css";
import { initKeycloak } from "./keycloak";
import reportWebVitals from "./reportWebVitals";
import store from "./store";

const renderApp = () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
};
injectStoreForAxios(store);
initKeycloak(renderApp,store);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
