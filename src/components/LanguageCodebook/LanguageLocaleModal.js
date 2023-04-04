import { useForm, yupResolver } from "@mantine/form";
import { createStyles, Modal, Button, TextInput, Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import { languages } from "./languages";
import {
  fetchLanguageByCodeThunk,
  updateLanguageThunk,
} from "../../store/slices/language";
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
    marginTop: 20,
    zIndex: 2,
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

const LanguageLocaleModal = ({
  opened,
  onClose,
  updateData,
  isUpdate,
  modalData,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const languageData = useSelector((state) => state.language.languageData);

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("languageModal.whitespaceValidation"))
      .strict(true)
      .required(t("languageModal.questionValidation"))
      .min(1, t("languageModal.nameValidation"))
      .max(255, t("languageModal.stringLenghtValidation")),
    locale: Yup.string().min(2, t("languageModal.codeValidation")),
  });
  const form = useForm({
    initialValues: {
      name: "",
      locale: "",
    },
    schema: yupResolver(schema),
  });

  const parseLanguage = (languages) => {
    var locales = languageData.names.map(({ locale }) => {
      return locale;
    });

    var mappedLanguage = languages.map(({ code }) => {
      return code;
    });
    var filteredLanguage = mappedLanguage.filter(
      (item) => !locales.includes(item)
    );

    const arr = [];
    languages.forEach((languageCode) => {
      filteredLanguage.forEach((languageCodeFiltered) => {
        if (languageCode.code === languageCodeFiltered) {
          return arr.push({
            value: languageCode.code,
            label: languageCode.name,
          });
        }
      });
    });

   

    return arr;
  };
  const submitForm = async (data) => {
    var updateObject = [];
    if (isUpdate) {
      var updateData = modalData.names.filter(
        (item) => item.locale !== data.locale
      );
      updateData = [...updateData, data];
      updateObject = prepareUpdateObject(updateData);
      await dispatch(updateLanguageThunk(updateObject))
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
      await dispatch(updateLanguageThunk(updateObject))
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
    await dispatch(fetchLanguageByCodeThunk(updateObject.code));
  };

  const prepareUpdateObject = (data) => {
    
    var object = {
      code: modalData.code,
      names: data,
      activity:modalData.activity
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
        onClose={() => {
          form.reset();
          onClose();
        }}
        title={t("currencyLocaleModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
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
            data={parseLanguage(languages)}
            label={t("currencyLocaleModal.locale")}
            placeholder={t("currencyModal.codeInputPlaceholder")}
            classNames={classes}
            searchable
            {...form.getInputProps("locale", { type: "select" })}
          />
          <div className={classes.buttonContainer}>
            <Button
              sx={{ paddingRight: 12 }}
              type="submit"
              className={classes.insertButton}
            >
              {t("modalCommon.saveButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default LanguageLocaleModal;
