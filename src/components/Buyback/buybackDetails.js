import {
  LoadingOverlay,
  Grid,
  TextInput,
  createStyles,
  Modal,
  Group,
  Button,
} from "@mantine/core";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import CustomLoader from "../common/CustomLoader";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import BuybackUpdates from "./buybackUpdates";
import { Pencil } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  spacer: {
    height: "91px",
  },

  input: {
    height: "auto",
    paddingTop: 18,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
  tableIconsButton: {
    padding: "0px",
    "&:hover": {
      backgroundColor: theme.colors.colorGray,
    },
  },
  tableIconsLogo: {
    color: theme.colors.colorDarkGray,
    "&:hover": {
      color: theme.colors.colorBlack,
    },
  },
}));

const BuybackDetails = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

  const buybackDetails =
    useSelector((state) => state?.buyback?.buybackByIdData) || [];

  const loadingDetails = useSelector((state) => state?.buyback?.status);

  const goldSilverDetails = {
    customerFamilyName: !!buybackDetails?.customerName?.customerFamilyName
      ? buybackDetails?.customerName?.customerFamilyName
      : "",
    customerGivenName: !!buybackDetails?.customerName?.customerGivenName
      ? buybackDetails?.customerName?.customerGivenName
      : "",
    customerBusinessName: !!buybackDetails?.customerName?.customerBusinessName
      ? buybackDetails?.customerName?.customerBusinessName
      : "",

    createdAt: !!buybackDetails?.appraisal?.createdAt
      ? dayjs(buybackDetails?.appraisal?.createdAt).format("DD.MM.YYYY")
      : "",
    acceptedAt: !!buybackDetails?.appraisal?.acceptedAt
      ? dayjs(buybackDetails?.appraisal?.acceptedAt).format("DD.MM.YYYY")
      : "",
    rejectedAt: !!buybackDetails?.appraisal?.rejectedAt
      ? dayjs(buybackDetails?.appraisal?.rejectedAt).format("DD.MM.YYYY")
      : "",
    amount: !!buybackDetails?.appraisal?.amount
      ? buybackDetails?.appraisal?.amount
      : "",
    currency: !!buybackDetails?.appraisal?.currency
      ? buybackDetails?.appraisal?.currency
      : "",
    status: !!buybackDetails?.status ? buybackDetails?.status : "",
    countryCode: !!buybackDetails?.delivery?.deliveryKit?.deliveryAddress
      ?.countryCode
      ? buybackDetails?.delivery?.deliveryKit?.deliveryAddress?.countryCode
      : "",
    postalCode: !!buybackDetails?.delivery?.deliveryKit?.deliveryAddress
      ?.postalCode
      ? buybackDetails?.delivery?.deliveryKit?.deliveryAddress?.postalCode
      : "",
    place: !!buybackDetails?.delivery?.deliveryKit?.deliveryAddress?.place
      ? buybackDetails?.delivery?.deliveryKit?.deliveryAddress?.place
      : "",

    street: !!buybackDetails?.delivery?.deliveryKit?.deliveryAddress?.street
      ? buybackDetails?.delivery?.deliveryKit?.deliveryAddress?.street
      : "",
    houseNumber: !!buybackDetails?.delivery?.deliveryKit?.deliveryAddress
      ?.houseNumber
      ? buybackDetails?.delivery?.deliveryKit?.deliveryAddress?.houseNumber
      : "",
    personalDelivery: !!buybackDetails?.delivery?.personalDelivery
      ? buybackDetails?.delivery?.personalDelivery
      : "",
    deliveryMethod: !!buybackDetails?.delivery?.productDeliveryMethod
      ? buybackDetails?.delivery?.productDeliveryMethod
      : "",

    manufacturer: !!buybackDetails?.manufacturer?.name
      ? buybackDetails?.manufacturer?.name
      : "",
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="auto"
        centered
        withCloseButton={false}
      >
        <BuybackUpdates />
      </Modal>

      <Group position="right" className={classes.buttonContainer}>
        <Button
          className={classes.tableIconsButton}
          variant="subtle"
          onClick={() => setOpened(true)}
        >
          <Pencil className={classes.tableIconsLogo} />
        </Button>
      </Group>

      <div className={classes.spacer} />
      <Grid>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.customerName")}
            value={
              goldSilverDetails.customerGivenName +
              " " +
              goldSilverDetails.customerFamilyName
            }
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.customerBusinessName")}
            value={goldSilverDetails.customerBusinessName}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.createdAt")}
            value={goldSilverDetails?.createdAt}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.acceptedAt")}
            value={goldSilverDetails?.acceptedAt}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.rejectedAt")}
            value={goldSilverDetails?.rejectedAt}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.amount")}
            value={goldSilverDetails.amount}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.currency")}
            value={goldSilverDetails.currency}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.status")}
            value={goldSilverDetails.status}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.countryCode")}
            value={goldSilverDetails.countryCode}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.postalCode")}
            value={goldSilverDetails.postalCode}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.place")}
            value={goldSilverDetails.place}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.address")}
            value={
              goldSilverDetails.street + " " + goldSilverDetails.houseNumber
            }
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.personalDelivery")}
            value={goldSilverDetails.personalDelivery}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.deliveryMethod")}
            value={goldSilverDetails.deliveryMethod}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            classNames={classes}
            readOnly
            label={t("buybackDetails.manufacturer")}
            value={goldSilverDetails.manufacturer}
          />
        </Grid.Col>
      </Grid>

      {loadingDetails === "pending" && (
        <LoadingOverlay loader={CustomLoader()} visible />
      )}
    </>
  );
};
export default BuybackDetails;
