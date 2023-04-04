import {
  Box,
  Button,
  createStyles,
  Image,
  Modal,
  Text,
  TextInput,
  Group
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { TrashX, Upload } from "tabler-icons-react";

import { insertNewFileThunk } from "../../store/slices/file";
import {
  createMediaAssetsThunk,
  fetchMediaAssetsThunk,
  updateMediaAssetsThunk,
} from "../../store/slices/mediaAssets";

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
    marginTop: 8,
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
  tableIconsButton: {
    padding: "0px",
    "&:hover": {
      backgroundColor: theme.colors.colorGray,
    },

    position: "absolute",
    top: 5,

    backgroundColor: theme.colors.colorRed,
  },
  tableIconsTrash: {
    color: "white",
    "&:hover": {
      color: theme.colors.colorRed,
    },
  },
  insertButton: {
    marginTop: 5,
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
}));

const MediaAssetsModal = (props) => {
  const { opened, onClose, modalData, page, size } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();

  const [uploadedImage, setUploadedImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState([]);

  const schema = Yup.object().shape({
    title: Yup.string()
      .trim(t("mediaAssetsModal.whitespaceValidationTitle"))
      .strict(true)
      .required(t("mediaAssetsModal.required"))
      .min(1, t("mediaAssetsModal.titleValidation"))
      .max(1000, t("mediaAssetsModal.titleLength")),
    altText: Yup.string()
      .trim(t("mediaAssetsModal.whitespaceValidationAltText"))
      .strict(true)
      .max(1000, t("mediaAssetsModal.altTextLength")),
    caption: Yup.string()
      .trim(t("mediaAssetsModal.whitespaceValidationCaption"))
      .strict(true)
      .max(1000, t("mediaAssetsModal.captionLength")),
  });

  const form = useForm({
    initialValues: {
      title: "",
      altText: "",
      caption: "",
    },
    schema: yupResolver(schema),
  });

  const uploadImageForDropzone = async (file) => {
    setFile(file);

    setUploadedImage({
      name: file[0].name,
      location: URL.createObjectURL(file[0]),
    });
  };

  const submitForm = async (data) => {
    setIsLoading(true);
    if (!!modalData) {
      const preparedObject = {
        title: data.title,
        altText: data.altText,
        caption: data.caption,
      };

      await dispatch(
        updateMediaAssetsThunk({ id: modalData?.id, data: preparedObject })
      )
        .unwrap()
        .then(() => {
          showNotification({
            message: t("mediaAssetsModal.updateSuccessfully"),
            color: "green",
          });
        })
        .catch(() => {
          showNotification({
            message: t("mediaAssetsModal.updateFailed"),
            color: "red",
          });
        });
      setIsLoading(false);
      await dispatch(
        fetchMediaAssetsThunk({
          page,
          size,
        })
      );
    } else {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file[0], file[0].name);

      let id = null;

      await dispatch(insertNewFileThunk(formData))
        .unwrap()
        .then((response) => {
          const url = response.location;

          id = url.substring(url.lastIndexOf("/") + 1, url.length);
        });

      await dispatch(
        createMediaAssetsThunk({
          fileId: id,
          fileContentType: file[0].type,
          fileName: file[0].name,
          fileSize: file[0].size,
          title: data.title,
          altText: data.altText,
          caption: data.caption,
        })
      )
        .unwrap()
        .then(() => {
          showNotification({
            message: t("mediaAssetsModal.createdSuccesfully"),
            color: "green",
          });
        })
        .catch(() => {
          showNotification({
            message: t("mediaAssetsModal.createError"),
            color: "red",
          });
        });
      await dispatch(
        fetchMediaAssetsThunk({
          page,
          size,
        })
      );
    }
    setIsLoading(false);
    setUploadedImage(null);
    setFile([]);
    onClose();
    form.reset();
  };

  useEffect(() => {
    if (!!modalData) {
      form.setValues({
        altText: modalData?.altText || "",
        caption: modalData?.caption || "",
        title: modalData?.title || "",
      });

      setUploadedImage({ location: modalData?.fileLocationUrl });
    }
  }, [modalData]);

  return (
    <>
      <Modal
        size={750}
        closeOnClickOutside={false}
        centered
        opened={opened}
        onClose={() => {
          form.reset();
          setUploadedImage(null);
          setFile([]);
          onClose();
        }}
        title={t("mediaAssetsModal.mediaAssetsTitle")}
        sx={() => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        {" "}
        <form onSubmit={form.onSubmit(submitForm)}>
          <Group position="apart">
            <TextInput
              label={t("mediaAssetsModal.title")}
              placeholder={t("mediaAssetsModal.title")}
              classNames={classes}
              {...form.getInputProps("title")}
            />

            <TextInput
              label={t("mediaAssetsModal.altText")}
              placeholder={t("mediaAssetsModal.altText")}
              classNames={classes}
              {...form.getInputProps("altText")}
            />
            <TextInput
              label={t("mediaAssetsModal.caption")}
              placeholder={t("mediaAssetsModal.caption")}
              classNames={classes}
              {...form.getInputProps("caption")}
            />
          </Group>

          <Dropzone
            styles={{
              root: {
                marginTop: 10,
                height: 500,
                overflowY: "auto",
              },
            }}
            loading={isLoading}
            disabled={!!modalData}
            maxSize={1000000}
            onDrop={uploadImageForDropzone}
            onReject={() =>
              showNotification({
                message: t("mediaAssets.imgSizeError"),
                color: "red",
              })
            }
            accept={IMAGE_MIME_TYPE}
          >
            {function dropzoneContent() {
              return (
                <>
                  {!uploadedImage ? (
                    <Group
                      style={{ marginTop: "30%" }}
                      position="center"
                      spacing="xl"
                    >
                      <Upload size={80} />

                      <div>
                        <Text size="xl" inline>
                          {t("modalCommon.dropzone_msg_1")}
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                          {t("modalCommon.dropzone_msg_2")}
                        </Text>
                      </div>
                    </Group>
                  ) : (
                    <Box>
                      <Image
                        style={{ position: "relative" }}
                        src={uploadedImage?.location}
                        height={200}
                        width={300}
                      />{" "}
                      {!modalData && (
                        <Button
                          className={classes.tableIconsButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedImage(null);
                          }}
                        >
                          <TrashX className={classes.tableIconsTrash} />
                        </Button>
                      )}
                    </Box>
                  )}
                </>
              );
            }}
          </Dropzone>
          <div className={classes.buttonContainer}>
            <Button
              className={classes.insertButton}
              disabled={!uploadedImage}
              type="submit"
            >
              {t("modalCommon.saveButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default MediaAssetsModal;
