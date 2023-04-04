import React from 'react';
import { Text, Group, Button, Space, Modal,createStyles, CloseButton, Paper } from '@mantine/core';
import { useTranslation } from 'react-i18next';


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

const DeleteConfirmationDialog = ({ openDelete, setOpenDelete, onDeleteApplicableCountry, selectedCode }) => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    return (
        <>
        <Modal
            centered
            opened={openDelete}
            withCloseButton={false}
            onClose={() => setOpenDelete(false)}
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
            <CloseButton mr={-9} mt={-9} onClick={() => setOpenDelete(false)} />

            </Group>
            <Text color="dimmed" size="xs">
            {t("deleteBanner.message")}
          </Text>
          <Group position="right" mt="xs">
            <Button
              className={classes.buttonCancel}
              variant="default"
              size="xs"
              onClick={() => setOpenDelete(false)}
            >
              {t("deleteBanner.cancelButton")}
            </Button>
            <Button
              className={classes.buttonOk}
              variant="default"
              size="xs"
              onClick={() => {
                onDeleteApplicableCountry(selectedCode);
                setOpenDelete(false);
            }} >
            
              {t("deleteBanner.okButton")}
            </Button>
          </Group>
            </Paper>





          

        </Modal >
        </>
    );
}

export default DeleteConfirmationDialog;
