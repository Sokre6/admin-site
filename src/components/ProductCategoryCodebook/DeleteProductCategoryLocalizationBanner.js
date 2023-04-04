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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProductCategoryByIdThunk,
  updateProductCategoryThunk,
} from "../../store/slices/productCategory";

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

const DeleteProductCategoryLocalizationBanner = ({
  show,
  deleteData,
  onClose,
}) => {
  const { classes } = useStyles();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  let params = useParams();
  const tableLocalizationData = useSelector(
    (state) => state.productCategories.productCategoryLocalizationTableData
  );

  const prepareDataUpdateObject = (data) => {
    const object = {
      names: data,
      parentCategoryId: null,
      activity: tableLocalizationData?.activity ? "ACTIVE" : "INACTIVE",
    };

    return object;
  };

  const deleteProductCategoryBanner = async (data) => {
    let filteredData = tableLocalizationData.names.filter(
      (item) => item.locale !== data.locale
    );

    let dataForUpdate = prepareDataUpdateObject(filteredData);
    await dispatch(
      updateProductCategoryThunk({
        id: params?.productCategoryId,
        data: dataForUpdate,
      })
    )
      .unwrap()
      .then(() => {
        showNotification({
          message: t("deleteBanner.deleteSucessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("deleteBanner.deleteFailed"),
          color: "red",
        });
      });
    dispatch(fetchProductCategoryByIdThunk({ id: params?.productCategoryId }));

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
              onClick={() => deleteProductCategoryBanner(deleteData)}
            >
              {t("deleteBanner.okButton")}
            </Button>
          </Group>
        </Paper>
      </Modal>
    </>
  );
};

export default DeleteProductCategoryLocalizationBanner;
