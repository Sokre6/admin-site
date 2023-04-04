import {
  Accordion,
  Box,
  Button,
  Card,
  createStyles,
  Group,
  Image,
  Loader,
  Space,
  Text,
} from "@mantine/core";
import React from "react";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FileUpload } from "tabler-icons-react";

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

const Gallery = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const mediaAssetsData = useSelector((state) => state.mediaAssets.tableData);
  const status = useSelector((state) => state.mediaAssets.status);
  const id = React.useId();

  const convertBytes = function (bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes == 0) {
      return "n/a";
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    if (i == 0) {
      return bytes + " " + sizes[i];
    }

    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
  };

  return (
    <>
      {status === "pending" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20%",
          }}
        >
          <Loader size={50} />
        </div>
      ) : (
        <Group style={{ paddingTop: 10 }}>
          {mediaAssetsData?.content.map((image, index) => (
            <Box key={index}>
              <Card shadow="sm" p="lg">
                <Image
                  key={index}
                  radius="md"
                  src={image?.fileLocationUrl}
                  height={160}
                  width={260}
                />

                <Space h="lg" />
                <Accordion>
                  <Accordion.Item label={t("posts.mediaGallery.details")}>
                    <Text>
                      {t("posts.mediaGallery.imgTitle") + image?.title}
                    </Text>
                    <Text>
                      {t("posts.mediaGallery.imgFileName") + image?.fileName}
                    </Text>
                    <Text>
                      {t("posts.mediaGallery.imgFileSize") +
                        convertBytes(Number(image?.fileSize))}
                    </Text>
                    <Text>
                      {t("posts.mediaGallery.fileType") +
                        image?.fileContentType}
                    </Text>
                  </Accordion.Item>
                </Accordion>
                <Button
                  className={classes.insertButton}
                  fullWidth
                  onClick={() => {
                    switch (props?.imageType) {
                      case "COVER":
                        props.addImage({
                          data: image,
                          file: image?.fileLocationUrl,
                        });
                        break;
                      case "THUMBNAIL":
                        props.addThumbnailImage({
                          data: image,
                          file: image?.fileLocationUrl,
                        });
                        break;
                      default:
                        props.addContentImage(
                          `<figure>
                              <img src=${image?.fileLocationUrl} alt=${image?.altText} id=${id}/>
                              <figcaption>${image?.title}</figcaption>
                          </figure> </br>`
                        );
                    }

                    props.onClose();
                  }}
                >
                  <FileUpload />
                  {t("posts.mediaGallery.addImg")}
                </Button>
              </Card>
            </Box>
          ))}
        </Group>
      )}
    </>
  );
};

export default Gallery;
