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
import { deleteUserAccountAdministrationDataThunk, fetchUserAccountAdministrationDataThunk } from "../../store/slices/userAccountAdministration";

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


const DeleteUserAccountsBanner=({ show, data, onClose })=>{
    const { classes } = useStyles();

    const { t } = useTranslation();
  
    const dispatch = useDispatch();


    const deleteUserAccount= async (data) => {
   
        await dispatch(deleteUserAccountAdministrationDataThunk(data))
          .unwrap()
          .then(() => {
            showNotification({
              message: t("userModal.deleteSucessfull"),
              color: "green",
            });
          })
          .catch((e) => {
            showNotification({
              message: t("userModal.deleteFailed"),
              color: "red",
            });
          });
        dispatch(fetchUserAccountAdministrationDataThunk());
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
                  onClick={() =>deleteUserAccount(data)}
                >
                  {t("deleteBanner.okButton")}
                </Button>
              </Group>
            </Paper>
          </Modal>
        </>
      );
    };
  



export default DeleteUserAccountsBanner;