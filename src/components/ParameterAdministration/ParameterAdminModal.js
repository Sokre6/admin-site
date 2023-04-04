import { Button, createStyles, Modal, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { showNotification } from "@mantine/notifications";
import {
  fetchParametersAdministrationThunk,
  updateParametersAdministrationThunk,
} from "../../store/slices/parametersAdministration";

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

const ParameterAdminModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const { opened, onClose, isUpdate, updateData } = props;

  const schema = Yup.object().shape({
    value: Yup.string()
      .required(t("parameterAdminModal.valueValidation"))
      .min(1, t("parameterAdminModal.valueMinValidation"))
      .max(256, t("parameterAdminModa.valueLengthValidation"))
      .trim(t("parameterAdminModal.valueWhitespaceValidation"))
      .strict(true)
  });

  const form = useForm({
    initialValues: {
      key: "",
      value: "",
    },
    schema: yupResolver(schema),
  });

  const submitForm = async (data) => {
    await dispatch(updateParametersAdministrationThunk(data))
      .unwrap()
      .then(() => {
        form.reset();
        onClose();
        showNotification({
          message: t("parameterAdminModal.updateSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("parameterAdminModal.updateFailed"),
          color: "red",
        });
      });
    await dispatch(fetchParametersAdministrationThunk());
  };

  useEffect(() => {
    form.clearErrors();
    form.reset();
    if (isUpdate) {
      form.setValues({
        key: updateData.key,
        value: updateData.value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);

  return (
    <Modal
      closeOnClickOutside={false}
      centered
      opened={opened}
      onClose={() => {
        onClose();
      }}
      title={t("parameterAdminModal.modalTitle")}
      sx={(theme) => ({
        ".mantine-Modal-title": {
          fontWeight: "bold",
        },
      })}
    >
      <form onSubmit={form.onSubmit(submitForm)}>
        <TextInput
          readOnly
          label={t("parameterAdminModal.nameInputTitle")}
          placeholder={t("parameterAdminModal.nameInputPlaceholder")}
          classNames={classes}
          {...form.getInputProps("key")}
        />

        <TextInput
          label={t("parameterAdminModal.valueInputTitle")}
          placeholder={t("parameterAdminModal.valueInputPlaceholder")}
          classNames={classes}
          {...form.getInputProps("value")}
        />

        <div className={classes.buttonContainer}>
          <Button type="submit" className={classes.insertButton}>
            {t("modalCommon.saveButton")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ParameterAdminModal;
