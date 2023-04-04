import { Button, createStyles, Modal, Select, Textarea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchAuthorByIdThunk,
  updateAuthorThunk,
} from "../../store/slices/author";
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

const AuthorLocalizationModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const params = useParams();

  const { opened, onClose, modalData, isUpdate, updateData } = props;

  const languageData = useSelector((state) => state.language.tableData);
  const tableLocalizationData = useSelector(
    (state) => state.author?.authorDataById
  );

  const schema = Yup.object().shape({
    description: Yup.string()
      .trim(t("authorLocaleModal.whitespaceValidation"))
      .strict(true)
      .required(t("authorLocaleModal.nameValidation"))
      .min(1, t("authorLocaleModal.nameMinValidation"))
      .max(255, t("authorLocaleModal.stringLenghtValidation")),
    locale: Yup.string().min(2, t("authorLocaleModal.codeValidation")),
  });

  const parseLanguage = (languages) => {
    const locales = tableLocalizationData.descriptions.map(({ locale }) => {
      return locale;
    });

    const mappedLanguage = languages.map(({ code }) => {
      return code;
    });

    const filteredLanguage = mappedLanguage.filter(
      (item) => !locales.includes(item)
    );

    return parseLanguageNames(languages,filteredLanguage);
  };

  const form = useForm({
    initialValues: {
      description: "",
      locale: "",
    },
    schema: yupResolver(schema),
  });

  const prepareUpdateObject = (data) => {
    const object = {
      givenName: tableLocalizationData.givenName,
      familyName: tableLocalizationData.familyName,
      photoId: tableLocalizationData.photoId,
      socialMediaProfiles: tableLocalizationData.socialMediaProfiles,
      descriptions: data,
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
        updateAuthorThunk({
          id: modalData.id,

          data: updateObject,
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("authorModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("authorModal.updateFailed"),
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
        updateAuthorThunk({
          id: tableLocalizationData.id,

          data: updateObject,
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("authorModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("authorModal.insertFailed"),
            color: "red",
          });
        });
    }
    dispatch(fetchAuthorByIdThunk(params.authorId));
  };

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        description: updateData?.description,
        locale: updateData?.locale,
      });
    }
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
        title={t("authorLocaleModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <Textarea
            label={t("authorLocaleModal.nameInputTitle")}
            placeholder={t("authorLocaleModal.nameInputPlaceholder")}
            classNames={classes}
            minRows={2}
            autosize
            {...form.getInputProps("description")}
          />

          <Select
            disabled={isUpdate}
            data={parseLanguage(languageData)}
            label={t("authorLocaleModal.codeInputTitle")}
            placeholder={t("authorLocaleModal.codeInputPlaceholder")}
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

export default AuthorLocalizationModal;
