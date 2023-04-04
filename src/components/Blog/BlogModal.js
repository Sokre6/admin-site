import { Button, createStyles, Modal, Stack, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { HexColorPicker } from "react-colorful";
import {
  fetchBlogByIdThunk,
  fetchBlogsThunk,
  insertNewBlogThunk,
  updateBlogThunk,
} from "../../store/slices/blog";
import { Point } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: `${theme.spacing.xs}px `,
  },
  root: {
    position: "relative",
    marginTop: 20,
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
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
}));

const BlogModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const { opened, onClose, isUpdate, updateData } = props;

  const tableData = useSelector((state) => state.blog.tableData);
  const locale = useSelector((state) => state.settings.language);

  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("blogModal.whitespaceValidation"))
      .strict(true)
      .required(t("blogModal.required"))
      .min(1, t("blogModal.nameValidation"))
      .max(255, t("blogModal.stringLenghtValidation"))
      .test("isUnique", t("blogModal.isUnique"), (value) => {
        const preparedData = tableData
          ?.filter((item) => {
            return updateData?.id ? item.id !== updateData?.id : true;
          })
          ?.flatMap((item) => {
            return item?.names?.map((item) => item.name);
          });

        const alreadyExists = preparedData.find(
          (item) =>
            item.toString().toLowerCase() === value.toString().toLowerCase()
        );

        return !alreadyExists;
      }),
    colorHexCode: Yup.string()
      .test("description", t("blogModal.hexValidation"), (hex) => {
        return /^#([0-9a-f]{3}){1,2}$/i.test(hex);
      })
      .trim(t("blogModal.whitespaceValidationHex"))
      .strict(true)

      .required(t("blogModal.requiredHex"))

      .test("isHexUnique", t("blogModal.isHexUnique"), (value) => {
        const isEdit = tableData.filter((item) =>
          updateData?.id ? item.id !== updateData.id : true
        );
        const alreadyExists = isEdit.find(
          ({ colorHexCode }) =>
            colorHexCode.toString().toLowerCase() ===
            value.toString().toLowerCase()
        );

        return !alreadyExists;
      }),
  });

  const form = useForm({
    initialValues: {
      name: "",
      colorHexCode: "",
    },
    schema: yupResolver(schema),
  });

  const prepareUpdateObject = (data, responseData) => {
    let updateDataNames = [...responseData, { locale: "en", name: data.name }];
    const object = {
      colorHexCode: data.colorHexCode,
      names: updateDataNames,
    };
    return object;
  };

  const submitForm = async (data) => {
    let updateObject = [];
    if (isUpdate) {
      await dispatch(fetchBlogByIdThunk(updateData.id))
        .unwrap()
        .then((response) => {
          updateObject = response.names.filter((item) => item.locale !== "en");
        })
        .catch((e) => {
          showNotification({
            message: t("blogModal.updateFailed"),
            color: "red",
          });
        });

      await dispatch(
        updateBlogThunk({
          id: updateData.id,
          data: prepareUpdateObject(data, updateObject),
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("blogModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("blogModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      await dispatch(insertNewBlogThunk({ locale, data }))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("blogModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("blogModal.insertFailed"),
            color: "red",
          });
        });
    }
    setColorPickerVisible(false);
    await dispatch(fetchBlogsThunk());
  };

  useEffect(() => {
    form.clearErrors();

    if (isUpdate) {
      return form.setValues({
        colorHexCode: updateData?.colorHexCode,
        name: updateData?.name,
      });
    }
  }, [updateData]);

  return (
    <Modal
      closeOnClickOutside={false}
      centered
      opened={opened}
      onClose={() => {
        form.reset();
        setColorPickerVisible(false);
        onClose();
      }}
      title={t("blogModal.modalTitle")}
      sx={(theme) => ({
        ".mantine-Modal-title": {
          fontWeight: "bold",
        },
      })}
    >
      <form onSubmit={form.onSubmit(submitForm)}>
        <TextInput
          onFocus={() => setColorPickerVisible(false)}
          label={t("blogModal.nameInputTitle")}
          placeholder={t("blogModal.nameInputPlaceholder")}
          classNames={classes}
          {...form.getInputProps("name")}
        />

        <TextInput
          sx={() => ({
            ".mantine-TextInput-icon": {
              paddingTop: 15,
            },
          })}
          onFocus={() => setColorPickerVisible(true)}
          label={t("blogModal.colorInputTitle")}
          placeholder={t("blogModal.colorInputPlaceholder")}
          classNames={classes}
          {...form.getInputProps("colorHexCode")}
          icon={
            <Point
              size={32}
              color={form.values.colorHexCode}
              fill={form.values.colorHexCode}
            />
          }
        />
        <Stack align={"flex-start"}>
          {colorPickerVisible && (
            <HexColorPicker
              style={{ width: 200, height: 150, paddingTop: 10 }}
              color={form.getInputProps("colorHexCode").value || "#0c010a"}
              {...form.getInputProps("colorHexCode")}
            />
          )}
        </Stack>
        <div className={classes.buttonContainer}>
          <Button type="submit" className={classes.insertButton}>
            {t("modalCommon.saveButton")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BlogModal;
