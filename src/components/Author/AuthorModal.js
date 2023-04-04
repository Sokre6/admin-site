import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  createStyles,
  Group,
  Image,
  Loader,
  Modal,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import React, { useEffect, useRef, useState } from "react";
import images from "../../assets/images/index";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

import {
  createNewAuthorThunk,
  fetchAuthorByIdThunk,
  fetchAuthorsThunk,
  updateAuthorThunk,
} from "../../store/slices/author";
import axios from "../../http/axios";
import PictureCard from "../common/PictureCard";
import { insertNewFileThunk } from "../../store/slices/file";

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
  dropzoneHidden: {
    display: "none",
  },
}));

const AuthorModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const openRef = useRef(null);
  const { opened, onClose, isUpdate, updateData } = props;

  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const locale = useSelector((state) => state.settings.language);
  const authorDataPhoto = useSelector(
    (state) => state.author?.authorDataById?.photoId
  );

  const schema = Yup.object().shape({
    givenName: Yup.string()
      .trim(t("authorModal.whitespaceValidationName"))
      .strict(true)
      .required(t("authorModal.nameValidation"))
      .min(1, t("authorModal.nameMinValidation"))
      .max(255, t("authorModal.nameStringLenghtValidation")),
    familyName: Yup.string()
      .trim(t("authorModal.familyNameWhitespaceValidation"))
      .strict(true)
      .required(t("authorModal.familyNameValidation"))
      .min(1, t("authorModal.familyNameMinValidation"))
      .max(255, t("authorModal.familyNameStringLenghtValidation")),
    description: Yup.string()
      .trim(t("authorModal.descriptionWhitespaceValidation"))
      .strict(true)
      .required(t("authorModal.descriptionValidation"))
      .min(1, t("authorModal.descriptionMinValidation"))
      .max(255, t("authorModal.descriptionStringLenghtValidation")),
    twitterProfile: Yup.string()
      .test(
        "isValidTwitter",
        t("authorModal.isValidTwitter"),
        (validProfile) => {
          if (validProfile === "") {
            return true;
          } else {
            return /http(?:s)?:\/\/(?:www\.)?(.*\.)?twitter\.com\/.*$/.test(
              validProfile
            );
          }
        }
      )
      .trim(t("authorModal.twitterProfileWhitespaceValidation"))
      .strict(true),
    linkedInProfile: Yup.string()
      .test(
        "isValidLinkedIn",
        t("authorModal.isValidLinkedIn"),
        (validProfile) => {
          if (validProfile === "") {
            return true;
          } else {
            return /http(?:s)?:\/\/(?:www\.)?(.*\.)?linkedin\.com\/.*$/.test(
              validProfile
            );
          }
        }
      )
      .trim(t("authorModal.linkedInProfileWhitespaceValidation"))
      .strict(true),
  });

  const form = useForm({
    initialValues: {
      givenName: "",
      familyName: "",
      photoId: null,
      description: "",
      twitterProfile: "",
      linkedInProfile: "",
    },
    schema: yupResolver(schema),
  });

  const prepareUpdateObject = (data, responseData) => {
    let updateDataDescriptions = [
      ...responseData,
      { locale: "en", description: data.description },
    ];

    const prepareSocialMediaObject = [
      {
        type: "LINKEDIN",
        value: data.linkedInProfile,
      },
      { type: "TWITTER", value: data.twitterProfile },
    ];

    const photo = uploadedImages.map((image) => image?.id).toString();

    const object = {
      givenName: data.givenName,
      familyName: data.familyName,
      photoId: data.photoId,
      descriptions: updateDataDescriptions,
      socialMediaProfiles: prepareSocialMediaObject.filter(
        (item) => item.value
      ),
      photoId: photo || null,
    };

    return object;
  };

  const submitForm = async (data) => {
    let updateObject = [];
    if (isUpdate) {
      await dispatch(fetchAuthorByIdThunk(updateData.id))
        .unwrap()
        .then((response) => {
          updateObject = response.descriptions.filter(
            (item) => item.locale !== "en"
          );
        })
        .catch((e) => {
          showNotification({
            message: t("authorModal.updateFailed"),
            color: "red",
          });
        });

      await dispatch(
        updateAuthorThunk({
          id: updateData.id,
          data: prepareUpdateObject(data, updateObject),
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          setUploadedImages([]);
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
      const photo = uploadedImages?.map((image) => image.id).toString();

      await dispatch(createNewAuthorThunk({ locale, data: data, photo }))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          setUploadedImages([]);
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
    await dispatch(fetchAuthorsThunk());
  };

  const fetchProductPictures = async (id) => {
    setIsLoading(true);

    if (id !== null && id.length > 0) {
      const response = await axios.get(`/aurodomus-file/api/v1/files/${id}`, {
        responseType: "blob",
      });
      setUploadedImages((prev) => [
        ...prev,
        { file: response.data, id, name: id },
      ]);
    }
    setIsLoading(false);
  };

  const uploadImage = async (files) => {
    setIsLoading(true);

    if (files.length > 1) {
      setIsLoading(false);
      showNotification({
        message: t("authorModal.imgError"),
        color: "red",
      });
    } else {
      const [file] = files;

      const formData = new FormData();

      formData.append("file", file, file.name);

      await dispatch(insertNewFileThunk(formData))
        .unwrap()
        .then((response) => {
          const url = response.location;
          const id = url.substring(url.lastIndexOf("/") + 1, url.length);

          setUploadedImages((prev) => [
            { ...response, id, name: id, file: file },
          ]);
        });
      setIsLoading(false);
    }
  };

  const deletePicture = (name) => {
    //napomena!!! trenutno nije podrzano brisanje slike s apija

    setUploadedImages((prev) =>
      prev.filter((picture) => picture.name !== name)
    );
  };

  const renderPhotos = uploadedImages.map((image, index) => {
    return (
      <PictureCard
        key={index}
        image={image.file}
        alt={image.name}
        name={image.name}
        onDelete={deletePicture}
      />
    );
  });

  useEffect(() => {
    form.clearErrors();

    if (isUpdate) {
      form.setValues({
        givenName: updateData?.givenName,
        familyName: updateData?.familyName,
        description: updateData?.description,
        twitterProfile:
          updateData?.socialMediaProfiles.find(
            (item) => item?.type === "TWITTER"
          )?.value || "",
        linkedInProfile:
          updateData?.socialMediaProfiles.find(
            (item) => item?.type === "LINKEDIN"
          )?.value || "",
      });
      fetchProductPictures(authorDataPhoto);
      setUploadedImages([]);
    }
  }, [updateData, isUpdate]);

  return (
    <Modal
      closeOnClickOutside={false}
      centered
      opened={opened}
      onClose={() => {
        onClose();
        form.reset();
        setUploadedImages([]);
        setIsLoading(false);
      }}
      title={t("authorModal.modalTitle")}
      sx={(theme) => ({
        ".mantine-Modal-title": {
          fontWeight: "bold",
        },
      })}
    >
      <form onSubmit={form.onSubmit(submitForm)}>
        <TextInput
          label={t("authorModal.nameInputTitle")}
          placeholder={t("authorModal.nameInputPlaceholder")}
          classNames={classes}
          {...form.getInputProps("givenName")}
        />

        <TextInput
          label={t("authorModal.familyNameInputTitle")}
          placeholder={t("authorModal.familyNameInputPlaceholder")}
          classNames={classes}
          {...form.getInputProps("familyName")}
        />

        <Textarea
          label={t("authorModal.descriptionInputTitle")}
          placeholder={t("authorModal.descriptionInputPlaceholder")}
          classNames={classes}
          minRows={2}
          autosize
          {...form.getInputProps("description")}
        />

        <TextInput
          label={t("authorModal.twitterInputTitle")}
          placeholder={t("authorModal.twitterInputPlaceholder")}
          classNames={classes}
          {...form.getInputProps("twitterProfile")}
        />

        <TextInput
          label={t("authorModal.linkedInInputTitle")}
          placeholder={t("authorModal.linkedInInputPlaceholder")}
          classNames={classes}
          {...form.getInputProps(`linkedInProfile`)}
        />

        <Group sx={{ alignItems: "flex-start", paddingTop: 30 }}>
          <Image
            src={images.addPicture}
            width={120}
            fit="cover"
            alt="logo"
            onClick={() => openRef.current()}
            sx={{ cursor: "pointer", padding: 8 }}
          />

          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: 120,
                height: 100,
                alignItems: "center",
              }}
            >
              <Loader />
            </Box>
          ) : (
            renderPhotos
          )}
        </Group>
        <Dropzone
          maxSize={1000000}
          onReject={(files) =>
            showNotification({
              message: t("authorModal.imgSizeError"),
              color: "red",
            })
          }
          onDrop={uploadImage}
          openRef={openRef}
          className={classes.dropzoneHidden}
          accept={IMAGE_MIME_TYPE}
        >
          {function dropzoneContent() {
            return (
              <>
                <div></div>
              </>
            );
          }}
        </Dropzone>

        <div className={classes.buttonContainer}>
          <Button type="submit" className={classes.insertButton}>
            {t("modalCommon.saveButton")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AuthorModal;
