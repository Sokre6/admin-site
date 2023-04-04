import {
  Button,
  Paper,
  Text,
  Group,
  CloseButton,
  createStyles,
  Modal,
} from "@mantine/core";
import React from "react";

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
  bannerRoot: {
    padding: "0px !important",
  },
}));
const DeleteBanner = ({
  deleteMethod,
  centered,
  opened,
  onClose,
  modalTitle,
  message,
  okButtonText,
  cancelButtonText,
}) => {
  const { classes } = useStyles();
  return (
    <>
      <Modal
        centered={centered}
        opened={opened}
        onClose={onClose}
        withCloseButton={false}
        classNames={{ modal: classes.bannerRoot }}
      >
        <Paper withBorder shadow="xs" radius="xs" p="lg">
          <Group position="apart" mb="xs">
            <Text size="md" weight={500}>
              {modalTitle}
            </Text>
            <CloseButton mr={-9} mt={-9} onClick={onClose} />
          </Group>
          <Text color="dimmed" size="xs">
            {message}
          </Text>
          <Group position="right" mt="xs">
            <Button
              variant="default"
              className={classes.buttonCancel}
              size="xs"
              onClick={() => onClose()}
            >
              {cancelButtonText}
            </Button>
            <Button
              variant="default"
              className={classes.buttonOk}
              size="xs"
              onClick={() => deleteMethod()}
            >
              {okButtonText}
            </Button>
          </Group>
        </Paper>
      </Modal>
    </>
  );
};
export default DeleteBanner;
