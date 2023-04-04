import { createStyles, Group, Navbar, ScrollArea } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Logout,
  QuestionMark,
  Category,
  ZoomQuestion,
  FileText,
  Language,
  CurrencyEuro,
  BuildingFactory2,
  TruckDelivery,
  World,
  Certificate,
  Users,
  Barcode,
  Category2,
  UserCircle,
  DeviceMobile,
  Dimensions,
  Building,
  ArrowLeft,
  Article,
  Wallpaper,
  AddressBook,
  FileSettings,
  Settings,
  Notebook,
  HandStop,
  Accessible,
  File,
  PackgeExport,
  Ship,
  Send,
  PictureInPicture,
  Wallet,
  Pencil,
} from "tabler-icons-react";
import { Route, Routes } from "react-router-dom";
import keycloak from "../../keycloak";
import { clearIdentity } from "../../store/slices/identity";
import { useTranslation } from "react-i18next";
import images from "../../assets/images/index";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colors.dark[6],
    color: theme.white,
  },

  header: {
    paddingBottom: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.dark[7]}`,
  },

  logo: {
    width: "100%",
    height: "10%",
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.colors.gray[3],
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.black,
      color: theme.white,
    },
  },
  linkActive: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.white,
    backgroundColor: theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
  },

  menuName: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.xl,
    color: theme.colors.gray[3],
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
  },

  linkIcon: {
    color: theme.colors.gray[3],
    marginRight: theme.spacing.sm,
  },
}));

export const Navigation = ({ children }) => {
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const { t } = useTranslation();

  const userRoles = useSelector((state) => state.roles.userRoles);

  const location = useLocation();

  const locationPath = (path) => {
    switch (path) {
      //faq routes
      case "/faq/questions":
        return "/";
      case "/faq/questionsCategory":
        return "/";
      //codebook routes
      case "/codebook/language":
        return "/";
      case " /codebook/currency":
        return "/";
      case "/codebook/delivery-method":
        return "/";
      case "/codebook/countries":
        return "/";
      case "/codebook/offices":
        return "/";
      //products routes
      case "/products/product":
        return "/";
      case "/products/product-category":
        return "/";
      case "/products/gold-finesess":
        return "/";
      case "/products/manufacturers":
        return "/";
      case "/products/package-dimension":
        return "/";
      //users routes
      case "/users/user-admin-accounts":
        return "/";
      case "/users/user-mobile-accounts":
        return "/";
      //blog routes
      case "/blog/authors":
        return "/";
      case "/blog/blogs":
        return "/";
      case "/blog/posts":
        return "/";
      case "/blog/media-assets":
        return "/";
      //parameters routes
      case "/parameters/parameters-administration":
        return "/";
      case "/parameters/general-terms":
        return "/";
      case "/parameters/privacy-policy":
        return "/";
      case "/parameters/about-us":
        return "/";
      case "/parameters/about-us":
        return "/parameters/order-terms-and-conditions";
      //orders routes
      case "/orders/orders-administration":
        return "/";
      //buyback routes
      case "buyback/requests":
        return "/";
      default:
        return -1;
    }
  };

  const RootNavigation = () => {
    return (
      <>
        <Navbar.Section grow component={ScrollArea}>
          {userRoles.includes("FAQ_ADMIN") && (
            <NavLink to="/faq/questions" className={classes.link}>
              <ZoomQuestion className={classes.linkIcon} />
              <span>{t("rootNavigation.faq")}</span>
            </NavLink>
          )}
          {userRoles.includes("CODEBOOK_ADMIN") && (
            <NavLink to="/codebook/language" className={classes.link}>
              <FileText className={classes.linkIcon} />
              <span>{t("rootNavigation.codebook")}</span>
            </NavLink>
          )}
          {userRoles.includes("USER_ADMIN") && (
            <NavLink to="/users/user-admin-accounts" className={classes.link}>
              <Users className={classes.linkIcon} />
              <span>{t("rootNavigation.users")}</span>
            </NavLink>
          )}
          {userRoles.includes("PRODUCT_ADMIN") && (
            <NavLink to="/products/product" className={classes.link}>
              <Barcode className={classes.linkIcon} />
              <span>{t("rootNavigation.products")}</span>
            </NavLink>
          )}
          {userRoles.includes("BLOG_ADMIN") && (
            <NavLink to="/blog/blogs" className={classes.link}>
              <Article className={classes.linkIcon} />
              <span>{t("rootNavigation.blog")}</span>
            </NavLink>
          )}
          {userRoles.includes("PARAMS_ADMIN") && (
            <NavLink
              to="/parameters/parameters-administration"
              className={classes.link}
            >
              <Settings className={classes.linkIcon} />
              <span>{t("rootNavigation.parametersAdmin")}</span>
            </NavLink>
          )}

          {userRoles.includes("ORDER_ADMIN") && (
            <NavLink
              to="/orders/orders-administration"
              className={classes.link}
            >
              <Ship className={classes.linkIcon} />
              <span>{t("rootNavigation.orders")}</span>
            </NavLink>
          )}
          {userRoles.includes("BUYBACK_ADMIN") && (
            <NavLink to="/buyback/requests" className={classes.link}>
              <Wallet className={classes.linkIcon} />
              <span>{t("rootNavigation.buyback")}</span>
            </NavLink>
          )}
        </Navbar.Section>
      </>
    );
  };

  const FAQNavigation = () => {
    return (
      <>
        <NavLink to={locationPath(location.pathname)} className={classes.link}>
          <ArrowLeft className={classes.linkIcon} />
          <span>{t("navigation.return")}</span>
        </NavLink>
        <p className={classes.menuName}>{t("navigation.FAQmenu")}</p>
        <Navbar.Section grow component={ScrollArea}>
          <NavLink
            to="questions"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <QuestionMark className={classes.linkIcon} />
            <span>{t("navigation.question")}</span>
          </NavLink>
          <NavLink
            to="questionsCategory"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Category className={classes.linkIcon} />
            <span>{t("navigation.questionCategory")}</span>
          </NavLink>
        </Navbar.Section>
      </>
    );
  };

  const CodebookNavigation = () => {
    return (
      <>
        <Link to={locationPath(location.pathname)} className={classes.link}>
          <ArrowLeft className={classes.linkIcon} />
          <span>{t("navigation.return")}</span>
        </Link>
        <p className={classes.menuName}>{t("navigation.codebooksMenu")}</p>
        <Navbar.Section grow component={ScrollArea}>
          <NavLink
            to="language"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Language className={classes.linkIcon} />
            <span>{t("navigation.language")}</span>
          </NavLink>
          <NavLink
            to="currency"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <CurrencyEuro className={classes.linkIcon} />
            <span>{t("navigation.currency")}</span>
          </NavLink>

          <NavLink
            to="delivery-method"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <TruckDelivery className={classes.linkIcon} />
            <span>{t("navigation.deliveryMethod")}</span>
          </NavLink>

          <NavLink
            to="countries"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <World className={classes.linkIcon} />
            <span>{t("navigation.countries")}</span>
          </NavLink>

          <NavLink
            to="offices"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Building className={classes.linkIcon} />
            <span>{t("navigation.offices")}</span>
          </NavLink>
        </Navbar.Section>
      </>
    );
  };

  const ProductsNavigation = () => {
    return (
      <>
        <NavLink to={locationPath(location.pathname)} className={classes.link}>
          <ArrowLeft className={classes.linkIcon} />
          <span>{t("navigation.return")}</span>
        </NavLink>
        <p className={classes.menuName}>{t("navigation.productsMenu")}</p>
        <Navbar.Section grow component={ScrollArea}>
          <NavLink
            to="product"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Category2 className={classes.linkIcon} />
            <span>{t("navigation.product")}</span>
          </NavLink>
          <NavLink
            to="product-category"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Category className={classes.linkIcon} />
            <span>{t("navigation.productCategory")}</span>
          </NavLink>
          <NavLink
            to="gold-finesess"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Certificate className={classes.linkIcon} />
            <span>{t("navigation.goldFinesses")}</span>
          </NavLink>
          <NavLink
            to="manufacturers"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <BuildingFactory2 className={classes.linkIcon} />
            <span>{t("navigation.manufacturers")}</span>
          </NavLink>
          <NavLink
            to="package-dimension"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Dimensions className={classes.linkIcon} />
            <span>{t("navigation.packageDimension")}</span>
          </NavLink>
        </Navbar.Section>
      </>
    );
  };

  const UsersNavigation = () => {
    return (
      <>
        <NavLink to={locationPath(location.pathname)} className={classes.link}>
          <ArrowLeft className={classes.linkIcon} />
          <span>{t("navigation.return")}</span>
        </NavLink>
        <p className={classes.menuName}>{t("navigation.usersMenu")}</p>
        <Navbar.Section grow component={ScrollArea}>
          {/* ....Linkovi za products */}
          <NavLink
            to="user-admin-accounts"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <UserCircle className={classes.linkIcon} />
            <span>{t("user.userAccounts")}</span>
          </NavLink>
          <NavLink
            to="user-mobile-accounts"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <DeviceMobile className={classes.linkIcon} />
            <span>{t("userMobile.userMobileAccounts")}</span>
          </NavLink>
        </Navbar.Section>
      </>
    );
  };

  const BlogNavigation = () => {
    return (
      <>
        <NavLink to={locationPath(location.pathname)} className={classes.link}>
          <ArrowLeft className={classes.linkIcon} />
          <span>{t("navigation.return")}</span>
        </NavLink>
        <p className={classes.menuName}>{t("navigation.blog")}</p>
        <Navbar.Section grow component={ScrollArea}>
          {/* ....Linkovi za blog i author*/}
          <NavLink
            to="blogs"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Wallpaper className={classes.linkIcon} />
            <span>{t("blog.blog")}</span>
          </NavLink>

          <NavLink
            to="authors"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <AddressBook className={classes.linkIcon} />
            <span>{t("author.authors")}</span>
          </NavLink>
          <NavLink
            to="posts"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Send className={classes.linkIcon} />
            <span>{t("posts.posts")}</span>
          </NavLink>
          <NavLink
            to="media-assets"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <PictureInPicture className={classes.linkIcon} />
            <span>{t("mediaAssets.mediaAssets")}</span>
          </NavLink>
        </Navbar.Section>
      </>
    );
  };

  const ParametersAdminNavigation = () => {
    return (
      <>
        <NavLink to={locationPath(location.pathname)} className={classes.link}>
          <ArrowLeft className={classes.linkIcon} />
          <span>{t("navigation.return")}</span>
        </NavLink>
        <p className={classes.menuName}>{t("navigation.parameterAdmin")}</p>
        <Navbar.Section grow component={ScrollArea}>
          {/* ...link za administraciju parametara*/}
          <NavLink
            to="parameters-administration"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <FileSettings className={classes.linkIcon} />

            <span>{t("parameterAdmin.parameterAdmin")}</span>
          </NavLink>

          <NavLink
            to="general-terms"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Notebook className={classes.linkIcon} />

            <span>{t("generalTerms.generalTerms")}</span>
          </NavLink>

          <NavLink
            to="privacy-policy"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <HandStop className={classes.linkIcon} />

            <span>{t("privacyPolicy.privacyPolicy")}</span>
          </NavLink>
          <NavLink
            to="about-us"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Accessible className={classes.linkIcon} />

            <span>{t("aboutUs.aboutUs")}</span>
          </NavLink>

          <NavLink
            to="order-terms-and-conditions"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <File className={classes.linkIcon} />

            <span>{t("orderTermsAndConditions.orderTermsAndConditions")}</span>
          </NavLink>
        </Navbar.Section>
      </>
    );
  };

  const OrdersNavigation = () => {
    return (
      <>
        <NavLink to={locationPath(location.pathname)} className={classes.link}>
          <ArrowLeft className={classes.linkIcon} />
          <span>{t("navigation.return")}</span>
        </NavLink>
        <p className={classes.menuName}>{t("navigation.ordersMenu")}</p>
        <Navbar.Section grow component={ScrollArea}>
          <NavLink
            to="orders-administration"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <PackgeExport className={classes.linkIcon} />
            <span>{t("orders.orders")}</span>
          </NavLink>
        </Navbar.Section>
      </>
    );
  };

  const BuybackNavigation = () => {
    return (
      <>
        <NavLink to={locationPath(location.pathname)} className={classes.link}>
          <ArrowLeft className={classes.linkIcon} />
          <span>{t("navigation.return")}</span>
        </NavLink>
        <p className={classes.menuName}>{t("navigation.navigationMenu")}</p>
        <Navbar.Section grow component={ScrollArea}>
          <NavLink
            to="requests"
            className={({ isActive }) =>
              isActive ? classes.linkActive : classes.link
            }
          >
            <Wallet className={classes.linkIcon} />
            <span>{t("buyback.buybackRequests")}</span>
          </NavLink>
        </Navbar.Section>
      </>
    );
  };

  return (
    <>
      <Navbar
        width={{
          base: 350,
        }}
        p="md"
        className={classes.navbar}
      >
        <Navbar.Section className={classes.header}>
          <NavLink to="/">
            {" "}
            <Group position="left">
              <img src={images.header} alt="logo" className={classes.logo} />
            </Group>
          </NavLink>
        </Navbar.Section>
        <Routes>
          <Route path="/" index element={<RootNavigation />} />
          <Route path="faq/*" element={<FAQNavigation />}></Route>
          <Route path="codebook/*" element={<CodebookNavigation />}></Route>
          <Route path="products/*" element={<ProductsNavigation />}></Route>
          <Route path="users/*" element={<UsersNavigation />}></Route>
          <Route path="blog/*" element={<BlogNavigation />}></Route>
          <Route
            path="parameters/*"
            element={<ParametersAdminNavigation />}
          ></Route>
          <Route path="orders/*" element={<OrdersNavigation />}></Route>
          <Route path="buyback/*" element={<BuybackNavigation />}></Route>
        </Routes>
        <Navbar.Section>
          <a
            href="#"
            className={classes.link}
            onClick={async () => {
              await keycloak.logout();
              dispatch(clearIdentity());
            }}
          >
            <Logout className={classes.linkIcon} />
            <span>{t("rootNavigation.logout")}</span>
          </a>
        </Navbar.Section>
      </Navbar>
    </>
  );
};

export default Navigation;
