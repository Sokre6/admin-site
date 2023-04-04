import { useForm, yupResolver } from "@mantine/form";
import { createStyles, Modal, Button, TextInput, Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import { languages } from "../LanguageCodebook/languages";
import {
  fetchQuestionCategoryByCodeThunk,
  updateQuestionCategoryThunk,
} from "../../store/slices/questionCategory";
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
}));

const QuestionCategoryTableLocalizationModal = ({
  opened,
  onClose,
  updateData,
  isUpdate,
  modalData,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const questionCategoryData = useSelector(
    (state) => state.questionCategory.questionCategoryData
  );
  const languageData = useSelector((state) => state.language.tableData);

  const schema = Yup.object().shape({
    value: Yup.string()
      .trim(t("questionCategoryLocalizationModal.whitespaceValidation"))
      .strict(true)
      .required(t("questionCategoryLocalizationModal.nameValidation"))
      .min(1, t("questionCategoryLocalizationModal.nameValidation"))
      .max(255, t("questionCategoryLocalizationModal.stringLenghtValidation")),
    locale: Yup.string().min(
      2,
      t("questionCategoryLocalizationModal.localeValidation")
    ),
  });
  const form = useForm({
    initialValues: {
      value: "",
      locale: "",
    },
    schema: yupResolver(schema),
  });
  const parseLanguage = (languages) => {
    var locales = questionCategoryData.names.map(({ locale }) => {
      return locale;
    });
    var mappedLanguage = languages.map(({ code }) => {
      return code;
    });
    var filteredLanguage = mappedLanguage.filter(
      (item) => !locales.includes(item)
    );
    
    return parseLanguageNames(languages,filteredLanguage);
  };
  const prepareUpdateObject = (data) => {
    var object = {
      names: data,
      ordinalNumber: modalData.ordinalNumber,
      active: data.active ? "ACTIVE" : "INACTIVE",
    };
    return object;
  };
  const submitForm = async (data) => {
    var dataForUpdate = [];
    var updateData = [];
    if (isUpdate) {
      var filteredData = modalData.names.filter(
        (item) => item.locale !== data.locale
      );
      updateData = modalData;
      dataForUpdate = prepareUpdateObject([...filteredData, data]);
      await dispatch(updateQuestionCategoryThunk({ updateData, dataForUpdate }))
        .unwrap()
        .then(() => {
          showNotification({
            message: t("questionCategoryLocalizationModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("questionCategoryLocalizationModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      dataForUpdate = prepareUpdateObject([...modalData.names, data]);
      updateData = modalData;
      await dispatch(updateQuestionCategoryThunk({ updateData, dataForUpdate }))
        .unwrap()
        .then(() => {
          showNotification({
            message: t("questionCategoryLocalizationModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("questionCategoryLocalizationModal.insertFailed"),
            color: "red",
          });
        });
    }
    await dispatch(fetchQuestionCategoryByCodeThunk(modalData.id));
    form.reset();
    onClose();
  };

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        value: updateData.value,
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
        title={t("questionCategoryLocalizationModal.title")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("questionCategoryLocalizationModal.name")}
            placeholder={t(
              "questionCategoryLocalizationModal.nameInputPlaceholder"
            )}
            classNames={classes}
            {...form.getInputProps("value")}
          />

          <Select
            disabled={isUpdate}
            style={{ marginTop: 20, zIndex: 2 }}
            data={parseLanguage(languageData)}
            label={t("questionCategoryLocalizationModal.locale")}
            placeholder={t(
              "questionCategoryLocalizationModal.localeInputPlaceholder"
            )}
            //nothingFound={t("modalCommon.nothingFound")}
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

export default QuestionCategoryTableLocalizationModal;
