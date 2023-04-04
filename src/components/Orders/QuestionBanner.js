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
import { sendMailOrderThunk } from "../../store/slices/orders";

const useStyles = createStyles((theme) => ({
  buttonOk: {
    color: theme.colors.colorWhite,
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
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

const QuestionBanner = ({ show, orderId, onClose, documentId }) => {
  const { classes } = useStyles();

  const { t } = useTranslation();

  const dispatch = useDispatch();

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
              {t("ordersDetailsTable.title")}
            </Text>
            <CloseButton mr={-9} mt={-9} onClick={onClose} />
          </Group>
          <Text color="dimmed" size="xs">
            {t("ordersDetailsTable.message")}
          </Text>
          <Group position="right" mt="xs">
            <Button
              className={classes.buttonCancel}
              variant="default"
              size="xs"
              onClick={() => onClose()}
            >
              {t("ordersDetailsTable.cancelButton")}
            </Button>
            <Button
              className={classes.buttonOk}
              variant="default"
              size="xs"
              onClick={async () => {
                await dispatch(
                  sendMailOrderThunk({
                    orderId,
                    documentId,
                  })
                )
                  .unwrap()
                  .then(() => {
                    showNotification({
                      message: t("ordersDetailsTable.mailSentSuccessfully"),
                      color: "green",
                    });
                  })
                  .catch(() => {
                    showNotification({
                      message: t("ordersDetailsTable.mailSentFailed"),
                      color: "red",
                    });
                  });
                onClose();
              }}
            >
              {t("ordersDetailsTable.sendButton")}
            </Button>
          </Group>
        </Paper>
      </Modal>
    </>
  );
};

export default QuestionBanner;
