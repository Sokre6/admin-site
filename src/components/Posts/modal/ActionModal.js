import {
  Button,
  CloseButton,
  createStyles,
  Group,
  Modal,
  Paper,
  Text,
} from "@mantine/core";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { fetchPostsThunk, patchPostsThunk } from "../../../store/slices/posts";

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

const ActionModal = (props) => {
  const { showModal,rowId, type, onClose } = props;

  const { classes } = useStyles();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const checkActionTypeMsg = (actionType) => {
    switch (actionType) {
      case "switch-to-draft":
        return t("actionModal.switchToDraftMsg");

      case "retire":
        return t("actionModal.retireMsg");

      default:
        return "";
    }
  };

  return (
    <>
      <Modal
        centered
        opened={showModal}
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
              {t("actionModal.title")}
            </Text>
            <CloseButton mr={-9} mt={-9} onClick={onClose} />
          </Group>
          <Text color="dimmed" size="xs">
            {checkActionTypeMsg(type)}
          </Text>
          <Group position="right" mt="xs">
            <Button
              className={classes.buttonCancel}
              variant="default"
              size="xs"
              onClick={onClose}
            >
              {t("actionModal.cancelButton")}
            </Button>
            <Button
              className={classes.buttonOk}
              variant="default"
              size="xs"
              onClick={async () => {
                await dispatch(patchPostsThunk({ id: rowId, type: type }));
                await dispatch(fetchPostsThunk());
                onClose();
              }}
            >
              {t("actionModal.ok")}
            </Button>
          </Group>
        </Paper>
      </Modal>
    </>
  );
};

export default ActionModal;
