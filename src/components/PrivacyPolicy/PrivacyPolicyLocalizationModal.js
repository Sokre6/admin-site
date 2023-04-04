import { useForm, yupResolver } from "@mantine/form";
import {
  createStyles,
  Modal,
  Button,
  TextInput,
  Select,
  Textarea,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { showNotification } from "@mantine/notifications";
import { parseLanguageNames } from "../common/parseLanguageNames";
import { useParams } from "react-router-dom";
import {
  fetchLegalDocumentsByTypeIdThunk,
  updateLegalDocumentsByTypeThunk,
} from "../../store/slices/legalDocuments";

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

const PrivacyPolicyLocalizationModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const params = useParams();

  const tableLocalizationData = useSelector(
    (state) => state?.legalDocumentsByType?.legalDocumentsByTypeId
  );
  const languageData = useSelector((state) => state.language.tableData);

  const { opened, onClose, updateData, isUpdate, modalData } = props;

  const schema = Yup.object().shape({
    locale: Yup.string().min(
      2,
      t("privacyPolicyLocalizationModal.codeValidation")
    ),
    content: Yup.string()
      .trim(t("privacyPolicyLocalizationModal.whitespaceValidation"))
      .strict(true)
      .required(t("privacyPolicyLocalizationModal.required"))
      .min(1, t("privacyPolicyLocalizationModal.contentValidation"))
      .max(255, t("privacyPolicyLocalizationModal.contentLength")),
  });

  const parseLanguage = (languages) => {
    const locales = tableLocalizationData.descriptions.map(
      ({ locale }) => locale
    );

    const mappedLanguage = languages.map(({ code }) => code);

    const filteredLanguage = mappedLanguage.filter(
      (item) => !locales.includes(item)
    );

    return parseLanguageNames(languages, filteredLanguage);
  };

  const form = useForm({
    initialValues: {
      locale: "",
      content: "",
      name:
        modalData !== []
          ? tableLocalizationData?.descriptions.find(
              (item) => item?.locale === "en"
            )?.name
          : "",
    },
    schema: yupResolver(schema),
  });
  const prepareUpdateObject = (data) => {
    const object = {
      validFrom: tableLocalizationData.validFrom,
      validTo: tableLocalizationData.validTo,
      contents: data,
    };

    return object;
  };

  const submitForm = async (data) => {
    let updateObject = [];

    if (isUpdate) {
      let updatedData = modalData.descriptions.filter(
        (item) => item.locale !== data.locale
      );

      updatedData = [...updatedData, data];

      updateObject = prepareUpdateObject(updatedData);

      await dispatch(
        updateLegalDocumentsByTypeThunk({
          id: modalData.id,

          data: updateObject,
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("privacyPolicyLocalizationModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("privacyPolicyLocalizationModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      let createdData = tableLocalizationData.descriptions.filter(
        (item) => item.locale !== data.locale
      );
      createdData = [...createdData, data];

      updateObject = prepareUpdateObject(createdData);

      await dispatch(
        updateLegalDocumentsByTypeThunk({
          id: tableLocalizationData.id,

          data: updateObject,
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("privacyPolicyLocalizationModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("privacyPolicyLocalizationModal.insertFailed"),
            color: "red",
          });
        });
    }
    dispatch(fetchLegalDocumentsByTypeIdThunk(params?.privacyPolicyId));
  };

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        content: updateData.content,
        locale: updateData.locale,
        name: updateData.name,
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
        title={t("privacyPolicyLocalizationModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <Textarea
            autosize
            minRows={2}
            label={t("privacyPolicyLocalizationModal.contentInputTitle")}
            placeholder={t(
              "privacyPolicyLocalizationModal.contentInputPlaceholder"
            )}
            classNames={classes}
            {...form.getInputProps("content")}
          />

          <Select
            disabled={isUpdate}
            data={parseLanguage(languageData)}
            label={t("privacyPolicyLocalizationModal.codeInputTitle")}
            placeholder={t(
              "privacyPolicyLocalizationModal.codeInputPlaceholder"
            )}
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

export default PrivacyPolicyLocalizationModal;
