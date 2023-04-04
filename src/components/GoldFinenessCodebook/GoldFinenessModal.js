import { useTranslation } from "react-i18next";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";
import { Button, createStyles, Modal, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  createGoldFinenessThunk,
  fetchGoldFinenessDataThunk,
  updateGoldFinenessThunk,
} from "../../store/slices/goldFineness";
import { useEffect } from "react";

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

const GoldFinesessModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const tableData = useSelector((state) => state.goldFineness.tableData);
  const schema = Yup.object().shape({
    name: Yup.string()
      .max(256, t("goldFinenessModal.lengthValidation"))
      .test("len", t("goldFinenessModal.nameValidation"), (val) => {
        let checkStringEnd = val.substring(val.length - 5);

        if (checkStringEnd !== "/1000") {
          return false;
        }
        if (val.length < 8) {
          return false;
        } else return true;
      })
      .test("isUnique", t("goldFinenessModal.isUnique"), (value) => {
        const isEdit = props.data?.id;

        const data = isEdit
          ? tableData?.filter((item) => item.id !== props.data?.id)
          : tableData;

        const alreadyExists = data.find(
          ({ name }) =>
            name.toString().toLowerCase() === value.toString().toLowerCase()
        );

        return !alreadyExists;
      })
      .matches(/^\S*$/, t("goldFinenessModal.whitespaceValidation")),
  });

  const form = useForm({
    initialValues: {
      name: "",
    },
    schema: yupResolver(schema),
  });

  const isNewGoldFinenessItem = () => !(props.data && props.data.id);

  const createGoldFineness = async (data) => {
    await dispatch(createGoldFinenessThunk(data))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("goldFinenessModal.insertSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("goldFinenessModal.insertFailed"),
          color: "red",
        });
      });
    dispatch(fetchGoldFinenessDataThunk());
  };
  const updateGoldFineness = async (data) => {
    await dispatch(updateGoldFinenessThunk(data))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("goldFinenessModal.updateSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("goldFinenessModal.updateFailed"),
          color: "red",
        });
      });
    dispatch(fetchGoldFinenessDataThunk());
  };

  const submitForm = async (data) => {
    isNewGoldFinenessItem()
      ? createGoldFineness(data)
      : updateGoldFineness({ ...data, id: props.data.id });
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
        title={t("goldFinenessModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("goldFinenessModal.nameInputTitle")}
            placeholder={t("goldFinenessModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("name")}
          />

          <div className={classes.buttonContainer}>
            <Button className={classes.insertButton} type="submit">
              {isNewGoldFinenessItem()
                ? t("goldFinenessModal.insertButton")
                : t("goldFinenessModal.updateButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default GoldFinesessModal;
