import { useForm, yupResolver } from "@mantine/form";
import {
  createStyles,
  Modal,
  Button,
  TextInput,
  Switch,
  Group,
  Text,
  NumberInput,
  Select,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import {
  fetchProductCategoryDataThunk,
  insertProductCategoryThunk,
  updateProductCategoryThunk,
} from "../../store/slices/productCategory";

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
    marginTop: 20,
    zIndex: 2,
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
}));

const ProductCategoryModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const locale = useSelector((state) => state.settings.language);
  const parentCategory = useSelector(
    (state) => state.productCategories.tableData
  );

  const productCategoryByIdData = useSelector(
    (state) => state.productCategories.productCategoryLocalizationTableData
  );

  const tableData = useSelector((state) => state.productCategories.tableData);

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("productCategoryModal.nameValidation"))
      .max(256, t("productCategoryModal.lengthValidation"))
      .test("isUnique", t("productCategoryModal.isUnique"), (value) => {
        const preparedData = tableData
          ?.filter((item) => {
            return props?.data?.id ? item.id !== props?.data?.id : true;
          })
          ?.flatMap((item) => {
            return item?.names?.map((item) => item.name);
          });
        const alreadyExists = preparedData?.find(
          (item) =>
            item.toString().toLowerCase() === value.toString().toLowerCase()
        );

        return !alreadyExists;
      })
      .trim(t("productCategoryModal.whitespaceValidation"))
      .strict(true),
    ordinalNumber: Yup.number().test(
      "len",
      t("productCategoryModal.isUniqueOrdinalNumber"),
      (value) => {
        const isEdit = props.data?.id;

        const data = isEdit
          ? tableData?.filter((item) => item.id !== props.data?.id)
          : tableData;

        const parentCategories = data.filter((item) => !item.parentCategory);
        const childCategories = data.filter((item) => !!item.parentCategory);

        const checkUniqueOrdinalNumber = (form) => {
          if (!form?.values?.parentCategoryId) {
            const ifOrdinalNumberExists = parentCategories.find(
              (item) => Number(item?.ordinalNumber) === Number(value)
            );
            return !ifOrdinalNumberExists;
          } else {
            const findWithIdData = childCategories.filter(
              ({ parentCategory }) =>
                parentCategory?.id === form?.values?.parentCategoryId
            );
         

            const ifOrdinalNumberExists = findWithIdData.find(
              (item) => Number(item?.ordinalNumber) === Number(value)
            );
            return !ifOrdinalNumberExists;
          }
        };

        return checkUniqueOrdinalNumber(form);
      }
    ),
  });

  const isNewProductCategoryItem = () => !(props?.data && props?.data.id);

  const form = useForm({
    initialValues: {
      name: "",
      parentCategoryId: null,
      ordinalNumber: null,
      activity: false,
    },
    schema: yupResolver(schema),
  });

  const getLocalizedParentCategory = (inputArray) => {
    let defaultName = "";
    let localizedName = "";
    for (let i = 0; i < inputArray.length; i++) {
      if (inputArray[i].locale === locale) {
        localizedName = inputArray[i].name;
      } else if (inputArray[i].locale === "en") {
        defaultName = inputArray[i].name;
      }
    }
    return localizedName !== "" ? localizedName : defaultName;
  };

  const prepareParentCategories = () => {
    let parentCategoriesArray = [];

    const filteredData = parentCategory.filter((item) =>
      props?.data ? item.parentCategory?.id !== props?.data?.id : item
    );

    if (parentCategory === []) {
      return [];
    } else {
      for (let i = 0; i < filteredData.length; i++) {
        parentCategoriesArray.push({
          label: getLocalizedParentCategory(filteredData[i].names),
          value: filteredData[i].id,
          disabled:
            getLocalizedParentCategory(filteredData[i].names) ===
            props.data?.name,
        });
      }

      return parentCategoriesArray;
    }
  };

  const prepareDataForInsert = (data) => {
    return {
      names: [
        {
          locale: "en",
          name: data.name,
        },
      ],
      ordinalNumber: data.ordinalNumber,
      parentCategoryId: data.parentCategoryId || null,
      activity: data.activity ? "ACTIVE" : "INACTIVE",
    };
  };

  const prepareDataForUpdate = (data) => {
    let updateData = productCategoryByIdData.names
      ? productCategoryByIdData.names.filter((item) => item.locale !== "en")
      : [];

    updateData = [...updateData, { locale: "en", name: data.name }];

    return {
      names: updateData,
      ordinalNumber: data.ordinalNumber,
      parentCategoryId: data.parentCategoryId || null,
      activity: data.activity ? "ACTIVE" : "INACTIVE",
    };
  };

  const createProductCategory = async (data) => {
    await dispatch(insertProductCategoryThunk(data))
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
    dispatch(fetchProductCategoryDataThunk());
  };

  const updateProductCategory = async (data) => {
    await dispatch(
      updateProductCategoryThunk({ id: props.data?.id, data: data })
    )
      .unwrap()
      .then(() => {
        showNotification({
          message: t("productCategoryModal.updateSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("productCategoryModal.updateFailed"),
          color: "red",
        });
      });
    dispatch(fetchProductCategoryDataThunk());
  };

  const submitForm = async (data) => {
    let dataForInsert = prepareDataForInsert(data);

    let dataForUpdate = prepareDataForUpdate(data);

    isNewProductCategoryItem()
      ? createProductCategory(dataForInsert)
      : updateProductCategory(dataForUpdate);

    form.reset();
    props.onClose();
  };

  useEffect(() => {
    form.clearErrors();

    form.reset();
    if (props.data) {
      form.setValues({
        name: props?.data?.name,
        parentCategoryId: productCategoryByIdData.parentCategoryId || null,
        ordinalNumber: props?.data?.ordinalNumber,
        activity: props?.data?.activity === "ACTIVE" ? true : false,
      });
    }
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
        title={t("productCategoryModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("productCategoryModal.nameInputTitle")}
            placeholder={t("productCategoryModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("name")}
          />
          <Select
            classNames={classes}
            label={t("productCategoryModal.superiorityInputTitle")}
            placeholder={t("productCategoryModal.superiorityInputPlaceholder")}
            data={prepareParentCategories()}
            clearable
            searchable
            {...form.getInputProps("parentCategoryId", { type: "select" })}
          />
          <NumberInput
            classNames={classes}
            min={1}
            label={t("productCategoryModal.ordinalNumberInputTitle")}
            placeholder={t(
              "productCategoryModal.ordinalNumberInputPlaceholder"
            )}
            {...form.getInputProps("ordinalNumber")}
          />
          <Group
            position="apart"
            style={{
              marginTop: 20,
              zIndex: 2,
              paddingLeft: "12px",
              //paddingRight: "12px",
            }}
            noWrap
            spacing="xl"
          >
            <div>
              <Text>{t("productCategoryModal.activityTitle")}</Text>
              <Text size="xs" color="dimmed">
                {t("productCategoryModal.activityText")}
              </Text>
            </div>
            <Switch
              sx={(theme) => ({
                width: "100px",
                ".mantine-1mx6z95:checked": {
                  background: theme.colors.colorBlack,
                  borderColor: theme.colors.colorBlack,
                },
                ".mantine-1mx6z95:checked::before": {
                  background: theme.colors.colorLightGray,
                  borderColor: theme.colors.colorLightGray,
                },
                ".mantine-1mx6z95::before": {
                  background: theme.colors.colorGray,
                  borderColor: theme.colors.colorGray,
                },
              })}
              className={classes.switch}
              size="lg"
              {...form.getInputProps("activity", { type: "checkbox" })}
            />
          </Group>

          <div className={classes.buttonContainer}>
            <Button type="submit" className={classes.insertButton}>
              {isNewProductCategoryItem()
                ? t("productCategoryModal.insertButton")
                : t("productCategoryModal.updateButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProductCategoryModal;
