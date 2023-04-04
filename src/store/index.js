import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import loggerMiddleware from "redux-logger";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import persistReducer from "redux-persist/lib/persistReducer";
import storage from "redux-persist/lib/storage";
import { currencyReducer } from "./slices/currency";
import { goldFinenessReducer } from "./slices/goldFineness";
import { identityReducer } from "./slices/identity";
import { languageReducer } from "./slices/language";
import { settingsReducer } from "./slices/settings";
import { questionCategoryReducer } from "./slices/questionCategory";
import { questionReducer } from "./slices/question";
import { manufacturersReducer } from "./slices/manufacturers";
import { productCategoryReducer } from "./slices/productCategory";
import { productReducer } from "./slices/product";

import { deliveryMethodReducer } from "./slices/deliveryMethod";
import { deliveryCostReducer } from "./slices/deliveryCost";
import { userAccountAdministrationReducer } from "./slices/userAccountAdministration";
import { mobileUserAccountAdministrationReducer } from "./slices/mobileUserAccountAdministration";
import { rolesReducer } from "./slices/roles";
import { packageDimensionReducer } from "./slices/packageDimension";
import { productMaterialReducer } from "./slices/productMaterial";
import { fileReducer } from "./slices/file";
import { officesReducer } from "./slices/office";
import { blogReducer } from "./slices/blog";
import { authorReducer } from "./slices/author";
import { parametersAdministrationReducer } from "./slices/parametersAdministration";
import { legalDocumentsByTypeReducer } from "./slices/legalDocuments";
import { countriesReducer } from "./slices/countries";
import { postsReducer } from "./slices/posts";
import { tagsReducer } from "./slices/tags";
import { mediaAssetsReducer } from "./slices/mediaAssets";
import { parametersValidationsReducer } from "./slices/parameters";
import { ordersReducer } from "./slices/orders";
import { paymentMethodsReducer } from "./slices/paymentMethods";
import { buybackReducer } from "./slices/buyback";
import { paymentsConfirmReducer } from "./slices/payments";

const persistConfig = {
  key: "root",
  version: 1,
  storage: storage,
  blackList: ["identity"],
};

const rootReducer = persistReducer(
  persistConfig,
  combineReducers({
    identity: identityReducer,
    language: languageReducer,
    settings: settingsReducer,
    currency: currencyReducer,
    goldFineness: goldFinenessReducer,
    questionCategory: questionCategoryReducer,
    questions: questionReducer,
    manufacturers: manufacturersReducer,
    productCategories: productCategoryReducer,

    deliveryMethod: deliveryMethodReducer,
    deliveryCost: deliveryCostReducer,
    userAccountAdministration: userAccountAdministrationReducer,
    mobileAccountAdministration: mobileUserAccountAdministrationReducer,
    roles: rolesReducer,
    product: productReducer,
    packageDimension: packageDimensionReducer,
    productMaterial: productMaterialReducer,
    office: officesReducer,
    fileReducer: fileReducer,
    blog: blogReducer,
    author: authorReducer,
    parametersAdministration: parametersAdministrationReducer,
    legalDocumentsByType: legalDocumentsByTypeReducer,
    countries: countriesReducer,
    posts: postsReducer,
    tags: tagsReducer,
    mediaAssets: mediaAssetsReducer,
    parametersValidations: parametersValidationsReducer,
    orders: ordersReducer,
    paymentMethods: paymentMethodsReducer,
    paymentsConfirm: paymentsConfirmReducer,
    buyback: buybackReducer,
  })
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    loggerMiddleware,
  ],
});

export const persistor = persistStore(store);
export default store;
