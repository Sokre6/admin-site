import { Button, createStyles, Modal, TextInput, Select } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { useEffect } from "react";
import { updateBlog } from "../../http/services/blog";
import { fetchBlogByIdThunk, updateBlogThunk } from "../../store/slices/blog";
import { useParams } from "react-router-dom";
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

const BlogLocalizationModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const params = useParams();

  const languageData = useSelector((state) => state.language.tableData);

  const tableLocalizationData = useSelector((state) => state.blog.blogDataById);
  const { opened, onClose, modalData, isUpdate, updateData } = props;

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("blogLocaleModal.whitespaceValidation"))
      .strict(true)
      .required(t("blogLocaleModal.nameValidation"))
      .min(1, t("blogLocaleModal.nameMinValidation"))
      .max(255, t("blogLocaleModal.stringLenghtValidation")),
    locale: Yup.string().min(2, t("blogLocaleModal.codeValidation")),
  });

  

  const parseLanguage = (languages) => {

    const locales = tableLocalizationData.names.map(({ locale }) => locale);

    const mappedLanguage = languages.map(({ code }) => code);

    const filteredLanguage = mappedLanguage.filter(
      (item) => !locales.includes(item)
    );
    
    return parseLanguageNames(languages, filteredLanguage);
  };

  const form = useForm({
    initialValues: {
      name: "",
      locale: "",
    },
    schema: yupResolver(schema),
  });

  const prepareUpdateObject = (data) => {
    const object = {
      colorHexCode: tableLocalizationData.colorHexCode,
      names: data,
    };

    return object;
  };

  const submitForm = async (data) => {
    let updateObject = [];

    if (isUpdate) {
      let updatedData = modalData.names.filter(
        (item) => item.locale !== data.locale
      );

      updatedData = [...updatedData, data];
      updateObject = prepareUpdateObject(updatedData);

      await dispatch(
        updateBlogThunk({
          id: modalData.id,

          data: updateObject,
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("blogModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("blogModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      let createdData = tableLocalizationData.names.filter(
        (item) => item.locale !== data.locale
      );
      createdData = [...createdData, data];

      updateObject = prepareUpdateObject(createdData);
      await dispatch(
        updateBlogThunk({
          id: tableLocalizationData.id,

          data: updateObject,
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("blogModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("blogModal.insertFailed"),
            color: "red",
          });
        });
    }
    dispatch(fetchBlogByIdThunk(params.blogId));
  };

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        name: updateData?.name,
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
        title={t("blogLocaleModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("blogLocaleModal.nameInputTitle")}
            placeholder={t("blogLocaleModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("name")}
          />

          <Select
            disabled={isUpdate}
            data={parseLanguage(languageData)}
            label={t("blogLocaleModal.codeInputTitle")}
            placeholder={t("blogLocaleModal.codeInputPlaceholder")}
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

export default BlogLocalizationModal;
