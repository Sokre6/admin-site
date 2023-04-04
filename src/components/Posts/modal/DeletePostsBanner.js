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
import { deletePostsThunk, fetchPostsThunk } from "../../../store/slices/posts";

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

const DeletePostsBanner = ({ show, id, onClose, pageSize, page }) => {
  const { classes } = useStyles();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const deletePostsBanner = async (id) => {
    await dispatch(deletePostsThunk(id))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("deleteBanner.deleteSucessfull"),
          color: "green",
        });
      })
      .catch(() => {
        showNotification({
          message: t("deleteBanner.deleteFailed"),
          color: "red",
        });
      });
    await dispatch(fetchPostsThunk({ page, pageSize }));
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
              onClick={() => deletePostsBanner(id)}
            >
              {t("deleteBanner.okButton")}
            </Button>
          </Group>
        </Paper>
      </Modal>
    </>
  );
};

export default DeletePostsBanner;
