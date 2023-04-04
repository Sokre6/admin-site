import { useForm, yupResolver } from "@mantine/form";
import { createStyles, Modal, Button, TextInput, Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import { languages } from "../LanguageCodebook/languages";
import { insertNewQuestionCategoryThunk } from "../../store/slices/questionCategory";
import {
  fetchProductCategoryByIdThunk,
  insertProductCategoryThunk,
  updateProductCategoryThunk,
} from "../../store/slices/productCategory";
import { useParams } from "react-router-dom";
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

const ProductCategoryLocalizationTableModal = (props) => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  let params = useParams();

  const tableLocalizationData = useSelector(
    (state) => state.productCategories.productCategoryLocalizationTableData
  );
  const languageData = useSelector((state) => state.language.tableData);
  const isNewProductCategoryLocaleItem = () => !props?.data;

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("productCategoryLocalizationModal.nameValidation"))
      .trim(t("productCategoryLocalizationModal.whitespaceValidation"))
      .strict(true),
    locale: Yup.string().min(
      2,
      t("productCategoryLocalizationModal.localeValidation")
    ),
  });

  const form = useForm({
    initialValues: {
      name: "",
      locale: "",
    },
    schema: yupResolver(schema),
  });

  const parseLanguage = (languages) => {
    let locales = tableLocalizationData.names.map(({ locale }) => {
      return locale;
    });
    let mappedLanguage = languages.map(({ code }) => {
      return code;
    });
    let filteredLanguage = mappedLanguage.filter(
      (item) => !locales.includes(item)
    );

    return parseLanguageNames(languages,filteredLanguage);
  };

  const prepareDataUpdateObject = (data) => {
    const object = {
      names: data,
      parentCategoryId: null,
      activity: tableLocalizationData?.activity ? "ACTIVE" : "INACTIVE",
    };
    return object;
  };

  const createProductLocalizationItem = async (data) => {
    let updateData = [...tableLocalizationData.names, data];
    let dataForUpdate = prepareDataUpdateObject(updateData);
    await dispatch(
      updateProductCategoryThunk({
        id: params?.productCategoryId,
        data: dataForUpdate,
      })
    )
      .unwrap()
      .then(() => {
        showNotification({
          message: t("productCategoryLocalizationModal.insertSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("productCategoryLocalizationModal.insertFailed"),
          color: "red",
        });
      });

    dispatch(fetchProductCategoryByIdThunk({ id: params?.productCategoryId }));
  };

  const updateProductLocalizationItem = async (data) => {
    let updateData = tableLocalizationData.names.filter(
      (item) => item.locale !== data.locale
    );

    updateData = [...updateData, data];
    let dataForUpdate = prepareDataUpdateObject(updateData);
    await dispatch(
      updateProductCategoryThunk({
        id: params?.productCategoryId,
        data: dataForUpdate,
      })
    )
      .unwrap()
      .then(() => {
        showNotification({
          message: t("productCategoryLocalizationModal.updateSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("productCategoryLocalizationModal.updateFailed"),
          color: "red",
        });
      });

    dispatch(fetchProductCategoryByIdThunk({ id: params?.productCategoryId }));
  };

  const submitForm = async (data) => {
    isNewProductCategoryLocaleItem()
      ? createProductLocalizationItem(data)
      : updateProductLocalizationItem(data);
    form.reset();
    props.onClose();
  };

  useEffect(() => {
    form.clearErrors();

    if (props.data) {
      form.setValues({
        name: props.data.name,
        locale: props.data.locale,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
  return (
    <>
      <Modal
      closeOnClickOutside={false}
        centered
        opened={props.show}
        onClose={() => {
          form.reset();
          props.onClose();
        }}
        title={t("productCategoryLocalizationModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("productCategoryLocalizationModal.nameInputTitle")}
            placeholder={t(
              "productCategoryLocalizationModal.nameInputPlaceholder"
            )}
            classNames={classes}
            {...form.getInputProps("name")}
          />

          <Select
            disabled={props.data}
            style={{ marginTop: 20, zIndex: 2 }}
            data={parseLanguage(languageData)}
            label={t("productCategoryLocalizationModal.locale")}
            placeholder={t(
              "productCategoryLocalizationModal.localePlaceholder"
            )}
            classNames={classes}
            searchable
            {...form.getInputProps("locale", { type: "select" })}
          />
          <div className={classes.buttonContainer}>
            <Button type="submit" className={classes.insertButton}>
              {isNewProductCategoryLocaleItem()
                ? t("productCategoryLocalizationModal.insertButton")
                : t("productCategoryLocalizationModal.updateButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProductCategoryLocalizationTableModal;
