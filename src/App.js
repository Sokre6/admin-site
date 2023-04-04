import { AppShell, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import CurrencyCodebook from "./components/CurrencyCodebook/CurrencyCodebook";
import LanguageCodebook from "./components/LanguageCodebook/LanguageCodebook";
import CurrencyLocalizationTable from "./components/CurrencyCodebook/CurrencyLocalizationTable";
import LanguageLocaliationTable from "./components/LanguageCodebook/LanguageLocalizationTable";
import Navigation from "./components/Navigation";
import { persistor, store } from "./store";
import theme from "./theme";
import GoldFinenessCodebook from "./components/GoldFinenessCodebook/GoldFinenessCodebook";
import QuestionCategoryCodebook from "./components/QuestionCategoryCodebook/QuestionCategoryCodebook";
import QuestionCategoryTableLocalization from "./components/QuestionCategoryCodebook/QuestionCategoryTableLocalization";
import QuestionsCodebook from "./components/Questions/QuestionsCodebook";
import QuestionLocalizationTable from "./components/Questions/QuestionLocalizationTable";
import ManufacturersCodebook from "./components/ManufacturersCodebook/ManufacturersCodebook";
import ProductCategoryCodebook from "./components/ProductCategoryCodebook/ProductCategoryCodebook";
import ProductCategoryLocalizationTable from "./components/ProductCategoryCodebook/ProductCategoryLocalizationTable";

import DeliveryMethodCodebook from "./components/DeliveryMethodCodebook/DeliveryMethodCodebook";
import DeliveryMethodLocalizationTable from "./components/DeliveryMethodCodebook/DeliveryMethodLocalizationTable";
import DeliveryCostTable from "./components/DeliveryCostCodebook/DeliveryCostTable";
import UserAdminstrationAccounts from "./components/UserAdministration/UserAdministrationAccounts";
import UserAdminMobileAccounts from "./components/UserAdministrationMobile/UserAdminMobileAccounts";
import ProductCodebook from "./components/Products/ProductCodebook";
import ProductsLocalizationTable from "./components/Products/ProductsLocalizationTable";
import PackageDimensionCodebook from "./components/PackageDimensionCodebook/PackageDimensionCodebook";
import OfficeCodebook from "./components/OfficeCodebook/OfficeCodebook";
import Homepage from "./components/Homepage/Homepage";
import ProtectedRoutes from "./protectedRoutes/ProtectedRoutes";
import Blog from "./components/Blog/Blog";
import BlogLocalizationTable from "./components/Blog/BlogLocalizationTable";
import Author from "./components/Author/Author";
import AuthorLocalizationTable from "./components/Author/AuthorLocalizationTable";
import ParameterAdmin from "./components/ParameterAdministration/ParameterAdmin";
import GeneralTerms from "./components/GeneralTerms/GeneralTerms";
import GeneralTermsLocalizationTable from "./components/GeneralTerms/GeneralTermsLocalizationTable";
import AboutUs from "./components/AboutUs/AboutUs";
import AboutUsLocalizationTable from "./components/AboutUs/AboutUsLocalizationTable";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import PrivacyPolicyLocalizationTable from "./components/PrivacyPolicy/PrivacyPolicyLocalizationTable";
import OrderTermsAndConditions from "./components/OrderTermsAndConditions/OrderTermsAndConditions";
import OrderTermsAndConditionsLocalizationTable from "./components/OrderTermsAndConditions/OrderTermsAndConditionsLocalizationTable";
import CountriesCodebook from "./components/Countries/CountriesCodebook";
import CountriesLocalizationTable from "./components/Countries/CountriesLocalizationTable";
import Orders from "./components/Orders/Orders";

import OrderDetails from "./components/Orders/OrderDetails";
import Posts from "./components/Posts/Posts";
import PostsDetails from "./components/Posts/PostsDetails";
import PostsLocalizationTable from "./components/Posts/PostsLocalizationTable";
import MediaAssets from "./components/MediaAssets/MediaAssets";
import Buyback from "./components/Buyback/buyback";
import BuybackDetails from "./components/Buyback/buybackDetails";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
          <NotificationsProvider position="top-right">
            <BrowserRouter>
              <AppShell
                padding="md"
                styles={{
                  main: {
                    height: "100vh",
                    overflow: "auto",
                  },
                }}
                navbar={<Navigation />}
              >
                <Routes>
                  <Route
                    path="faq"
                    element={<ProtectedRoutes userRoles={["FAQ_ADMIN"]} />}
                  >
                    <Route path="questions">
                      <Route index element={<QuestionsCodebook />} />
                      <Route
                        path=":questionId"
                        element={<QuestionLocalizationTable />}
                      />
                    </Route>
                    <Route path="questionsCategory">
                      <Route index element={<QuestionCategoryCodebook />} />
                      <Route
                        path=":questionsCategoryId"
                        element={<QuestionCategoryTableLocalization />}
                      />
                    </Route>
                  </Route>
                  <Route
                    path="codebook"
                    element={<ProtectedRoutes userRoles={["CODEBOOK_ADMIN"]} />}
                  >
                    <Route path="language">
                      <Route index element={<LanguageCodebook />} />
                      <Route
                        path=":languageCode"
                        element={<LanguageLocaliationTable />}
                      />
                    </Route>
                    <Route path="currency">
                      <Route index element={<CurrencyCodebook />} />
                      <Route
                        path=":currencyCode"
                        element={<CurrencyLocalizationTable />}
                      />
                    </Route>

                    <Route path="countries">
                      <Route index element={<CountriesCodebook />} />
                      <Route
                        path=":code"
                        element={<CountriesLocalizationTable />}
                      />
                    </Route>

                    <Route path="delivery-method">
                      <Route index element={<DeliveryMethodCodebook />} />
                      <Route
                        path="deliveryCost"
                        element={<DeliveryCostTable />}
                      />
                      <Route
                        path=":deliveryMethodId"
                        element={<DeliveryMethodLocalizationTable />}
                      />
                    </Route>

                    <Route path="offices" element={<OfficeCodebook />} />
                  </Route>

                  <Route
                    path="products"
                    element={<ProtectedRoutes userRoles={["PRODUCT_ADMIN"]} />}
                  >
                    <Route path="product">
                      <Route index element={<ProductCodebook />} />
                      <Route
                        path=":productId"
                        element={<ProductsLocalizationTable />}
                      />
                    </Route>
                    <Route path="product-category">
                      <Route index element={<ProductCategoryCodebook />} />
                      <Route
                        path=":productCategoryId"
                        element={<ProductCategoryLocalizationTable />}
                      />
                    </Route>
                    <Route
                      path="gold-finesess"
                      element={<GoldFinenessCodebook />}
                    />
                    <Route
                      path="manufacturers"
                      element={<ManufacturersCodebook />}
                    />
                    <Route
                      path="package-dimension"
                      element={<PackageDimensionCodebook />}
                    />
                  </Route>
                  <Route
                    path="users"
                    element={<ProtectedRoutes userRoles={["USER_ADMIN"]} />}
                  >
                    {/*  user routes */}
                    <Route
                      path="user-admin-accounts"
                      element={<UserAdminstrationAccounts />}
                    />
                    <Route
                      path="user-mobile-accounts"
                      element={<UserAdminMobileAccounts />}
                    />
                  </Route>
                  <Route
                    path="blog"
                    element={<ProtectedRoutes userRoles={["BLOG_ADMIN"]} />}
                  >
                    {/* blog routes */}
                    <Route path="blogs">
                      <Route index element={<Blog />} />
                      <Route
                        path=":blogId"
                        element={<BlogLocalizationTable />}
                      />
                    </Route>
                    {/* author routes */}
                    <Route path="authors">
                      <Route index element={<Author />} />
                      <Route
                        path=":authorId"
                        element={<AuthorLocalizationTable />}
                      />
                    </Route>
                    {/* post routes */}
                    <Route path="posts">
                      <Route index element={<Posts />} />
                      <Route
                        path="details/:postsId"
                        element={<PostsDetails />}
                      />
                      <Route
                        path="localization/:id"
                        element={<PostsLocalizationTable />}
                      />
                    </Route>
                    {/* media assets routes */}

                    <Route path="media-assets">
                      <Route index element={<MediaAssets />} />
                    </Route>
                  </Route>

                  <Route
                    path="parameters"
                    element={<ProtectedRoutes userRoles={["PARAMS_ADMIN"]} />}
                  >
                    {/* parameters administration routes */}
                    <Route path="parameters-administration">
                      <Route index element={<ParameterAdmin />} />
                    </Route>
                    {/* general terms administration routes */}
                    <Route path="general-terms">
                      <Route index element={<GeneralTerms />} />
                      <Route
                        path=":generalTermsId"
                        element={<GeneralTermsLocalizationTable />}
                      />
                    </Route>
                    {/* privacy policy administration routes */}
                    <Route path="privacy-policy">
                      <Route index element={<PrivacyPolicy />} />
                      <Route
                        path=":privacyPolicyId"
                        element={<PrivacyPolicyLocalizationTable />}
                      />
                    </Route>
                    {/* about us administration routes */}
                    <Route path="about-us">
                      <Route index element={<AboutUs />} />
                      <Route
                        path=":aboutUsId"
                        element={<AboutUsLocalizationTable />}
                      />
                    </Route>
                    {/* order terms and conditions routes */}
                    <Route path="order-terms-and-conditions">
                      <Route index element={<OrderTermsAndConditions />} />
                      <Route
                        path=":orderTermsAndConditionsId"
                        element={<OrderTermsAndConditionsLocalizationTable />}
                      />
                    </Route>
                  </Route>

                  <Route
                    path="orders"
                    element={<ProtectedRoutes userRoles={["PARAMS_ADMIN"]} />}
                  >
                    <Route path="orders-administration">
                      <Route index element={<Orders />} />

                      <Route path=":orderId" element={<OrderDetails />} />
                    </Route>
                  </Route>

                  <Route
                    path="buyback"
                    element={<ProtectedRoutes userRoles={["BUYBACK_ADMIN"]} />}
                  >
                    <Route path="requests">
                      <Route index element={<Buyback />} />
                      <Route path=":id" element={<BuybackDetails />} />
                    </Route>
                  </Route>

                  <Route path="/">
                    <Route index element={<Homepage />} />
                  </Route>
                  <Route path="*" element={<h1>404</h1>} />
                </Routes>
              </AppShell>
            </BrowserRouter>
          </NotificationsProvider>
        </MantineProvider>
      </PersistGate>
    </Provider>
  );
};
export default App;
