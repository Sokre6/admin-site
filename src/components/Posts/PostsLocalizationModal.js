import {
  Button,
  createStyles,
  Modal,
  TextInput,
  Select,
  Box,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { useEffect, useState } from "react";

import { parseLanguageNames } from "../common/parseLanguageNames";
import {
  fetchPostsByIdThunk,
  updatePostsThunk,
} from "../../store/slices/posts";
import MediaGallery from "./modal/MediaGallery";
import { Editor } from "@tinymce/tinymce-react";
import config from "../../config";

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
  modalRoot: {
    width: "60vw",
  },
  formContainer: {
    display: "flex",
  },
  leftFormContainer: {
    width: "50%",
    padding: "10px",
  },
  rightFormContainer: {
    width: "50%",
    padding: "10px",
  },
  bottomFormContainer: {
    width: "100%",
    padding: "10px",
  },
  errorText: {
    color: "#f03e3e",
  },
  contentPhotoButton: {
    position: "absolute",
    top: 14,
    left: 402,
    zIndex: 100,
    height: 27,
    background: "#fff",
    border: "1px solid #dee2e6",
    "&:hover": {
      background: "#dee2e62b",
    },
  },
}));

const PostsLocalizationModal = (props) => {
  const { opened, onClose, modalData, isUpdate } = props;

  const languageData = useSelector((state) => state.language.tableData);
  const tableDataById = useSelector((state) => state.posts.tableDataById);
  const validationsParams = useSelector(
    (state) => state.parametersValidations.data
  );

  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [openMediaGallery, setOpenMediaGallery] = useState(false);
  const [contentPhoto, setContentPhoto] = useState("");
  const [contentValue, setContentValue] = useState("");

  const schema = Yup.object().shape({
    locale: Yup.string().nullable().required(t("posts.validations.locale")),
    seoTitle: Yup.string()
      .required(t("posts.validations.seoTitle"))
      .max(
        validationsParams.find((n) => n.key === "BLOG_SEO_TITLE_MAX_LENGTH")
          .value,
        t("posts.validations.seoTitleLength")
      )
      .trim(t("posts.validations.seoTitleWhitespaceValidation"))
      .strict(true),
    postTitle: Yup.string()
      .required(t("posts.validations.postTitle"))
      .max(255, t("posts.validations.postTitleMaxLength"))
      .trim(t("posts.validations.postTitleWhitespaceValidation"))
      .strict(true),
    shortContent: Yup.string()
      .required(t("posts.validations.shortContent"))
      .trim(t("posts.validations.shortContentWhitespaceValidation"))
      .strict(true)
      .max(
        validationsParams.find(
          (n) => n.key === "BLOG_POST_SHORT_CONTENT_MAX_LENGTH"
        ).value,
        t("posts.validations.shortContentLength")
      ),
    coverAltText: Yup.string()
      .required(t("posts.validations.altTextCoverPhoto"))
      .max(255, t("posts.validations.altTextCoverPhotoMaxLength"))
      .trim(t("posts.validations.coverAltTextWhitespaceValidation"))
      .strict(true),
    captionCover: Yup.string()
      .required(t("posts.validations.captionCoverPhoto"))
      .max(255, t("posts.validations.captionCoverPhotoMaxLength"))
      .trim(t("posts.validations.captionCoverPhotoWhitespaceValidation"))
      .strict(true),
    thumbnailAltText: Yup.string()
      .required(t("posts.validations.altTextThumbnailPhoto"))
      .max(255, t("posts.validations.altTextThumbnailPhotoMaxLength"))
      .trim(t("posts.validations.thumbnailAltTextWhitespaceValidation"))
      .strict(true),
    thumbnailCaption: Yup.string()
      .required(t("posts.validations.captionThumbnailPhoto"))
      .max(255, t("posts.validations.captionThumbnailPhotoMaxLength"))
      .trim(t("posts.validations.thumbnailCaptionWhitespaceValidation"))
      .strict(true),
    content: Yup.string().test(
      "content",
      t("posts.validations.content"),

      function (value) {
        return value === "" ? false : true;
      }
    ),
    metaDescription: Yup.string()
      .required(t("posts.validations.metaDescription"))
      .max(
        validationsParams.find(
          (n) => n.key === "BLOG_SEO_META_DESCRIPTION_MAX_LENGTH"
        ).value,
        t("posts.validations.metaDescriptionLength")
      )
      .trim(t("posts.validations.metaDescriptionWhitespaceValidation"))
      .strict(true),
    metaKeywords: Yup.string()
      .required(t("posts.validations.metaKeywords"))
      .max(
        validationsParams.find(
          (n) => n.key === "BLOG_SEO_META_KEYWORDS_MAX_LENGTH"
        ).value,
        t("posts.validations.metaKeywordsLength")
      )
      .trim(t("posts.validations.metaKeywordsWhitespaceValidation"))
      .strict(true),
  });

  const form = useForm({
    initialValues: {
      locale: null,
      postTitle: "",
      seoTitle: "",
      shortContent: "",
      metaDescription: "",
      metaKeywords: "",
      coverAltText: "",
      captionCover: "",
      thumbnailAltText: "",
      thumbnailCaption: "",
    },
    schema: yupResolver(schema),
  });

  const parseLanguage = (languages) => {
    const locales = tableDataById.titles.map(({ locale }) => locale);

    const mappedLanguage = languages.map(({ code }) => code);

    const filteredLanguage = mappedLanguage.filter(
      (item) => !locales.includes(item)
    );

    return parseLanguageNames(languages, filteredLanguage);
  };

  const prepareUpdateObject = (data) => {
    const obj = {
      authorId: tableDataById.authorId,
      blogCategoryId: tableDataById.blogCategoryId,
      contentsData: [
        ...data.contentsData,
        {
          locale: data?.formData?.locale,
          content: contentValue,
          shortContent: data?.formData?.shortContent,
        },
      ],
      seoData: [
        ...data.seoData,
        {
          locale: data?.formData?.locale,
          title: data?.formData?.seoTitle,
          metaDescription: data?.formData?.metaDescription,
          metaKeywords: data?.formData?.metaKeywords,
        },
      ],
      titlesData: [
        ...data.titlesData,
        { locale: data?.formData?.locale, title: data?.formData?.postTitle },
      ],
      publishedAt: tableDataById.publishedAt,
      coverPhoto: {
        id: data?.coverPhoto?.id,
        localization: [
          ...data?.coverPhoto?.localizations,
          {
            locale: data?.formData?.locale,
            altText: data?.formData?.coverAltText,
            caption: data?.formData?.captionCover,
          },
        ],
        title: data?.coverPhoto?.title || null,
      },
      thumbnailPhoto: {
        id: data?.thumbnailPhoto?.id,
        localization: [
          ...data.thumbnailPhoto.localizations,
          {
            locale: data?.formData?.locale,
            altText: data?.formData?.thumbnailAltText,
            caption: data?.formData?.thumbnailCaption,
          },
        ],
        title: data?.thumbnailPhoto?.title || null,
      },
    };

    return obj;
  };

  const submitForm = async (dataToSend) => {
    if (contentValue === "") {
      return form.setErrors({ content: t("posts.validations.content") });
    }
    if (isUpdate) {
      let filteredContentData = tableDataById.contents.filter(
        (item) => item.locale !== modalData.seoLocale
      );
      let filteredSeoData = tableDataById.seoData.filter(
        (item) => item.locale !== modalData.seoLocale
      );
      let filteredTitlesData = tableDataById.titles.filter(
        (item) => item.locale !== modalData.seoLocale
      );

      let filterCoverPhotoLocalization =
        tableDataById.coverPhoto?.localizations?.filter(
          (item) => item.locale !== modalData.seoLocale
        );

      let filterThumbnailPhotoLocalization =
        tableDataById.thumbnailPhoto?.localizations?.filter(
          (item) => item.locale !== modalData.seoLocale
        );

      const prepared = prepareUpdateObject({
        formData: dataToSend,
        contentsData: filteredContentData,
        seoData: filteredSeoData,
        titlesData: filteredTitlesData,
        coverPhoto: {
          id: tableDataById?.coverPhoto?.id,
          localizations: filterCoverPhotoLocalization,
          title: tableDataById?.coverPhoto?.title,
        },
        thumbnailPhoto: {
          id: tableDataById?.thumbnailPhoto?.id,
          localizations: filterThumbnailPhotoLocalization,
          title: tableDataById?.thumbnailPhoto?.title,
        },
      });

      await dispatch(
        updatePostsThunk({
          id: tableDataById.id,
          data: prepared,
          contentsData: prepared.contentsData,
          titlesData: prepared.titlesData,
          seoData: prepared.seoData,
          tags: tableDataById.tags,
          coverPhoto: prepared?.coverPhoto,
          thumbnailPhoto: prepared?.thumbnailPhoto,
        })
      )
        .unwrap()
        .then(() => {
          showNotification({
            message: t("posts.localizationModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch(() => {
          showNotification({
            message: t("posts.localizationModal.updateFailed"),
            color: "red",
          });
        });

      await dispatch(fetchPostsByIdThunk(tableDataById.id));
    } else {
      const preparedData = {
        locale: dataToSend.locale,
        title: dataToSend.seoTitle,
        metaDescription: dataToSend.metaDescription,
        metaKeywords: dataToSend.metaKeywords,
        content: contentValue,
        postTitle: dataToSend.postTitle,
      };
      let filteredContentData = tableDataById.contents.filter(
        (item) => item.locale !== preparedData.locale
      );
      let filteredSeoData = tableDataById.seoData.filter(
        (item) => item.locale !== preparedData.locale
      );
      let filteredTitlesData = tableDataById.titles.filter(
        (item) => item.locale !== preparedData.locale
      );

      let filterCoverPhotoLocalization =
        tableDataById.coverPhoto?.localizations?.filter(
          (item) => item.locale !== preparedData.locale
        );

      let filterThumbnailPhotoLocalization =
        tableDataById.thumbnailPhoto?.localizations?.filter(
          (item) => item.locale !== preparedData.locale
        );

      const prepared = prepareUpdateObject({
        formData: dataToSend,
        contentsData: filteredContentData,
        seoData: filteredSeoData,
        titlesData: filteredTitlesData,
        coverPhoto: {
          id: tableDataById?.coverPhoto?.id,
          localizations: filterCoverPhotoLocalization,
          title: tableDataById?.coverPhoto?.title,
        },
        thumbnailPhoto: {
          id: tableDataById?.thumbnailPhoto?.id,
          localizations: filterThumbnailPhotoLocalization,
          title: tableDataById?.thumbnailPhoto?.title,
        },
      });

      await dispatch(
        updatePostsThunk({
          id: tableDataById.id,
          data: prepared,
          contentsData: prepared.contentsData,
          titlesData: prepared.titlesData,
          seoData: prepared.seoData,
          tags: tableDataById.tags,
          coverPhoto: prepared.coverPhoto,
          thumbnailPhoto: prepared.thumbnailPhoto,
        })
      )
        .unwrap()
        .then(() => {
          showNotification({
            message: t("posts.localizationModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("posts.localizationModal.insertFailed"),
            color: "red",
          });
        });

      await dispatch(fetchPostsByIdThunk(tableDataById.id));
    }

    form.reset();
    onClose();
    setContentPhoto("");
    setContentValue("");
  };

  useEffect(() => {
    if (isUpdate) {
      setContentValue(modalData?.content);
      form.setValues({
        locale: modalData?.seoLocale,
        postTitle: modalData?.title,
        seoTitle: modalData?.seoTitle,
        shortContent: modalData?.shortContent,
        metaDescription: modalData?.metaDescription,
        metaKeywords: modalData?.metaKeywords,
        coverAltText: modalData?.coverAltText,
        captionCover: modalData?.coverCaption,
        thumbnailAltText: modalData?.thumbnailAltText,
        thumbnailCaption: modalData?.thumbnailCaption,
      });
    }
  }, [modalData]);

  useEffect(() => {
    setContentValue((prev) => prev.concat(contentPhoto));
  }, [contentPhoto]);

  return (
    <>
      <Modal
        classNames={{ modal: classes.modalRoot }}
        closeOnClickOutside={false}
        centered
        opened={opened}
        onClose={() => {
          form.reset();
          onClose();
          setContentPhoto("");
          setContentValue("");
        }}
        title={t("posts.localizationModal.modalTitle")}
        sx={() => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        {" "}
        <form onSubmit={form.onSubmit(submitForm)}>
          <div className={classes.formContainer}>
            <div className={classes.leftFormContainer}>
              <Select
                disabled={isUpdate}
                data={parseLanguage(languageData) || []}
                label={t("posts.localizationModal.locale")}
                placeholder={t(
                  "posts.localizationModal.localeInputPlaceholder"
                )}
                classNames={classes}
                searchable
                {...form.getInputProps("locale", { type: "select" })}
              />
              <TextInput
                label={t("posts.localizationModal.postTitle")}
                placeholder={t("posts.localizationModal.postTitle")}
                classNames={classes}
                {...form.getInputProps("postTitle")}
              />
              <TextInput
                label={t("posts.localizationModal.seoTitle")}
                placeholder={t("posts.localizationModal.seoTitle")}
                classNames={classes}
                {...form.getInputProps("seoTitle")}
              />
              <TextInput
                label={t("posts.localizationModal.altTextCoverPhoto")}
                placeholder={t("posts.localizationModal.altTextCoverPhoto")}
                classNames={classes}
                {...form.getInputProps("coverAltText")}
              />
              <TextInput
                label={t("posts.localizationModal.captionCoverPhoto")}
                placeholder={t("posts.localizationModal.captionCoverPhoto")}
                classNames={classes}
                {...form.getInputProps("captionCover")}
              />
            </div>
            <div className={classes.rightFormContainer}>
              <TextInput
                label={t("posts.localizationModal.metaDescription")}
                placeholder={t("posts.localizationModal.metaDescription")}
                classNames={classes}
                {...form.getInputProps("metaDescription")}
              />
              <TextInput
                label={t("posts.localizationModal.metaKeywords")}
                placeholder={t("posts.localizationModal.metaKeywords")}
                classNames={classes}
                {...form.getInputProps("metaKeywords")}
              />
              <TextInput
                label={t("posts.localizationModal.altTextThumbnailPhoto")}
                placeholder={t("posts.localizationModal.altTextThumbnailPhoto")}
                classNames={classes}
                {...form.getInputProps("thumbnailAltText")}
              />
              <TextInput
                label={t("posts.localizationModal.captionThumbnailPhoto")}
                placeholder={t("posts.localizationModal.captionThumbnailPhoto")}
                classNames={classes}
                {...form.getInputProps("thumbnailCaption")}
              />
              <TextInput
                label={t("posts.localizationModal.shortContent")}
                placeholder={t("posts.localizationModal.shortContent")}
                classNames={classes}
                {...form.getInputProps("shortContent")}
              />
            </div>
          </div>
          <div className={classes.bottomFormContainer}>
            <Box style={{ position: "relative" }}>
              <Editor
                onKeyDown={() => form.clearFieldError("content")}
                value={contentValue}
                onEditorChange={setContentValue}
                apiKey={config.REACT_APP_TINY_MCE_EDITOR_API_KEY}
                init={{
                  selector: "textarea",
                  menubar: false,
                  plugins: "link media advlist lists",
                  toolbar:
                    "bold italic | alignleft aligncenter alignright | numlist bullist outdent indent | link media myCustomImageButton",
                  branding: false,
                  setup: (editor) => {
                    editor.ui.registry.addButton("myCustomImageButton", {
                      icon: "image",
                      onAction: () => {
                        setOpenMediaGallery(true);
                      },
                    });
                  },
                }}
              />
            </Box>

            {form.errors.content !== null ? (
              <p className={classes.errorText}>{form.errors.content}</p>
            ) : (
              ""
            )}
          </div>

          <div className={classes.buttonContainer}>
            <Button type="submit" className={classes.insertButton}>
              {t("modalCommon.saveButton")}
            </Button>
          </div>
        </form>
      </Modal>

      <MediaGallery
        open={openMediaGallery}
        imageType={"CONTENT"}
        onClose={() => setOpenMediaGallery(false)}
        addContentImage={setContentPhoto}
      />
    </>
  );
};

export default PostsLocalizationModal;
