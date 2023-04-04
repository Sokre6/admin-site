import { useForm } from "@mantine/form";
import { createStyles, Modal, Button, TextInput } from "@mantine/core";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { DatePicker } from "@mantine/dates";
import { createPaymentsConfirmThunk } from "../../store/slices/payments";

const useStyles = createStyles((theme) => ({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: `${theme.spacing.xs}px `,
  },
  root: {
    position: "relative",
    marginTop: 20,
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

  insertButton: {
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
}));

const PaymentUpdateModal = (props) => {
  const { orderId, source, show, onClose } = props;
  const { classes } = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      orderId,
      source,
      confirmedAt: new Date(),
      transactionDate: new Date(),
      confirmedBy: "",
      transactionRef: "",
    },
  });

  const submitForm = async (data) => {
    setIsLoading(true);
    await dispatch(createPaymentsConfirmThunk(data))
      .unwrap()
      .then(() => {
        form.reset();
        onClose();
        showNotification({
          message: t("paymentUpdateModal.updateSuccessfully"),
          color: "green",
        });
      })
      .catch(() => {
        showNotification({
          message: t("paymentUpdateModal.updateFailed"),
          color: "red",
        });
      });

    setIsLoading(false);
  };

  return (
    <>
      <Modal
        closeOnClickOutside={false}
        centered
        opened={show}
        onClose={() => {
          form.reset();
          onClose();
        }}
        title={t("paymentUpdateModal.modalTitle")}
        sx={() => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <DatePicker
            defaultValue={new Date()}
            clearable
            classNames={classes}
            inputFormat="DD.MM.YYYY"
            label={t("paymentUpdateModal.confirmedAt")}
            {...form.getInputProps("confirmedAt")}
          />
          <DatePicker
            defaultValue={new Date()}
            clearable
            classNames={classes}
            inputFormat="DD.MM.YYYY"
            label={t("paymentUpdateModal.transactionDate")}
            {...form.getInputProps("transactionDate")}
          />

          <TextInput
            label={t("paymentUpdateModal.confirmedBy")}
            placeholder={t("paymentUpdateModal.confirmedBy")}
            classNames={classes}
            {...form.getInputProps("confirmedBy")}
          />
          <TextInput
            label={t("paymentUpdateModal.transactionRef")}
            placeholder={t("paymentUpdateModal.transactionRef")}
            classNames={classes}
            {...form.getInputProps("transactionRef")}
          />

          <div className={classes.buttonContainer}>
            <Button
              type="submit"
              className={classes.insertButton}
              loading={isLoading}
            >
              {t("paymentUpdateModal.saveButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PaymentUpdateModal;
