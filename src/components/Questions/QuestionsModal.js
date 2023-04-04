import { useForm, yupResolver } from "@mantine/form";
import {
  createStyles,
  Modal,
  Button,
  TextInput,
  Select,
  Switch,
  Group,
  Text,
  Textarea,
  NumberInput
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import { fetchQuestionCategoryDataThunk } from "../../store/slices/questionCategory";
import {
  fetchQuestionByIdThunk,
  fetchQuestionsDataThunk,
  insertNewQuestionThunk,
  updateQuestionThunk,
} from "../../store/slices/question";

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
}));

const QuestionsModal = ({ opened, onClose, updateData, isUpdate }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const locale = useSelector((state) => state.settings.language);
  const categories = useSelector((state) => state.questionCategory.tableData);
  const tableData = useSelector((state) => state.questions.tableData)
  const schema = Yup.object().shape({
    question: Yup.string()
      .trim(t("questionsModal.whitespaceValidationQuestion"))
      .strict(true)
      .required(t("questionsModal.questionValidation"))
      .min(1, t("questionsModal.questionValidation"))
      .max(255, t("questionsModal.stringLenghtValidationQuestion")),
    answer: Yup.string()
      .trim(t("questionsModal.whitespaceValidationAnswer"))
      .strict(true)
      .required(t("questionsModal.answerValidation"))
      .min(1, t("questionsModal.answerValidation"))
      .max(4000, t("questionsModal.stringLenghtValidationAnswer")),
    category: Yup.string().required(t("questionsModal.categoryValidation")),
    order: Yup.number()
      .typeError(t("questionsModal.positiveNumberValidation"))
      .min(0, t("questionsModal.positiveNumberValidation"))
      .max(2147483647, t("questionsModal.maxNumberValidation"))
      .test(
        "order",
        t("questionsModal.ordinalNumberExists"),
        function (value) {
          if (isUpdate) {
            var id = updateData.id;
            const checkOrdinalNumber = (element) =>
              element.ordinalNumber === value && element.id !== id;
            return !tableData.some(checkOrdinalNumber);
          } else {
            const checkOrdinalNumber = (element) =>
              element.ordinalNumber === value;
            return !tableData.some(checkOrdinalNumber);
          }
        }
      )
      .required(t("questionsModal.orderValidation")),
  });

  const form = useForm({
    initialValues: {
      category: "",
      question: "",
      answer: "",
      status: false,
      order: "",
    },
    schema: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(fetchQuestionCategoryDataThunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preparaDataForInsert = (data) => {
    return {
      questions: [
        {
          locale: "en",
          value: data.question,
        },
      ],
      answers: [
        {
          locale: "en",
          value: data.answer,
        },
      ],
      questionCategoryId: data.category,
      activity: data.status ? "ACTIVE" : "INACTIVE",
      ordinalNumber: data.order,
    };
  };

  const prepareDataForUpdate = (data, responseData) => {
    var updateDataQuestions = responseData.questions.filter(
      (item) => item.locale !== "en"
    );
    updateDataQuestions = [
      ...updateDataQuestions,
      { locale: "en", value: data.question },
    ];
    var updateDataAnswers = responseData.answers.filter(
      (item) => item.locale !== "en"
    );
    updateDataAnswers = [
      ...updateDataAnswers,
      { locale: "en", value: data.answer },
    ];
    return {
      questions: updateDataQuestions,
      answers: updateDataAnswers,
      questionCategoryId: data.category,
      activity: data.status ? "ACTIVE" : "INACTIVE",
      ordinalNumber: data.order,
    };
  };
  const submitForm = async (data) => {
    var responseData = [];
    if (isUpdate) {
      await dispatch(fetchQuestionByIdThunk(updateData.id))
        .unwrap()
        .then((response) => {
          responseData = response;
        })
        .catch((e) => {
          showNotification({
            message: t("questionsModal.updateFailed"),
            color: "red",
          });
        });
      var updateObject = prepareDataForUpdate(data, responseData);
      await dispatch(updateQuestionThunk({ updateData, updateObject }))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("questionsModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("questionsModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      var insertObject = preparaDataForInsert(data);
      await dispatch(insertNewQuestionThunk(insertObject))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("questionsModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("questionsModal.insertFailed"),
            color: "red",
          });
        });
    }
    await dispatch(fetchQuestionsDataThunk());
  };

  const getLocalizedCategory = (inputArray) => {
    var defaultName = "";
    var localizedName = "";
    for (let i = 0; i < inputArray.length; i++) {
      if (inputArray[i].locale === locale) {
        localizedName = inputArray[i].value;
      } else if (inputArray[i].locale === "en") {
        defaultName = inputArray[i].value;
      }
    }
    return localizedName !== "" ? localizedName : defaultName;
  };
  const prepareQuestionCategories = () => {
    var categoriesArray = [];
    if (categories === []) {
      return [];
    } else {
      for (let i = 0; i < categories.length; i++) {
        categoriesArray.push({
          label: getLocalizedCategory(categories[i].names),
          value: categories[i].id,
        });
      }
      return categoriesArray;
    }
  };
  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        category: updateData.categoryId,
        question: updateData.question,
        answer: updateData.answer,
        status: updateData.status === "ACTIVE" ? true : false,
        order: updateData.ordinalNumber,
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
        title={t("questionsModal.title")}
        classNames={{ title: classes.modalTitle }}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <Select
            classNames={classes}
            data={prepareQuestionCategories()}
            label={t("questionsModal.categoryLabel")}
            placeholder={t("questionsModal.categoryPlaceholder")}
            searchable
            {...form.getInputProps("category", { type: "select" })}
          />
          <TextInput
            label={t("questionsModal.questionLabel")}
            placeholder={t("questionsModal.questionPlaceholder")}
            classNames={classes}
            {...form.getInputProps("question")}
          />
          <Textarea
            label={t("questionsModal.answerLabel")}
            placeholder={t("questionsModal.answerPlaceholder")}
            classNames={classes}
            {...form.getInputProps("answer")}
          />
          <NumberInput
            label={t("questionCategoryInsertModal.orderInputTitle")}
            placeholder={t("questionCategoryInsertModal.orderInputPlaceholder")}
            classNames={classes}
            min={1}
            {...form.getInputProps("order")}
          />
          <Group
            position="apart"
            style={{
              marginTop: 20,
              zIndex: 2,
              paddingLeft: "12px",
              //paddingRight: "12px",
            }}
            className={classes.item}
            noWrap
            spacing="xl"
          >
            <div>
              <Text>{t("questionsModal.activeTitle")}</Text>
              <Text size="xs" color="dimmed">
                {t("questionsModal.activeText")}
              </Text>
            </div>
            <Switch
              sx={(theme) => ({
                width: "100px",
                ".mantine-1mx6z95:checked": {
                  background: theme.colors.colorBlack,
                  borderColor: theme.colors.colorBlack,
                },
                ".mantine-1mx6z95:checked::before": {
                  background: theme.colors.colorLightGray,
                  borderColor: theme.colors.colorLightGray,
                },
                ".mantine-1mx6z95::before": {
                  background: theme.colors.colorGray,
                  borderColor: theme.colors.colorGray,
                },
              })}
              className={classes.switch}
              size="lg"
              {...form.getInputProps("status", { type: "checkbox" })}
            />
          </Group>

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

export default QuestionsModal;
