import React, { useEffect } from "react";
import {
  Box,
  Button,
  createStyles,
  Divider,
  Group,
  Image,
  Pagination,
  Select,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Modal } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useDispatch, useSelector } from "react-redux";
import { insertNewFileThunk } from "../../../store/slices/file";
import {
  createMediaAssetsThunk,
  fetchMediaAssetsThunk,
} from "../../../store/slices/mediaAssets";

import Gallery from "./Gallery";
import { useForm } from "@mantine/form";
import { Search, TrashX, Upload } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";

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

const MediaGallery = (props) => {
  const {
    open,
    onClose,
    addImage,
    addThumbnailImage,
    imageType,
    addContentImage,
  } = props;
  const { t } = useTranslation();
  const { classes } = useStyles();
  const mediaAssetsData = useSelector((state) => state.mediaAssets.tableData);
  const dispatch = useDispatch();

  const [uploadedImage, setUploadedImage] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);

  const [state, setState] = React.useState({
    activePage: 0,
    pageSize: "5",
  });

  const [file, setFile] = React.useState([]);

  const form = useForm({
    initialValues: {
      title: "",
      altText: "",
      caption: "",
      fileName: "",
    },
  });

  const uploadImage = async (file) => {
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
        title: file[0].name.slice(0, file[0].name.lastIndexOf(".")),
      })
    )
      .unwrap()
      .then(() => {
        showNotification({
          message: t("posts.postDetailsForm.imageUploadSuccesfully"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("posts.postDetailsForm.imageUploadError"),
          color: "red",
        });
      });
    await dispatch(
      fetchMediaAssetsThunk({
        page: state.activePage,
        size: state.pageSize,
      })
    );
    setIsLoading(false);
    setUploadedImage([]);
  };

  const uploadImageForDropzone = async (file) => {
    setFile(file);

    setUploadedImage(() => [
      {
        name: file[0].name,
        location: URL.createObjectURL(file[0]),
      },
    ]);
  };

  const submitForm = () => setState((prev) => ({ ...prev, activePage: 0 }));

  useEffect(() => {
    dispatch(
      fetchMediaAssetsThunk({
        title: form.values?.title || null,
        altText: form.values?.altText || null,
        caption: form.values?.caption || null,
        fileName: form.values?.fileName || null,
        page: state.activePage,
        size: state.pageSize,
      })
    );
  }, [file, state]);

  return (
    <>
      <Modal
        size={1000}
        closeOnClickOutside={false}
        centered
        opened={open}
        onClose={() => {
          onClose();
          setUploadedImage([]);
          setState({ activePage: 0, pageSize: "5" });
        }}
        title={t("posts.mediaGallery.title")}
        sx={() => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <Tabs defaultValue="gallery">
          <Tabs.Tab label={t("posts.mediaGallery.mediaGallery")}>
            <form onSubmit={form.onSubmit(submitForm)}>
              <Group position="apart">
                <TextInput
                  label={t("posts.mediaGallery.titleMedia")}
                  placeholder={t("posts.mediaGallery.titleMedia")}
                  classNames={classes}
                  {...form.getInputProps("title")}
                />
                <TextInput
                  label={t("posts.mediaGallery.altText")}
                  placeholder={t("posts.mediaGallery.altText")}
                  classNames={classes}
                  {...form.getInputProps("altText")}
                />
                <TextInput
                  label={t("posts.mediaGallery.caption")}
                  placeholder={t("posts.mediaGallery.caption")}
                  classNames={classes}
                  {...form.getInputProps("caption")}
                />
                <TextInput
                  label={t("posts.mediaGallery.fileName")}
                  placeholder={t("posts.mediaGallery.fileName")}
                  classNames={classes}
                  {...form.getInputProps("fileName")}
                />
                <Button className={classes.insertButton} type="submit">
                  <Search />
                  {t("posts.mediaGallery.search")}
                </Button>
              </Group>
            </form>

            <Divider style={{ marginTop: 10 }} />
            <Box
              style={{
                height: 500,
                overflowY: "auto",
              }}
            >
              <Gallery
                addImage={addImage}
                onClose={onClose}
                addThumbnailImage={addThumbnailImage}
                addContentImage={addContentImage}
                imageType={imageType}
              />
            </Box>
            {mediaAssetsData?.totalPages > 0 && (
              <Group position="right">
                <Pagination
                  page={state.activePage + 1}
                  onChange={(page) =>
                    setState((prev) => ({ ...prev, activePage: page - 1 }))
                  }
                  total={mediaAssetsData?.totalPages}
                  color={"dark"}
                />
                <Select
                  styles={{
                    root: {
                      width: 65,
                    },
                  }}
                  data={["5", "10", "15"]}
                  placeholder={t("posts.mediaGallery.pageSize")}
                  value={state.pageSize}
                  onChange={(value) =>
                    setState({ activePage: 0, pageSize: value })
                  }
                />
              </Group>
            )}
          </Tabs.Tab>
          <Tabs.Tab label={t("posts.mediaGallery.mediaUploadImg")}>
            <Dropzone
              styles={{
                root: {
                  height: 500,
                  overflowY: "auto",
                },
              }}
              loading={isLoading}
              maxSize={1000000}
              onDrop={uploadImageForDropzone}
              onReject={() =>
                showNotification({
                  message: t("productModal.imgSizeError"),
                  color: "red",
                })
              }
              accept={IMAGE_MIME_TYPE}
            >
              {function dropzoneContent() {
                return (
                  <>
                    {uploadedImage.length === 0 ? (
                      <Group
                        style={{ marginTop: "20%" }}
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
                      uploadedImage.map((image, index) => {
                        return (
                          <Box key={index}>
                            <Image
                              style={{ position: "relative" }}
                              src={image.location}
                              height={200}
                              width={300}
                            />{" "}
                            <Button
                              className={classes.tableIconsButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImage((prev) =>
                                  prev.filter(
                                    (image) => image.name !== file[0].name
                                  )
                                );
                              }}
                            >
                              <TrashX className={classes.tableIconsTrash} />
                            </Button>
                          </Box>
                        );
                      })
                    )}
                  </>
                );
              }}
            </Dropzone>
            <Group position="right">
              <Button
                className={classes.insertButton}
                loading={isLoading}
                disabled={uploadedImage.length === 0}
                onClick={() => {
                  uploadImage(file);
                }}
              >
                {t("modalCommon.saveButton")}
              </Button>
            </Group>
          </Tabs.Tab>
        </Tabs>
      </Modal>
    </>
  );
};

export default MediaGallery;
