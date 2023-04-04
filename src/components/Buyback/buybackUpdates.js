import {
  Button,
  createStyles,
  Grid,
  Group,
  Modal,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelBuybackThunk,
  completeBuybackThunk,
  updateBuybackAppraisalThunk,
  updateBuybackTrackingThunk,
} from "../../store/slices/buyback";

const useStyles = createStyles((theme) => ({
  insertButton: {
    right: 10,
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
    color: theme.colors.colorWhite,
    marginLeft: 20,
  },
}));

const BuybackUpdates = () => {
  const dispatch = useDispatch();
  const [openedTracking, setOpenedTracking] = useState(false);
  const [openedAppraisal, setOpenedAppraisal] = useState(false);
  const [openedComplete, setOpenedComplete] = useState(false);
  const [openedCancel, setOpenedCancel] = useState(false);
  const { t } = useTranslation();
  const { classes } = useStyles();

  const buybackId = useSelector((state) => state?.buyback?.buybackId);

  const buybackDetails =
    useSelector((state) => state?.buyback?.buybackByIdData) || [];

  console.table("BUYBACK ID------------------->", buybackDetails);

  const form = useForm({
    initialValues: {
      trackingNumber: "",
      courierCode: "",
      appraisalAmount: "",
      appraisalCurrency: "",
    },
  });

  const cancelData = {
    note: !!buybackDetails?.userNote ? buybackDetails?.userNote : "",
  };

  const completeData = {
    note: !!buybackDetails?.userNote ? buybackDetails?.userNote : "",
  };

  const updateTrackingData = {
    trackingNumber: !!form?.values?.trackingNumber
      ? form?.values?.trackingNumber
      : "",
    courierCode:
      form?.values?.courierCode === "hp"
        ? "HP"
        : form?.values?.courierCode &&
          form?.values?.courierCode === "mail boxes"
        ? "MAIL_BOXES"
        : form?.values?.courierCode,
  };

  const updateAppraisalData = {
    amount: !!form?.values?.appraisalAmount
      ? form?.values?.appraisalAmount
      : "",
    currency:
      form?.values?.appraisalCurrency === "eur"
        ? "EUR"
        : form?.values?.appraisalCurrency,
  };

  const submitTrackingForm = async (data) => {
    try {
      await dispatch(
        updateBuybackTrackingThunk({
          id: buybackId,
          data: updateTrackingData,
        })
      ).unwrap();
      showNotification({
        message: "Tracking information successfully updated",
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Unexpected error",
        message: "There has been an unexpected error",
        color: "red",
      });
    }

    setOpenedTracking(false);
  };

  const submitAppraisalForm = async (data) => {
    try {
      await dispatch(
        updateBuybackAppraisalThunk({
          id: buybackId,
          data: updateAppraisalData,
        })
      ).unwrap();
      showNotification({
        message: "Appraisal information successfully updated",
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Unexpected error",
        message: "There has been an unexpected error",
        color: "red",
      });
    }
    setOpenedAppraisal(false);
  };

  return (
    <>
      <Grid>
        <Grid.Col md={4} lg={3}>
          <Button
            variant="subtle"
            onClick={() => setOpenedComplete(true)}
            className={classes.insertButton}
          >
            {t("buybackUpdates.complete")}
          </Button>
        </Grid.Col>
        <Grid.Col md={4} lg={3}>
          <Button
            variant="subtle"
            onClick={() => setOpenedCancel(true)}
            className={classes.insertButton}
          >
            {t("buybackUpdates.cancel")}
          </Button>
        </Grid.Col>

        <Grid.Col md={4} lg={3}>
          <Button
            variant="subtle"
            onClick={() => setOpenedTracking(true)}
            className={classes.insertButton}
          >
            {t("buybackUpdates.tracking")}
          </Button>
        </Grid.Col>
        <Grid.Col md={4} lg={3}>
          <Button
            variant="subtle"
            onClick={() => setOpenedAppraisal(true)}
            className={classes.insertButton}
          >
            {t("buybackUpdates.appraisal")}
          </Button>
        </Grid.Col>
      </Grid>
      <Modal
        opened={openedTracking}
        onClose={() => setOpenedTracking(false)}
        centered
      >
        <form onSubmit={form.onSubmit(submitTrackingForm)}>
          <TextInput
            required
            label={t("buybackUpdates.trackingLabel1")}
            placeholder={t("buybackUpdates.trackingPlaceholder1")}
            {...form.getInputProps("trackingNumber")}
          />

          <TextInput
            required
            label={t("buybackUpdates.trackingLablel2")}
            placeholder={t("buybackUpdates.trackingPlaceholder2")}
            {...form.getInputProps("courierCode")}
          />

          <Group position="right" mt="md">
            <Button
              disabled={
                form.values.trackingNumber === "" ||
                form.values.courierCode === ""
              }
              type="submit"
              className={classes.insertButton}
            >
              {t("buybackUpdates.trackingButton")}
            </Button>
          </Group>
        </form>
      </Modal>
      <Modal
        opened={openedAppraisal}
        onClose={() => setOpenedAppraisal(false)}
        centered
      >
        <form onSubmit={form.onSubmit(submitAppraisalForm)}>
          <NumberInput
            required
            precision={2}
            min={0}
            label={t("buybackUpdates.appraisalLabel1")}
            placeholder={t("buybackUpdates.appraisalPlaceholder1")}
            {...form.getInputProps("appraisalAmount")}
          />
          <TextInput
            required
            label={t("buybackUpdates.appraisalLabel2")}
            placeholder={t("buybackUpdates.appraisalPlaceholder2")}
            {...form.getInputProps("appraisalCurrency")}
          />
          <Group position="right" mt="md">
            <Button
              disabled={
                form.values.appraisalAmount === "" ||
                form.values.appraisalCurrency === ""
              }
              type="submit"
              className={classes.insertButton}
            >
              {t("buybackUpdates.appraisalButton")}
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal
        opened={openedComplete}
        onClose={() => setOpenedComplete(false)}
        centered
        title={t("buybackUpdates.completeModalTitle")}
      >
        <Group position="center">
          <Button
            onClick={async () => {
              try {
                await dispatch(
                  completeBuybackThunk({
                    id: buybackId,
                    data: completeData,
                  })
                ).unwrap();
                showNotification({
                  message: "Complete successful",
                  color: "green",
                });
              } catch (error) {
                showNotification({
                  title: "Unexpected error",
                  message: "There has been an unexpected error",
                  color: "red",
                });
              }
              setOpenedComplete(false);
            }}
            className={classes.insertButton}
          >
            {t("buybackUpdates.modalButton")}
          </Button>
        </Group>
      </Modal>
      <Modal
        opened={openedCancel}
        onClose={() => setOpenedCancel(false)}
        centered
        title={t("buybackUpdates.cancelModalTitle")}
      >
        <Group position="center">
          <Button
            onClick={async () => {
              try {
                await dispatch(
                  cancelBuybackThunk({
                    id: buybackId,
                    data: cancelData,
                  })
                ).unwrap();
                showNotification({
                  message: "Cancel successful",
                  color: "green",
                });
              } catch (error) {
                showNotification({
                  title: "Unexpected error",
                  message: "There has been an unexpected error",
                  color: "red",
                });
              }
              setOpenedCancel(false);
            }}
            className={classes.insertButton}
          >
            {t("buybackUpdates.modalButton")}
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default BuybackUpdates;
