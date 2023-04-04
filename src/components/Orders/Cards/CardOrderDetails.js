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
    padding: 20,
    border: "1px solid #c9c9c9",
  },
}));

export const CardOrderDetails = (props) => {
  const { classes } = useStyles();

  const {
    orderNumber,
    createdAt,
    paymentMethod,
    deliveryMethod,
    totalAmount,
  } = props;

  const { t } = useTranslation();

  return (
    <>
      <Box className={classes.mainContainer}>
        <Title order={5} align={"center"}>
          {t("cardOrderDetails.title")}
        </Title>
        <Divider size={"md"} />
        <Box style={{ display: "flex" }}>
          {" "}
          <Text style={{ paddingRight: 10 }} weight={600}>
            {t("cardOrderDetails.orderNumber")}
          </Text>
          {orderNumber}
        </Box>

        <Box style={{ display: "flex" }}>
          {" "}
          <Text style={{ paddingRight: 10 }} weight={600}>
            {t("cardOrderDetails.createdAt")}
          </Text>
          {createdAt}
        </Box>

        <Box style={{ display: "flex" }}>
          {" "}
          <Text style={{ paddingRight: 10 }} weight={600}>
            {t("cardOrderDetails.paymentMethodCode")}
          </Text>
          {paymentMethod}
        </Box>

        <Box style={{ display: "flex" }}>
          {" "}
          <Text style={{ paddingRight: 10 }} weight={600}>
            {t("cardOrderDetails.deliveryMethodCode")}
          </Text>
          {deliveryMethod}
        </Box>

        <Box style={{ display: "flex" }}>
          {" "}
          <Text style={{ paddingRight: 10 }} weight={600}>
            {t("cardOrderDetails.totalAmount")}
          </Text>
          {totalAmount}
        </Box>
      </Box>
    </>
  );
};
