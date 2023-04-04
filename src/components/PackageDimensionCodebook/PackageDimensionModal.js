import { useTranslation } from "react-i18next";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";
import { Button, createStyles, Modal, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  createPackageDimensionDataThunk,
  fetchPackageDimensionDataThunk,
  updatePackageDimensionDataThunk,
} from "../../store/slices/packageDimension";

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
    alignSelf: "flex-end",
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
}));

const PackageDimensionModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const tableData = useSelector((state) => state.packageDimension.tableData);

  const schema = Yup.object().shape({
    description: Yup.string()
      .min(2, t("packageDimensionModal.nameValidation"))
      .max(256, t("packageDimensionModal.lengthValidationDescription"))
      .test("isUnique", t("packageDimensionModal.isUnique"), (value) => {
        const data = tableData?.filter((item) =>
          props?.data?.id ? item.id !== props?.data?.id : true
        );

        const alreadyExists = data?.find(
          ({ description }) =>
            description.toString().toLowerCase() ===
            value.toString().toLowerCase()
        );

        return !alreadyExists;
      })
      .trim(t("packageDimensionModal.whitespaceValidation"))
      .strict(true),
  });

  const form = useForm({
    initialValues: {
      description: "",
    },
    schema: yupResolver(schema),
  });

  const isNewPackageDimension = () => !(props?.data && props?.data?.id);

  const createPackageDimension = async (data) => {
    await dispatch(createPackageDimensionDataThunk(data))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("packageDimensionModal.insertSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("packageDimensionModal.insertFailed"),
          color: "red",
        });
      });
    dispatch(fetchPackageDimensionDataThunk());
  };

  const updatePackageDimension = async (data) => {
    await dispatch(updatePackageDimensionDataThunk(data))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("packageDimensionModal.updateSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("packageDimensionModal.updateFailed"),
          color: "red",
        });
      });
    dispatch(fetchPackageDimensionDataThunk());
  };

  const submitForm = async (data) => {
    isNewPackageDimension()
      ? createPackageDimension(data)
      : updatePackageDimension({ ...data, id: props.data?.id });
    form.reset();
    props.onClose();
  };

  useEffect(() => {
    form.clearErrors();
    form.reset();
    if (props.data) {
      form.setValues({
        description: props.data?.description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  return (
    <>
      <Modal
        centered
        opened={props.show}
        onClose={() => props.onClose()}
        title={t("packageDimensionModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("packageDimensionModal.nameInputTitle")}
            placeholder={t("packageDimensionModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("description")}
          />
          <div className={classes.buttonContainer}>
            <Button className={classes.insertButton} type="submit">
              {t("modalCommon.saveButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PackageDimensionModal;
