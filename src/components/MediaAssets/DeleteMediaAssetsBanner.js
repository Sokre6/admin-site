import {
  Button,
  CloseButton,
  createStyles,
  Group,
  Modal,
  Paper,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  deleteMediaAssetsThunk,
  fetchMediaAssetsThunk,
} from "../../store/slices/mediaAssets";

const useStyles = createStyles((theme) => ({
  buttonOk: {
    color: theme.colors.colorWhite,
    backgroundColor: theme.colors.colorRed,
    "&:hover": {
      backgroundColor: theme.colors.colorRed,
    },
  },
  buttonCancel: {
    color: theme.colors.colorBlack,
    backgroundColor: theme.colors.colorWhite,
    "&:hover": {
      backgroundColor: theme.colors.colorLightGrey,
    },
  },
}));

const DeleteMediaAssetsBanner = (props) => {
  const { show, id, onClose, page, size } = props;

  const { classes } = useStyles();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const deleteMediaAssetsBanner = async (id) => {
    await dispatch(deleteMediaAssetsThunk(id))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("deleteBanner.deleteSucessfull"),
          color: "green",
        });
      })
      .catch((error) => {
        if (error === 409) {
          return showNotification({
            message: t("mediaAssetsModal.error_409"),
            color: "red",
          });
        } else {
          return showNotification({
            message: t("deleteBanner.deleteFailed"),
            color: "red",
          });
        }
      });
    await dispatch(fetchMediaAssetsThunk({ page, size }));
    onClose();
  };
  return (
    <>
      <Modal
        centered
        opened={show}
        withCloseButton={false}
        onClose={() => onClose()}
        sx={() => ({
          ".mantine-vos779": {
            padding: "0px",
          },
        })}
      >
        <Paper withBorder shadow="xs" radius="xs" p="lg">
          <Group position="apart" mb="xs">
            <Text size="md" weight={500}>
              {t("deleteBanner.title")}
            </Text>
            <CloseButton mr={-9} mt={-9} onClick={onClose} />
          </Group>
          <Text color="dimmed" size="xs">
            {t("deleteBanner.message")}
          </Text>
          <Group position="right" mt="xs">
            <Button
              className={classes.buttonCancel}
              variant="default"
              size="xs"
              onClick={onClose}
            >
              {t("deleteBanner.cancelButton")}
            </Button>
            <Button
              className={classes.buttonOk}
              variant="default"
              size="xs"
              onClick={() => deleteMediaAssetsBanner(id)}
            >
              {t("deleteBanner.okButton")}
            </Button>
          </Group>
        </Paper>
      </Modal>
    </>
  );
};

export default DeleteMediaAssetsBanner;
