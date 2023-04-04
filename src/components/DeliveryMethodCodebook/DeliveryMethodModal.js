import { useForm, yupResolver } from "@mantine/form";
import { createStyles, Modal, Button, TextInput } from "@mantine/core";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import {
  fetchDeliveryMethodByIdThunk,
  fetchDeliveryMethodDataThunk,
  updateDeliveryMethodThunk,
} from "../../store/slices/deliveryMethod";

const useStyles = createStyles((theme) => ({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: `${theme.spacing.xs}px `,
  },
  root: {
    position: "relative",
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
  modalTitle: {
    fontWeight: "bold",
  },
}));

const DeliveryMethodModal = ({ opened, onClose, updateData, isUpdate }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("deliveryMethodModal.whitespaceValidation"))
      .strict(true)
      .required(t("deliveryMethodModal.required"))
      .min(1, t("deliveryMethodModal.nameValidation"))
      .max(255, t("deliveryMethodModal.nameLength")),
  });
  const form = useForm({
    initialValues: {
      name: "",
    },
    schema: yupResolver(schema),
  });

  const submitForm = async (data) => {
    if (isUpdate) {
      var updateItem = [];
      await dispatch(fetchDeliveryMethodByIdThunk(updateData.id))
        .unwrap()
        .then((response) => {
          updateItem = response;
        })
        .catch((e) => {
          showNotification({
            message: t("deliveryMethodModal.updateFailed"),
            color: "red",
          });
        });
    }
    var updateObject = updateItem.names.filter((item) => item.lang !== "en");
    updateObject = [...updateObject, { lang: "en", value: data.name }];
    await dispatch(
      updateDeliveryMethodThunk({ id: updateData.id, names: updateObject })
    )
      .unwrap()
      .then((response) => {
        showNotification({
          message: t("deliveryMethodModal.updateSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("deliveryMethodModal.updateFailed"),
          color: "red",
        });
      });
    await dispatch(fetchDeliveryMethodDataThunk());
    form.reset();
    onClose();
  };
  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        name: updateData.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);
  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => {
          form.reset();
          onClose();
        }}
        title={t("deliveryMethodModal.modalTitle")}
        classNames={{ title: classes.modalTitle }}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("deliveryMethodModal.name")}
            placeholder={t("deliveryMethodModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("name")}
          />
          <div className={classes.buttonContainer}>
            <Button type="submit" className={classes.insertButton}>
              {t("modalCommon.saveButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DeliveryMethodModal;
