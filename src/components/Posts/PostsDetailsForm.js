import {
  createStyles,
  Divider,
  Grid,
  Box,
  TextInput,
  Button,
  Select,
  Group,
  Text,
  MultiSelect,
  Drawer,
  Image,
  Card,
  Title,
} from "@mantine/core";

import { DatePicker, TimeInput } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAuthorsThunk } from "../../store/slices/author";
import {
  createPostsThunk,
  fetchPostsByIdThunk,
  updatePostsThunk,
} from "../../store/slices/posts";
import { getLocalizedName } from "./helpers/helpers";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import { fetchTagsThunk } from "../../store/slices/tags";
import { PictureInPicture } from "tabler-icons-react";
import MediaGallery from "./modal/MediaGallery";
import { Editor } from "@tinymce/tinymce-react";
import config from "../../config";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    marginTop: 20,
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
    marginTop: 15,
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
  errorText: {
    color: "#f03e3e",
  },
  contentPhotoButton: {
    position: "absolute",
    top: 12,
    left: 560,
    zIndex: 100,
    height: 27,
    background: "transparent",
    "&:hover": {
      background: "#CCE2FAff",
    },
  },
}));

const PostDetailsForm = ({ initialValues, status }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { postsId } = useParams();
  const navigate = useNavigate();
  const { classes } = useStyles();

  const locale = useSelector((state) => state.settings?.language);
  const blogsData = useSelector((state) => state.blog?.tableData);
  const authorsData = useSelector((state) => state.author?.tableData);
  const tagsData = useSelector((state) => state.tags?.data);
  const validationsParams = useSelector(
    (state) => state.parametersValidations?.data
  );

  const [isSubmit, setIsSubmit] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const [openMediaGallery, setOpenMediaGallery] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [thumbnailPhoto, setThumbnailPhoto] = useState(null);
  const [imageType, setImageType] = useState("");

  const [contentPhoto, setContentPhoto] = useState("");
  const [contentValue, setContentValue] = useState(initialValues?.content);

  const schema = Yup.object().shape({
    title: Yup.string()
      .required(t("posts.validations.postTitle"))
      .max(255, t("posts.validations.postTitleMaxLength"))
      .trim(t("posts.validations.postTitleWhitespaceValidation"))
      .strict(true),
    authorId: Yup.string().nullable().required(t("posts.validations.authorId")),
    blogCategoryId: Yup.string()
      .nullable()
      .required(t("posts.validations.categoryId")),
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
    seoTitle: Yup.string()
      .required(t("posts.validations.seoTitle"))
      .max(
        validationsParams.find((n) => n.key === "BLOG_SEO_TITLE_MAX_LENGTH")
          .value,
        t("posts.validations.seoTitleLength")
      )
      .trim(t("posts.validations.seoTitleWhitespaceValidation"))
      .strict(true),
    shortContent: Yup.string()
      .required(t("posts.validations.shortContent"))
      .max(
        validationsParams.find(
          (n) => n.key === "BLOG_POST_SHORT_CONTENT_MAX_LENGTH"
        ).value,
        t("posts.validations.shortContentLength")
      )
      .trim(t("posts.validations.shortContentWhitespaceValidation"))
      .strict(true),
    content: Yup.string().test(
      "content",
      t("posts.validations.content"),

      function (value) {
        return value === "" ? false : true;
      }
    ),
    altTextCoverPhoto: Yup.string()
      .required(t("posts.validations.altTextCoverPhoto"))
      .max(255, t("posts.validations.altTextCoverPhotoMaxLength"))
      .trim(t("posts.validations.coverAltTextWhitespaceValidation"))
      .strict(true),
    captionCoverPhoto: Yup.string()
      .required(t("posts.validations.captionCoverPhoto"))
      .max(255, t("posts.validations.captionCoverPhotoMaxLength"))
      .trim(t("posts.validations.captionCoverPhotoWhitespaceValidation"))
      .strict(true),
    altTextThumbnailPhoto: Yup.string()
      .required(t("posts.validations.altTextThumbnailPhoto"))
      .max(255, t("posts.validations.altTextThumbnailPhotoMaxLength"))
      .trim(t("posts.validations.thumbnailAltTextWhitespaceValidation"))
      .strict(true),
    captionThumbnailPhoto: Yup.string()
      .required(t("posts.validations.captionThumbnailPhoto"))
      .max(255, t("posts.validations.captionThumbnailPhotoMaxLength"))
      .trim(t("posts.validations.thumbnailCaptionWhitespaceValidation"))
      .strict(true),
  });

  const form = useForm({
    initialValues,
    schema: yupResolver(schema),
  });

  const prepareBlogCategories = (blogsData) => {
    return blogsData.map((element) => ({
      label: getLocalizedName(element.names, locale),
      value: element.id,
    }));
  };

  const prepareAuthors = (authorsData) => {
    return authorsData.map((element) => ({
      label: `${element.givenName} ${element.familyName}`,
      value: element.id,
    }));
  };

  const submitForm = async (formData) => {
    if (contentValue === "") {
      form.setErrors({ content: t("posts.validations.content") });
      return;
    }

    const mergedDateAndTime = (published) => {
      if (!!published?.publishedAt) {
        const mergedDateTime = new Date(published?.publishedAt?.getTime());

        mergedDateTime.setHours(published?.time.getHours());
        mergedDateTime.setMinutes(published?.time.getMinutes());
        mergedDateTime.setSeconds(published?.time.getSeconds());
        mergedDateTime.setMilliseconds(published?.time.getMilliseconds());
        return mergedDateTime;
      } else {
        return null;
      }
    };

    const data = {
      ...formData,
      contentValue,
      publishedAt: mergedDateAndTime(formData),
    };

    setIsSubmit(true);
    if (postsId === "new") {
      await dispatch(
        createPostsThunk({
          locale: "en",
          data,
          tags: form.values.tags?.map((tagValue) => {
            const tag = allTags.find((tag) => tag?.value === tagValue);
            const isNew = tag?.value === tag?.label;

            return {
              [isNew ? undefined : "id"]: isNew ? undefined : tag?.value,
              name: tag?.label,
            };
          }),
          coverPhotoId: coverPhoto?.data?.id,
          thumbnailPhotoId: thumbnailPhoto?.data?.id,
          coverPhotoTitle: formData?.coverPhotoTitle || null,
          thumbnailPhotoTitle: formData?.thumbnailPhotoTitle || null,
        })
      )
        .unwrap()
        .then(() => {
          showNotification({
            message: t("posts.postDetailsForm.createdSuccesfully"),
            color: "green",
          });

          navigate(-1);
        })
        .catch((e) => {
          showNotification({
            message: t("posts.postDetailsForm.createError"),
            color: "red",
          });
        });
    } else {
      let updateData = null;

      await dispatch(fetchPostsByIdThunk(postsId))
        .unwrap()
        .then((response) => {
          updateData = response;
        })
        .catch((e) => {
          showNotification({
            message: t("posts.postDetails.updateFailed"),
            color: "red",
          });
        });

      const filterSEOData = updateData?.seoData?.filter(
        (item) => item.locale !== "en"
      );

      const seoData = [
        ...filterSEOData,
        {
          locale: "en",
          title: data?.seoTitle,
          metaDescription: data?.metaDescription,
          metaKeywords: data?.metaKeywords,
        },
      ];

      const filterTitlesData = updateData?.titles?.filter(
        (item) => item.locale !== "en"
      );
      const titlesData = [
        ...filterTitlesData,
        { locale: "en", title: data.title },
      ];

      const filterContentsData = updateData?.contents?.filter(
        (item) => item.locale !== "en"
      );
      const contentsData = [
        ...filterContentsData,
        {
          locale: "en",
          content: contentValue,
          shortContent: data?.shortContent,
        },
      ];

      const filterCoverPhotoData =
        updateData?.coverPhoto?.localizations?.filter(
          (item) => item.locale !== "en"
        );
      const coverPhotoData = [
        ...filterCoverPhotoData,
        {
          locale: "en",
          altText: data.altTextCoverPhoto,
          caption: data.captionCoverPhoto,
        },
      ];

      const filterThumbnailPhotoData =
        updateData?.thumbnailPhoto?.localizations?.filter(
          (item) => item.locale !== "en"
        );
      const thumbnailPhotoData = [
        ...filterThumbnailPhotoData,
        {
          locale: "en",
          altText: data.altTextThumbnailPhoto,
          caption: data.captionThumbnailPhoto,
        },
      ];

      await dispatch(
        updatePostsThunk({
          id: postsId,
          seoData,
          titlesData,
          contentsData,
          data,
          tags: form?.values?.tags?.map((tagValue) => {
            const tag = allTags.find((tag) => tag.value === tagValue);
            const isNew = tag?.value === tag?.label;

            return {
              [isNew ? undefined : "id"]: isNew ? undefined : tag.value,
              name: tag.label,
            };
          }),

          coverPhoto: {
            id: coverPhoto?.data
              ? coverPhoto?.data?.id
              : updateData?.coverPhoto.id,
            localization: coverPhotoData,
            title: formData?.coverPhotoTitle || null,
          },
          thumbnailPhoto: {
            id: thumbnailPhoto?.data
              ? thumbnailPhoto?.data?.id
              : updateData?.thumbnailPhoto?.id,
            localization: thumbnailPhotoData,
            title: formData?.thumbnailPhotoTitle || null,
          },
        })
      )
        .unwrap()
        .then(() => {
          showNotification({
            message: t("posts.postDetailsForm.updateSuccessfully"),
            color: "green",
          });
          setIsSubmit(false);
          navigate(-1);
        })
        .catch((e) => {
          showNotification({
            message: t("posts.postDetailsForm.updateFailed"),
            color: "red",
          });
        });
    }
    await dispatch(fetchTagsThunk());
  };

  useEffect(() => {
    if (form?.values?.coverPhotoFileId || form?.values?.thumbnailPhotoFileId) {
      setCoverPhoto({ file: form.values?.coverPhotoFileUrl });
      setThumbnailPhoto({ file: form.values?.thumbnailPhotoFileUrl });
    }
    dispatch(fetchAuthorsThunk());
    dispatch(fetchTagsThunk());
  }, []);

  useEffect(() => {
    setAllTags(tagsData.map(({ name, id }) => ({ value: id, label: name })));
  }, [tagsData]);

  useEffect(() => {
    setContentValue(contentValue.concat(contentPhoto));
  }, [contentPhoto]);

  return (
    <>
      <Group position="right">
        <Button
          leftIcon={<PictureInPicture />}
          onClick={() => setOpenedDrawer(true)}
          className={classes.insertButton}
        >
          {t("modalCommon.mediaGallery")}
        </Button>
      </Group>
      <form onSubmit={form.onSubmit(submitForm)}>
        <Grid gutter="lg" grow>
          <Grid.Col span={4}>
            <Text weight={500}>{t("posts.postDetailsForm.posts")}</Text>
            <Divider />
            <TextInput
              disabled={postsId !== "new" && status !== "DRAFT"}
              label={t("posts.postDetailsForm.postTitle")}
              placeholder={t("posts.postDetailsForm.postTitle")}
              classNames={classes}
              {...form.getInputProps("title")}
            />{" "}
            <Group grow>
              <DatePicker
                disabled={postsId !== "new" && status !== "DRAFT"}
                classNames={classes}
                inputFormat="DD.MM.YYYY"
                label={t("posts.postDetailsForm.publishedAt")}
                {...form.getInputProps("publishedAt")}
              />
              <TimeInput
                disabled={postsId !== "new" && status !== "DRAFT"}
                classNames={classes}
                clearable={status === "DRAFT"}
                label={t("posts.postDetailsForm.time")}
                {...form.getInputProps("time")}
              />
            </Group>
            <Select
              classNames={classes}
              disabled={postsId !== "new" && status !== "DRAFT"}
              searchable
              data={prepareAuthors(authorsData) || []}
              label={t("posts.postDetailsForm.authors")}
              {...form.getInputProps("authorId")}
            />
            <Select
              disabled={postsId !== "new" && status !== "DRAFT"}
              classNames={classes}
              searchable
              data={prepareBlogCategories(blogsData) || []}
              label={t("posts.postDetailsForm.blogCategory")}
              {...form.getInputProps("blogCategoryId")}
            />
            <MultiSelect
              disabled={postsId !== "new" && status !== "DRAFT"}
              styles={(theme) => ({
                root: { position: "relative" },
                input: {
                  height: "auto",
                  paddingTop: 18,
                },
                label: {
                  pointerEvents: "none",
                  fontSize: theme.fontSizes.xs,
                  paddingLeft: theme.spacing.sm / 2,
                  zIndex: 1,
                },
              })}
              label={
                <Box
                  sx={(theme) => ({
                    position: "absolute",
                    paddingLeft: theme.spacing.sm / 2,
                    top: 28,
                    zIndex: 99,
                  })}
                >
                  {t("posts.postDetailsForm.tags")}
                </Box>
              }
              data={allTags}
              searchable
              placeholder={t("posts.postDetailsForm.tags")}
              creatable
              getCreateLabel={(query) =>
                t(`posts.postDetailsForm.createTags`, { tag: query })
              }
              onCreate={(query) => {
                const item = { value: query, label: query };

                setAllTags((current) => [...current, item]);
                return item;
              }}
              {...form.getInputProps("tags")}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <Text weight={500}>{t("posts.postDetailsForm.seo")}</Text>
            <Divider />
            <TextInput
              disabled={postsId !== "new" && status !== "DRAFT"}
              classNames={classes}
              label={t("posts.postDetailsForm.metaDescription")}
              placeholder={t("posts.postDetailsForm.metaDescription")}
              {...form.getInputProps("metaDescription")}
            />{" "}
            <TextInput
              disabled={postsId !== "new" && status !== "DRAFT"}
              classNames={classes}
              label={t("posts.postDetailsForm.metaKeywords")}
              placeholder={t("posts.postDetailsForm.metaKeywords")}
              {...form.getInputProps("metaKeywords")}
            />{" "}
            <TextInput
              disabled={postsId !== "new" && status !== "DRAFT"}
              classNames={classes}
              label={t("posts.postDetailsForm.seoTitle")}
              placeholder={t("posts.postDetailsForm.seoTitle")}
              {...form.getInputProps("seoTitle")}
            />
          </Grid.Col>
        </Grid>{" "}
        <Text style={{ marginTop: 20 }} weight={500}>
          {t("posts.postDetailsForm.content")}
        </Text>
        <Divider />
        <Box>
          <TextInput
            style={{ maxWidth: "40vw" }}
            disabled={postsId !== "new" && status !== "DRAFT"}
            classNames={classes}
            label={t("posts.postDetailsForm.shortContent")}
            placeholder={t("posts.postDetailsForm.shortContent")}
            {...form.getInputProps("shortContent")}
          />

          <Box style={{ position: "relative", marginTop: 30 }}>
            <Editor
              onKeyDown={() => form.clearFieldError("content")}
              disabled={postsId !== "new" && status !== "DRAFT"}
              //ref={editor}
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
                  (status === "DRAFT" || (!status && postsId === "new")) &&
                    editor.ui.registry.addButton("myCustomImageButton", {
                      icon: "image",
                      onAction: () => {
                        setImageType("CONTENT");
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
          <Drawer
            opened={openedDrawer}
            onClose={() => {
              setOpenedDrawer(false);
            }}
            title={
              <Title order={4}>
                {t("posts.postDetailsForm.mediaGallery").toUpperCase()}
              </Title>
            }
            padding="xl"
            size="lg"
            position="right"
          >
            <Title order={5}>{t("posts.postDetailsForm.coverPhoto")}</Title>
            <Divider />

            <Card>
              <Image
                onClick={() => {
                  setOpenMediaGallery(true);
                  setImageType("COVER");
                }}
                height={120}
                src={coverPhoto?.file}
                withPlaceholder
                styles={{
                  root: {
                    pointerEvents:
                      postsId !== "new" && status !== "DRAFT" && "none",
                    cursor: "pointer",
                    maxWidth: "100%",
                  },
                  placeholder: {
                    "&:hover": {
                      backgroundColor: "lightgrey",
                    },
                  },
                }}
              />
              {(coverPhoto?.file || form.values.coverPhotoFileId) && (
                <>
                  <TextInput
                    disabled={postsId !== "new" && status !== "DRAFT"}
                    label={t("posts.postDetailsForm.coverPhotoTitle")}
                    placeholder={t("posts.postDetailsForm.coverPhotoTitle")}
                    classNames={classes}
                    {...form.getInputProps("coverPhotoTitle")}
                  />
                  <TextInput
                    disabled={postsId !== "new" && status !== "DRAFT"}
                    label={t("posts.postDetailsForm.altTextCoverPhoto")}
                    placeholder={t("posts.postDetailsForm.altTextCoverPhoto")}
                    classNames={classes}
                    {...form.getInputProps("altTextCoverPhoto")}
                  />
                  <TextInput
                    disabled={postsId !== "new" && status !== "DRAFT"}
                    label={t("posts.postDetailsForm.captionCoverPhoto")}
                    placeholder={t("posts.postDetailsForm.captionCoverPhoto")}
                    classNames={classes}
                    {...form.getInputProps("captionCoverPhoto")}
                  />
                </>
              )}
            </Card>
            <Divider />

            <Title order={5}>{t("posts.postDetailsForm.thumbnailPhoto")}</Title>
            <Card>
              <Image
                onClick={() => {
                  setOpenMediaGallery(true);
                  setImageType("THUMBNAIL");
                }}
                height={120}
                src={thumbnailPhoto?.file}
                withPlaceholder
                styles={{
                  root: {
                    pointerEvents:
                      postsId !== "new" && status !== "DRAFT" && "none",
                    cursor: "pointer",
                    maxWidth: "100%",
                  },
                  placeholder: {
                    "&:hover": {
                      backgroundColor: "lightgray",
                    },
                  },
                }}
              />

              {(thumbnailPhoto?.file || form.values.thumbnailPhotoFileId) && (
                <>
                  <TextInput
                    disabled={postsId !== "new" && status !== "DRAFT"}
                    label={t("posts.postDetailsForm.thumbnailPhotoTitle")}
                    placeholder={t("posts.postDetailsForm.thumbnailPhotoTitle")}
                    classNames={classes}
                    {...form.getInputProps("thumbnailPhotoTitle")}
                  />
                  <TextInput
                    disabled={postsId !== "new" && status !== "DRAFT"}
                    label={t("posts.postDetailsForm.altTextThumbnailPhoto")}
                    placeholder={t(
                      "posts.postDetailsForm.altTextThumbnailPhoto"
                    )}
                    classNames={classes}
                    {...form.getInputProps("altTextThumbnailPhoto")}
                  />
                  <TextInput
                    disabled={postsId !== "new" && status !== "DRAFT"}
                    label={t("posts.postDetailsForm.thumbnailCaption")}
                    placeholder={t("posts.postDetailsForm.thumbnailCaption")}
                    classNames={classes}
                    {...form.getInputProps("captionThumbnailPhoto")}
                  />
                </>
              )}
            </Card>
          </Drawer>
          <Group position="right">
            <Button
              type="submit"
              loading={isSubmit}
              className={classes.insertButton}
              disabled={
                status === "PUBLISHED" || !(coverPhoto && thumbnailPhoto)
              }
            >
              {t("modalCommon.saveButton")}
            </Button>
          </Group>
        </Box>
      </form>

      <MediaGallery
        open={openMediaGallery}
        imageType={imageType}
        onClose={() => setOpenMediaGallery(false)}
        addImage={setCoverPhoto}
        addThumbnailImage={setThumbnailPhoto}
        addContentImage={setContentPhoto}
      />
    </>
  );
};

export default PostDetailsForm;
