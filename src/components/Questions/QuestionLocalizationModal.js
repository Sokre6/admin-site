import { useForm, yupResolver } from "@mantine/form";
import { createStyles, Modal, Button, TextInput, Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import {
  fetchQuestionByIdThunk,
  updateQuestionThunk,
} from "../../store/slices/question";
import { languages } from "../LanguageCodebook/languages";
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
    marginTop: 20,
    zIndex: 2,
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

  switch: {
    color: theme.colors.colorBlack,
    "& *": {
      cursor: "pointer",
    },
  },

  insertButton: {
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
  title: {
    lineHeight: 1,
  },
  item: {
    "& + &": {
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },
  },
  modalTitle: {
    fontWeight: "bold",
  },
  selectInput: {
    marginTop: 20,
    zIndex: 2,
  },
}));

const QuestionLocalizationModal = ({
  opened,
  onClose,
  updateData,
  isUpdate,
  modalData,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const tableData = useSelector((state) => state.questions.questionData);
  const languageData = useSelector((state) => state.language.tableData);

  const schema = Yup.object().shape({
    question: Yup.string()
      .trim(t("questionLocalizationModal.whitespaceValidationQuestion"))
      .strict(true)
      .required(t("questionLocalizationModal.questionValidationEmpty"))
      .min(1, t("questionLocalizationModal.questionValidation"))
      .max(255, t("questionLocalizationModal.stringLenghtValidationQuestion")),
    answer: Yup.string()
      .trim(t("questionLocalizationModal.whitespaceValidationAnswer"))
      .strict(true)
      .required(t("questionLocalizationModal.answerValidationEmpty"))
      .min(1, t("questionLocalizationModal.answerValidation"))
      .max(255, t("questionLocalizationModal.stringLenghtValidationAnswer")),
    locale: Yup.string().min(
      2,
      t("questionLocalizationModal.localeValidation")
    ),
  });

  const form = useForm({
    initialValues: {
      question: "",
      answer: "",
      locale: "",
    },
    schema: yupResolver(schema),
  });

  const prepareItemForInsert = (data, itemForUpdate) => {
    var answers = itemForUpdate.answers.filter(
      (item) => item.locale !== data.locale
    );
    answers = [...answers, { locale: data.locale, value: data.answer }];
    var questions = itemForUpdate.questions.filter(
      (item) => item.locale !== data.locale
    );
    questions = [...questions, { locale: data.locale, value: data.question }];
    return {
      questions: questions,
      answers: answers,
      questionCategoryId: itemForUpdate.questionCategoryId,
      activity: itemForUpdate.activity,
      ordinalNumber: itemForUpdate.ordinalNumber,
    };
  };
  const submitForm = async (data) => {
    var updateObject = [];
    var updateData = [];
    await dispatch(fetchQuestionByIdThunk(modalData[0].id))
      .unwrap()
      .then((response) => {
        updateData = response;
      })
      .catch((e) => {
        showNotification({
          message: isUpdate
            ? t("questionLocalizationModal.updateFailed")
            : t("questionLocalizationModal.insertFailed"),
          color: "red",
        });
      });
    if (isUpdate) {
      updateObject = prepareItemForInsert(data, updateData);
      await dispatch(updateQuestionThunk({ updateData, updateObject }))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("questionLocalizationModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("questionLocalizationModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      updateObject = prepareItemForInsert(data, updateData);
      await dispatch(updateQuestionThunk({ updateData, updateObject }))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("questionLocalizationModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("questionLocalizationModal.insertFailed"),
            color: "red",
          });
        });
    }
    await dispatch(fetchQuestionByIdThunk(modalData[0].id));
  };

  const parseLanguage = (languages) => {
    var locales = tableData.map(({ locale }) => {
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

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        question: updateData.question,
        answer: updateData.answer,
        locale: updateData.locale,
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
        form.reset();
        onClose();
      }}
      title={t("questionLocalizationModal.title")}
      classNames={{ title: classes.modalTitle }}
    >
      <form onSubmit={form.onSubmit(submitForm)}>
        <TextInput
          classNames={classes}
          label={t("questionLocalizationModal.questionLabel")}
          placeholder={t("questionLocalizationModal.questionPlaceholder")}
          {...form.getInputProps("question")}
        />
        <TextInput
          classNames={classes}
          label={t("questionLocalizationModal.answerLabel")}
          placeholder={t("questionLocalizationModal.answerPlaceholder")}
          {...form.getInputProps("answer")}
        />

        <Select
          disabled={isUpdate}
          className={classes.selectInput}
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
  );
};
export default QuestionLocalizationModal;
