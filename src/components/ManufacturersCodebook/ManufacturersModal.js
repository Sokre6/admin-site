import { useTranslation } from "react-i18next";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";
import { Button, createStyles, Modal, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  createManufacturersThunk,
  fetchManufacturersThunk,
  updateManufacturersThunk,
} from "../../store/slices/manufacturers";

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

const ManufacturersModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const tableData = useSelector((state) => state.manufacturers.tableData);

  const schema = Yup.object().shape({
    name: Yup.string()
      .required(t("manufacturersModal.nameValidation"))
      .min(2, t("manufacturersModal.nameValidation"))
      .max(256,t("manufacturersModal.lengthValidation"))
      .trim(t("manufacturersModal.whitespaceValidation"))
      .strict(true)
      .test("test-id",t("manufacturersModal.isUnique"), function (value) {
        const isEdit = props.data?.id;

        const data = isEdit
          ? tableData?.filter((item) => item.id !== props.data?.id)
          : tableData;

        const alreadyExists = data?.find(
          ({ name }) =>
            name.toString().toLowerCase() === value.toString().toLowerCase()
        );

        return !alreadyExists;
      }),
  });

  const form = useForm({
    initialValues: {
      name: "",
    },
    schema: yupResolver(schema),
  });

  const isNewManufacturerItem = () => !(props?.data && props?.data?.id);

  const createManufacturers = async (data) => {
    await dispatch(createManufacturersThunk(data))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("manufacturersModal.insertSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("manufacturersModal.insertFailed"),
          color: "red",
        });
      });
    dispatch(fetchManufacturersThunk());
  };

  const updateManufacturers = async (data) => {
    await dispatch(updateManufacturersThunk(data))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("manufacturersModal.updateSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("manufacturersModal.updateFailed"),
          color: "red",
        });
      });
    dispatch(fetchManufacturersThunk());
  };

  const submitForm = async (data) => {
    isNewManufacturerItem()
      ? createManufacturers(data)
      : updateManufacturers({ ...data, id: props.data?.id });

    form.reset();
    props.onClose();
  };

  useEffect(() => {
    form.clearErrors();
    form.reset();
    if (props.data) {
      form.setValues({
        name: props.data?.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  return (
    <>
      <Modal
      closeOnClickOutside={false}
        centered
        opened={props.show}
        onClose={() => props.onClose()}
        title={t("manufacturersModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("manufacturersModal.nameInputTitle")}
            placeholder={t("manufacturersModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("name")}
          />
          <div className={classes.buttonContainer}>
            <Button className={classes.insertButton} type="submit">
              {isNewManufacturerItem()
                ? t("manufacturersModal.insertButton")
                : t("manufacturersModal.updateButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManufacturersModal;
