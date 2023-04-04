import { useForm, yupResolver } from "@mantine/form";
import { createStyles, Modal, Button, TextInput, Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import { languages } from "../LanguageCodebook/languages";
import {
  fetchCurrencyByCodeThunk,
  updateCurrencyThunk,
} from "../../store/slices/currency";
import { parseLanguageNames } from "../common/parseLanguageNames";
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

const CurrencyLocaleModal = ({
  opened,
  onClose,
  updateData,
  isUpdate,
  modalData,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const currencyData = useSelector((state) => state.currency.currencyData);
  const languageData = useSelector((state) => state.language.tableData);
  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("currencyModal.whitespaceValidation"))
      .strict(true)
      .required(t("currencyModal.nameValidation"))
      .min(1, t("currencyModal.nameValidation"))
      .max(255, t("currencyModal.stringLenghtValidation")),
    locale: Yup.string().min(2, t("currencyModal.codeValidation")),
  });
  const form = useForm({
    initialValues: {
      name: "",
      locale: "",
    },
    schema: yupResolver(schema),
  });
  const parseLanguage = (languages) => {
    const locales = currencyData.names.map(({ locale }) => {
      return locale;
    });
    const mappedLanguage = languages.map(({ code }) => {
      return code;
    });
    const filteredLanguage = mappedLanguage.filter(
      (item) => !locales.includes(item)
    );
    return parseLanguageNames(languages, filteredLanguage);
  };
  const submitForm = async (data) => {
    var updateObject = [];
    if (isUpdate) {
      var updateData = modalData.names.filter(
        (item) => item.locale !== data.locale
      );
      updateData = [...updateData, data];
      updateObject = prepareUpdateObject(updateData);
      await dispatch(updateCurrencyThunk(updateObject))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("currencyModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("currencyModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      updateData = [...modalData.names, data];
      updateObject = prepareUpdateObject(updateData);
      await dispatch(updateCurrencyThunk(updateObject))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("currencyModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("currencyModal.insertFailed"),
            color: "red",
          });
        });
    }
    await dispatch(fetchCurrencyByCodeThunk(updateObject.code));
  };

  const prepareUpdateObject = (data) => {
    var object = {
      code: modalData.code,
      names: data,
    };
    return object;
  };

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        name: updateData.name,
        locale: updateData.locale,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);
  return (
    <>
      <Modal
      closeOnClickOutside={false}
        centered
        opened={opened}
        classNames={{ title: classes.modalTitle }}
        onClose={() => {
          form.reset();
          onClose();
        }}
        title={t("currencyLocaleModal.modalTitle")}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("currencyLocaleModal.name")}
            placeholder={t("currencyModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("name")}
          />

          <Select
            disabled={isUpdate}
            style={{ marginTop: 20, zIndex: 2 }}
            data={parseLanguage(languageData)}
            label={t("currencyLocaleModal.locale")}
            placeholder={t("currencyModal.codeInputPlaceholder")}
            classNames={classes}
            searchable
            {...form.getInputProps("locale", { type: "select" })}
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
export default CurrencyLocaleModal;
