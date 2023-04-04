import { useForm, yupResolver } from "@mantine/form";
import {
  createStyles,
  Modal,
  Button,
  TextInput,
  Switch,
  Group,
  Text,
  NumberInput,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import {
  fetchQuestionCategoryByCodeThunk,
  fetchQuestionCategoryDataThunk,
  insertNewQuestionCategoryThunk,
  updateQuestionCategoryThunk,
} from "../../store/slices/questionCategory";

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
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },
  },
}));

const QuestionCategoryModal = ({ opened, onClose, updateData, isUpdate }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const tableData = useSelector((state) => state.questionCategory.tableData);
  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("questionCategoryInsertModal.whitespaceValidation"))
      .strict(true)
      .required(t("questionCategoryInsertModal.nameValidation"))
      .min(1, t("questionCategoryInsertModal.nameValidation"))
      .max(255, t("questionCategoryInsertModal.stringLenghtValidation"))
      .test(
        "name",
        t("questionCategoryInsertModal.nameAlreadyExists"),
        function (value) {
          return true;
        }
      ),
    order: Yup.number()
      .typeError(t("questionCategoryInsertModal.positiveNumberValidation"))
      .min(0, t("questionCategoryInsertModal.positiveNumberValidation"))
      .max(2147483647, t("questionCategoryInsertModal.maxNumberValidation"))
      .test(
        "order",
        t("questionCategoryInsertModal.ordinalNumberExists"),
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
      .required(t("questionCategoryInsertModal.orderValidation")),
  });
  const form = useForm({
    initialValues: {
      name: "",
      order: "",

      active: false,
    },
    schema: yupResolver(schema),
  });

  const prepareDataForInsert = (data) => {
    return {
      names: [
        {
          locale: "en",
          value: data.name,
        },
      ],
      ordinalNumber: data.order,
      active: data.active ? "ACTIVE" : "INACTIVE",
    };
  };

  const prepareDataForUpdate = (data, responseData) => {
    var updateData = responseData.names.filter((item) => item.locale !== "en");
    updateData = [...updateData, { locale: "en", value: data.name }];
    return {
      names: updateData,
      ordinalNumber: data.order,
      active: data.active ? "ACTIVE" : "INACTIVE",
    };
  };
  const submitForm = async (data) => {
    var responseData = [];
    if (isUpdate) {
      await dispatch(fetchQuestionCategoryByCodeThunk(updateData.id))
        .unwrap()
        .then((response) => {
          responseData = response;
        })
        .catch((e) => {
          showNotification({
            message: t("questionCategoryInsertModal.updateFailed"),
            color: "red",
          });
        });
      var dataForUpdate = prepareDataForUpdate(data, responseData);
      await dispatch(updateQuestionCategoryThunk({ updateData, dataForUpdate }))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("questionCategoryInsertModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("questionCategoryInsertModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      var insertData = prepareDataForInsert(data);
      await dispatch(insertNewQuestionCategoryThunk(insertData))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("questionCategoryInsertModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("questionCategoryInsertModal.insertFailed"),
            color: "red",
          });
        });
    }
    await dispatch(fetchQuestionCategoryDataThunk());
  };

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        name: updateData.name,
        order: updateData.ordinalNumber,
        active: updateData.active === "ACTIVE" ? true : false,
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
        title={t("questionCategoryInsertModal.title")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("questionCategoryInsertModal.nameInputTitle")}
            placeholder={t("questionCategoryInsertModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("name")}
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
              <Text>{t("questionCategoryInsertModal.activeTitle")}</Text>
              <Text size="xs" color="dimmed">
                {t("questionCategoryInsertModal.activeText")}
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
              {...form.getInputProps("active", { type: "checkbox" })}
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

export default QuestionCategoryModal;
