import { useForm, yupResolver } from "@mantine/form";
import { createStyles, Modal, Button, TextInput, Select } from "@mantine/core";
import { RichTextEditor } from "@mantine/rte";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import { languages } from "../LanguageCodebook/languages";
import {
  fetchProductByIdThunk,
  updateProductThunk,
} from "../../store/slices/product";
import { parseLanguageNames } from "../common/parseLanguageNames";
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
    zIndex: 2,
  },
  errorText: {
    color: "#f03e3e",
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

  switch: {
    color: theme.colors.colorBlack,
    "& *": {
      cursor: "pointer",
    },
  },

  insertButton: {
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
  title: {
    lineHeight: 1,
  },
  item: {
    "& + &": {
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },
  },
  modalTitle: {
    fontWeight: "bold",
  },
  selectInput: {
    marginTop: 20,
    zIndex: 2,
  },
}));

const ProductsLocalizationModal = ({
  opened,
  onClose,
  updateData,
  isUpdate,
  modalData,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const tableData = useSelector((state) => state.product.productData);
  const languageData = useSelector((state) => state.language.tableData);
  let params = useParams();

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("productModal.whitespaceValidation"))
      .strict(true)
      .required(t("productModal.categoryValidation"))
      .min(1, t("productModal.nameValidation"))
      .max(255, t("productModal.stringLenghtValidation")),
    locale: Yup.string().min(2, t("productModal.codeValidation")),
    description: Yup.string().test(
      "description",
      t("productModal.descriptionValidation"),
      function (value) {
        return value === "<p><br></p>" ? false : true;
      }
    ),
  });

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      locale: "",
    },
    schema: yupResolver(schema),
  });
  const prepareItemForInsert = (data, itemForUpdate) => {
    var descriptions = [];
    var names = [];
    if (itemForUpdate.descriptions !== []) {
      descriptions = itemForUpdate.descriptions.filter(
        (item) => item.locale !== data.locale
      );
    }
    descriptions = [
      ...descriptions,
      { locale: data.locale, description: data.description },
    ];
    if (itemForUpdate.names !== []) {
      names = itemForUpdate.names.filter((item) => item.locale !== data.locale);
    }
    names = [...names, { locale: data.locale, name: data.name }];
    var objUpdate = { ...itemForUpdate };
    objUpdate["names"] = names;
    objUpdate["descriptions"] = descriptions;
    return objUpdate;
  };
  const submitForm = async (data) => {
    var updateObject = [];
    var updateData = [];
    await dispatch(fetchProductByIdThunk(params.productId))
      .unwrap()
      .then((response) => {
        updateData = response;
      })
      .catch((e) => {
        showNotification({
          message: t("productLocalizationModal.saveFailed"),
          color: "red",
        });
      });
    if (isUpdate) {
      updateObject = prepareItemForInsert(data, updateData);
      await dispatch(
        updateProductThunk({ updateData: updateObject, updateObject })
      )
        .unwrap()
        .then(() => {
          showNotification({
            message: t("productLocalizationModal.updateSuccessfull"),
            color: "green",
          });
          form.reset();
          onClose();
        })
        .catch((e) => {
          showNotification({
            message: t("productLocalizationModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      updateObject = prepareItemForInsert(data, updateData);
      await dispatch(updateProductThunk({ updateData, updateObject }))
        .unwrap()
        .then(() => {
          showNotification({
            message: t("productLocalizationModal.updateSuccessfull"),
            color: "green",
          });
          form.reset();
          onClose();
        })
        .catch((e) => {
          showNotification({
            message: t("productLocalizationModal.updateFailed"),
            color: "red",
          });
        });
    }
    await dispatch(fetchProductByIdThunk(updateData.id));
  };
  const parseLanguage = (languages) => {
    var locales = tableData.map(({ locale }) => {
      return locale;
    });
    var mappedLanguage = languages.map(({ code }) => {
      return code;
    });
    var filteredLanguage = mappedLanguage.filter(
      (item) => !locales.includes(item)
    );
    return parseLanguageNames(languages,filteredLanguage);
  };

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        description: updateData.description,
        name: updateData.name,
        locale: updateData.locale,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);

  return (
    <Modal
    closeOnClickOutside={false}
      centered
      opened={opened}
      onClose={() => {
        form.reset();
        onClose();
      }}
      title={t("productLocalizationModal.title")}
      classNames={{ title: classes.modalTitle }}
    >
      <form onSubmit={form.onSubmit(submitForm)}>
        <TextInput
          classNames={classes}
          label={t("productLocalizationModal.nameLabel")}
          placeholder={t("productLocalizationModal.namePlaceholder")}
          {...form.getInputProps("name")}
        />
        <RichTextEditor
          classNames={classes}
          sx={(theme) => ({
            ".ql-action::before": {
              background: theme.colors.colorDarkGray,
              wordBreak: "keep-all",
            },
          })}
          label={t("productLocalizationModal.descriptionLabel")}
          placeholder={t("productLocalizationModal.descriptionPlaceholder")}
          {...form.getInputProps("description")}
        />
        {form.errors.description !== null ? (
          <p className={classes.errorText}>{form.errors.description}</p>
        ) : (
          " "
        )}
        <Select
          disabled={isUpdate}
          className={classes.selectInput}
          data={parseLanguage(languageData)}
          label={t("currencyLocaleModal.locale")}
          placeholder={t("currencyModal.codeInputPlaceholder")}
          classNames={classes}
          searchable
          {...form.getInputProps("locale", { type: "select" })}
        />
        <div className={classes.buttonContainer}>
          <Button type="submit" className={classes.insertButton}>
            {t("modalCommon.saveButton")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductsLocalizationModal;
