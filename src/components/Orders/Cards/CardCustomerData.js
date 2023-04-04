import { Box, createStyles, Divider, Text, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

const useStyles = createStyles((theme) => ({
  mainContainer: {
    width: "25vw",
    height: "auto",
    borderRadius: 12,
    borderStyle: "outset",
    display: "flex",
    flexDirection: "column",
    //justifyContent: "space-evenly",
    padding: 20,
    border: "1px solid #c9c9c9",
  },
}));

export const CardCustomerData = (props) => {
  const {
    givenName,
    familyName,
    street,
    postalCode,
    place,
    countryCode,
    houseNumber,
    emailAddress,
  } = props;

  const { t } = useTranslation();
  const { classes } = useStyles();
  return (
    <>
       <Box className={classes.mainContainer}>
       
        <Title order={5} align={"center"}>
          {t("cardCustomerData.title")}
        </Title>
        <Divider size={"md"} />
        <Box style={{ display: "flex" }}>
          <Text style={{ paddingRight: 10 }} weight={600}>
          {t("cardCustomerData.givenName")}
          </Text>
          {givenName}
        </Box>

        <Box style={{ display: "flex" }}>
          <Text style={{ paddingRight: 10 }} weight={600}>
          {t("cardCustomerData.familyName")}
          </Text>
          {familyName}
        </Box>

        <Box style={{ display: "flex" }}>
          <Text style={{ paddingRight: 10 }} weight={600}>
          {t("cardCustomerData.street")}
          </Text>
          {street}
        </Box>

        <Box style={{ display: "flex" }}>
          <Text style={{ paddingRight: 10 }} weight={600}>
          {t("cardCustomerData.postalCode")}
          </Text>
          {postalCode}
        </Box>

        <Box style={{ display: "flex" }}>
          <Text style={{ paddingRight: 10 }} weight={600}>
          {t("cardCustomerData.place")}
          </Text>
          {place}
        </Box>

        <Box style={{ display: "flex" }}>
          <Text style={{ paddingRight: 10 }} weight={600}>
          {t("cardCustomerData.countryCode")}
          </Text>
          {countryCode}
        </Box>

        <Box style={{ display: "flex" }}>
          <Text style={{ paddingRight: 10 }} weight={600}>
          {t("cardCustomerData.houseNumber")}
          </Text>
          {houseNumber}
        </Box>

        <Box style={{ display: "flex" }}>
          <Text style={{ paddingRight: 10 }} weight={600}>
          {t("cardCustomerData.emailAddress")}
          </Text>
          {emailAddress}
        </Box>
      </Box>
    </>
  );
};
