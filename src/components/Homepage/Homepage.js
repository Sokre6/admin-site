import { createStyles, SimpleGrid } from "@mantine/core";
import images from "../../assets/images";
import {
  ZoomQuestion,
  FileText,
  Users,
  Barcode,
  Article,
  Settings,
  Ship,
  Wallet,
} from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchLanguagesDataThunk } from "../../store/slices/language";

import { fetchCountriesDataThunk } from "../../store/slices/countries";

const useStyles = createStyles((theme) => ({
  homepageContainer: {
    width: " 100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: "10vh",
  },
  buttonStyle: {
    width: "150px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: theme.colors.colorLightGray,
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: theme.colors.colorGray,
      cursor: "pointer",
    },
  },
  imgText: {
    paddingTop: "20vh",
    paddingBottom: "15vh",
    "@media (max-width: 1300px)": {
      paddingTop: "5vh",
    },
  },
  imgLogo: {
    paddingTop: "27.5vh",
    "@media (min-width: 800px)": {
      position: "fixed",
      bottom: 5,
    },
  },
  linkIcon: {
    color: theme.colors.colorBlack,
    width: "100px",
    height: "100px",
    padding: "15px",
  },
  iconText: {
    fontWeight: "bold",
    padding: "5px",
  },
}));

const Homepage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRoles = useSelector((state) => state.roles.userRoles);

  useEffect(() => {
    dispatch(fetchLanguagesDataThunk());
    dispatch(fetchCountriesDataThunk());
  }, []);

  return (
    <div className={classes.homepageContainer}>
      <img src={images.welcomeNote} alt="logo" className={classes.imgText} />
      <div className={classes.buttonsContainer}>
        <SimpleGrid
          breakpoints={[
            {
              minWidth: 1300,
              cols: 6,
              spacing: "md",
            },

            {
              maxWidth: 1300,
              cols: 4,
              spacing: "md",
            },
          ]}
        >
          {userRoles.includes("FAQ_ADMIN") && (
            <div
              className={classes.buttonStyle}
              onClick={() => {
                navigate("/faq/questions");
              }}
            >
              <ZoomQuestion className={classes.linkIcon} />
              <span className={classes.iconText}>
                {t("rootNavigation.faq")}
              </span>
            </div>
          )}
          {userRoles.includes("CODEBOOK_ADMIN") && (
            <div
              className={classes.buttonStyle}
              onClick={() => {
                navigate("/codebook/language");
              }}
            >
              <FileText className={classes.linkIcon} />
              <span className={classes.iconText}>
                {t("rootNavigation.codebook")}
              </span>
            </div>
          )}
          {userRoles.includes("USER_ADMIN") && (
            <div
              className={classes.buttonStyle}
              onClick={() => {
                navigate("/users/user-admin-accounts");
              }}
            >
              <Users className={classes.linkIcon} />
              <span className={classes.iconText}>
                {t("rootNavigation.users")}
              </span>
            </div>
          )}
          {userRoles.includes("PRODUCT_ADMIN") && (
            <div
              className={classes.buttonStyle}
              onClick={() => {
                navigate("/products/product");
              }}
            >
              <Barcode className={classes.linkIcon} />
              <span className={classes.iconText}>
                {t("rootNavigation.products")}
              </span>
            </div>
          )}
          {userRoles.includes("BLOG_ADMIN") && (
            <div
              className={classes.buttonStyle}
              onClick={() => {
                navigate("/blog/blogs");
              }}
            >
              <Article className={classes.linkIcon} />
              <span className={classes.iconText}>
                {t("rootNavigation.blog")}
              </span>
            </div>
          )}
          {userRoles.includes("PARAMS_ADMIN") && (
            <div
              className={classes.buttonStyle}
              onClick={() => {
                navigate("parameters/parameters-administration");
              }}
            >
              <Settings className={classes.linkIcon} />
              <span className={classes.iconText}>
                {t("rootNavigation.parametersAdmin")}
              </span>
            </div>
          )}
          {userRoles.includes("ORDER_ADMIN") && (
            <div
              className={classes.buttonStyle}
              onClick={() => {
                navigate("orders/orders-administration");
              }}
            >
              <Ship className={classes.linkIcon} />
              <span className={classes.iconText}>
                {t("rootNavigation.orders")}
              </span>
            </div>
          )}
          {userRoles.includes("BUYBACK_ADMIN") && (
            <div
              className={classes.buttonStyle}
              onClick={() => {
                navigate("buyback/requests");
              }}
            >
              <Wallet className={classes.linkIcon} />
              <span className={classes.iconText}>
                {t("rootNavigation.buyback")}
              </span>
            </div>
          )}
        </SimpleGrid>
      </div>

      <img src={images.homepageLogo} alt="logo" className={classes.imgLogo} />
    </div>
  );
};

export default Homepage;
