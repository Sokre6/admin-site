import { useForm, yupResolver } from "@mantine/form";
import { createStyles, Modal, Button, TextInput, Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { languages } from "../LanguageCodebook/languages";
import {
  fetchDeliveryMethodByIdThunk,
  updateDeliveryMethodThunk,
} from "../../store/slices/deliveryMethod";
import { showNotification } from "@mantine/notifications";
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

const DeliveryLocalizationModal = ({
  opened,
  onClose,
  updateData,
  isUpdate,
}) => {

  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const deliveryMethodData = useSelector(
    (state) => state.deliveryMethod.deliveryMethodData
  );
  const languageData = useSelector((state) => state.language.tableData);
  const schema = Yup.object().shape({
    value: Yup.string()
      .trim(t("deliveryMethodLocalizationModal.whitespaceValidation"))
      .strict(true)
      .required(t("deliveryMethodLocalizationModal.required"))
      .min(1, t("deliveryMethodLocalizationModal.nameValidation"))
      .max(255, t("deliveryMethodLocalizationModal.nameLength")),
    lang: Yup.string().min(
      2,
      t("deliveryMethodLocalizationModal.codeValidation")
    ),
  });
  const form = useForm({
    initialValues: {
      value: "",
      lang: "",
    },
    schema: yupResolver(schema),
  });
  const parseLanguage = (languages) => {
    var langs = deliveryMethodData.names.map(({ lang }) => {
      return lang;
    });
    var mappedLanguage = languages.map(({ code }) => {
      return code;
    });
    var filteredLanguage = mappedLanguage.filter(
      (item) => !langs.includes(item)
    );
    return parseLanguageNames(languages, filteredLanguage);
  };

  const submitForm = async (data) => {
    var updateData = [];
    if (isUpdate) {
      updateData = deliveryMethodData.names.filter(
        (item) => item.lang !== data.lang
      );
      updateData = [...updateData, data];
      await dispatch(
        updateDeliveryMethodThunk({
          id: deliveryMethodData.id,
          names: updateData,
        })
      )
        .unwrap()
        .then((response) => {
          showNotification({
            message: t("deliveryMethodLocalizationModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("deliveryMethodLocalizationModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      updateData = [...deliveryMethodData.names, data];
      await dispatch(
        updateDeliveryMethodThunk({
          id: deliveryMethodData.id,
          names: updateData,
        })
      )
        .unwrap()
        .then((response) => {
          showNotification({
            message: t("deliveryMethodLocalizationModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("deliveryMethodLocalizationModal.insertFailed"),
            color: "red",
          });
        });
    }
    await dispatch(fetchDeliveryMethodByIdThunk(deliveryMethodData.id));
    form.reset();
    onClose();
  };
  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        value: updateData.value,
        lang: updateData.lang,
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
        title={t("deliveryMethodLocalizationModal.modalTitle")}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("deliveryMethodLocalizationModal.name")}
            placeholder={t(
              "deliveryMethodLocalizationModal.nameInputPlaceholder"
            )}
            classNames={classes}
            {...form.getInputProps("value")}
          />

          <Select
            disabled={isUpdate}
            style={{ marginTop: 20, zIndex: 2 }}
            data={parseLanguage(languageData)}
            label={t("deliveryMethodLocalizationModal.locale")}
            placeholder={t(
              "deliveryMethodLocalizationModal.localeInputPlaceholder"
            )}
            classNames={classes}
            searchable
            {...form.getInputProps("lang", { type: "select" })}
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

export default DeliveryLocalizationModal;
