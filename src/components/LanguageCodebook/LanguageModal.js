import { useForm, yupResolver } from "@mantine/form";
import {
  createStyles,
  Modal,
  Button,
  TextInput,
  Select,
  Text,
  Switch,
  Group,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import {
  insertNewLanguageThunk,
  updateLanguageThunk,
  fetchLanguagesDataThunk,
  fetchLanguageByCodeThunk,
} from "../../store/slices/language";
import { languages } from "./languages";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";

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
}));

const LanguageModal = ({ opened, onClose, updateData, isUpdate }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const locale = useSelector((state) => state.settings.language);
  const tableData = useSelector((state) => state.language.tableData);

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("languageModal.whitespaceValidation"))
      .strict(true)
      .required(t("languageModal.questionValidation"))
      .min(1, t("languageModal.nameValidation"))
      .max(255, t("languageModal.stringLenghtValidation")),
    code: Yup.string().min(2, t("languageModal.codeValidation")),
  });
  const form = useForm({
    initialValues: {
      name: "",
      code: "",
      activity: true,
    },
    schema: yupResolver(schema),
  });
  const parseLanguage = (languages) => {
    var tableLocales = tableData.map(({ code }) => {
      return code;
    });
    var languageLocales = languages.map(({ code }) => {
      return code;
    });
    return languageLocales.filter((item) => !tableLocales.includes(item));
  };

  const prepareDataForUpdate = (data, responseData) => {
    var updateData = responseData.names.filter((item) => item.locale !== "en");
    updateData = [...updateData, { locale: "en", name: data.name }];
    var object = {
      code: data.code,
      names: updateData,
      activity: data.activity ? "ACTIVE" : "INACTIVE",
    };
    return object;
  };

  const submitForm = async (data) => {
    var responseData = [];
    if (isUpdate) {
      await dispatch(fetchLanguageByCodeThunk(data.code))
        .unwrap()
        .then((response) => {
          responseData = response;
        })
        .catch((e) => {
          showNotification({
            message: t("languageModal.updateFailed"),
            color: "red",
          });
        });

      var updateData = prepareDataForUpdate(data, responseData);
      await dispatch(updateLanguageThunk(updateData))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("languageModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("languageModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      await dispatch(insertNewLanguageThunk({ locale, data }))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("languageModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("languageModal.insertFailed"),
            color: "red",
          });
        });
    }
    await dispatch(fetchLanguagesDataThunk());
  };
  useEffect(() => {
    form.clearErrors();
    form.reset();
    if (isUpdate) {
      form.setValues({
        name: updateData.name,
        code: updateData.code,
        activity: updateData.activity === "ACTIVE" ? true : false,
      });
    }
  }, [updateData]);
  return (
    <>
      <Modal
        closeOnClickOutside={false}
        centered
        opened={opened}
        onClose={onClose}
        title={t("languageModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("languageModal.nameInputTitle")}
            placeholder={t("languageModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("name")}
          />

          <Select
            disabled={isUpdate}
            style={{ marginTop: 20, zIndex: 2 }}
            data={parseLanguage(languages)}
            label={t("languageModal.codeInputTitle")}
            placeholder={t("languageModal.codeInputPlaceholder")}
            classNames={classes}
            searchable
            {...form.getInputProps("code", { type: "select" })}
          />
          <Group
            position="apart"
            style={{
              marginTop: 20,
              zIndex: 2,
              paddingLeft: "12px",
            }}
            noWrap
            spacing="xl"
          >
            <div>
              <Text>{t("languageModal.activityTitle")}</Text>
              <Text size="xs" color="dimmed">
                {t("languageModal.activityText")}
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
              {...form.getInputProps("activity", { type: "checkbox" })}
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
export default LanguageModal;
