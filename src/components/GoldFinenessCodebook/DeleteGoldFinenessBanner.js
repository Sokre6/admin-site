import {
  Button,
  CloseButton,
  createStyles,
  Group,
  Modal,
  Overlay,
  Paper,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  deleteGoldFinenessThunk,
  fetchGoldFinenessDataThunk,
} from "../../store/slices/goldFineness";

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

const DeleteGoldFinenessBanner = ({ show, data, onClose }) => {
  const { classes } = useStyles();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const deleteGoldenFineness = async (data) => {
    await dispatch(deleteGoldFinenessThunk(data))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("deleteBanner.deleteSucessfull"),
          color: "green",
        });
      })
      .catch((error) => {
        if (error === 409) {
          showNotification({
            message: t("deleteBanner.error_409"),
            color: "red",
          });
        } else {
          showNotification({
            message: t("deleteBanner.deleteFailed"),
            color: "red",
          });
        }
      });
    dispatch(fetchGoldFinenessDataThunk());
    onClose();
  };

 
  return (
    <>
      <Modal
        centered
        opened={show}
        withCloseButton={false}
        onClose={() => onClose()}
        sx={(theme) => ({
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
              onClick={() => deleteGoldenFineness(data)}
            >
              {t("deleteBanner.okButton")}
            </Button>
          </Group>
        </Paper>
      </Modal>
    </>
  );
};

export default DeleteGoldFinenessBanner;
