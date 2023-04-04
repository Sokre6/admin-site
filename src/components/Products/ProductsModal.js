import React, { useRef } from "react";
import { useForm, yupResolver } from "@mantine/form";
import {
  createStyles,
  Modal,
  Button,
  TextInput,
  Select,
  NumberInput,
  Image,
  Loader,
  Group,
  Text,
  Stack,
  Box,
  ActionIcon,
} from "@mantine/core";
import { useState } from "react";
import { RichTextEditor } from "@mantine/rte";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { fetchProductCategoryDataThunk } from "../../store/slices/productCategory";

import { fetchGoldFinenessDataThunk } from "../../store/slices/goldFineness";
import { fetchManufacturersThunk } from "../../store/slices/manufacturers";
import { showNotification } from "@mantine/notifications";
import {
  fetchProductDataThunk,
  updateProductThunk,
} from "../../store/slices/product";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { insertNewFileThunk } from "../../store/slices/file";
import images from "../../assets/images/index";

import { ArrowsLeftRight } from "tabler-icons-react";
import { fetchCountriesDataThunk } from "../../store/slices/countries";
import ProductPictureCard from "./ProductPicture/ProductPictureCard";

const useStyles = createStyles((theme) => ({
  buttonContainer: {
    display: "flex",

    justifyContent: "flex-end",
    paddingTop: `${theme.spacing.xs}px `,
    paddingRight: "10px",
  },
  root: {
    position: "relative",
    marginTop: 20,
    zIndex: 2,
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

  modalRoot: {
    width: "40vw",
  },
  formContainer: {
    display: "flex",
  },
  leftFormContainer: {
    width: "50%",
    padding: "10px",
  },
  rightFormContainer: {
    width: "50%",
    padding: "10px",
  },
  bottomFormContainer: {
    width: "100%",
    padding: "10px",
  },
  mainPictureContainer: {
    width: "100%",
    display: "flex",

    flexWrap: "none",
  },
  pictureUploadContainer: {
    width: "10%",
    marginRight: "15px",
    padding: "10px",
  },
  picturesContainers: {
    width: "90%",
    display: "flex",

    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  richTextEditorStyle: {
    height: "20vh",
  },
  errorText: {
    color: "#f03e3e",
  },
  errorRichText: {
    color: "#f03e3e",
    borderColor: "#f03e3e",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "red",
    backgroundColor: "red",
  },
  addNewPictureImg: {
    width: "4vw",
    height: "10vh",
  },
  dropzoneHidden: {
    display: "none",
  },
  skuDataContainer: {
    paddingLeft: "10px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    fontSize: "13px",
  },
  skuLabel: {
    marginLeft: "10px",
    fontWeight: "bold",
    flex: "0 0 100px",
  },
}));

const ProductsModal = ({ opened, onClose, updateData, isUpdate }) => {
  const locale = useSelector((state) => state.settings.language);
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.productCategories.tableData);
  const manufacturers = useSelector((state) => state.manufacturers.tableData);
  const finesess = useSelector((state) => state.goldFineness.tableData);
  const openRef = useRef(null);

  const countries = useSelector((state) => state.countries?.tableData);

  const filteredCountriesOfOrigin = countries.filter(
    (item) => item.activity === "ACTIVE" && item?.applicability?.countryOfOrigin
  );

  const packageDimensions = useSelector(
    (state) => state.packageDimension.tableData
  );
  const productMaterials = useSelector(
    (state) => state.productMaterial.tableData
  );
  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("productModal.whitespaceValidation"))
      .strict(true)
      .required(t("productModal.categoryValidation"))
      .min(1, t("productModal.nameValidation"))
      .max(255, t("productModal.stringLenghtValidation")),
    categoryId: Yup.string()
      .required(t("productModal.categoryValidation"))
      .nullable()
      .test(
        "isEmptyCategory",
        t("productModal.categoryValidation"),
        function (value) {
          return categories?.find((element) =>
            element?.id === value ? true : false
          );
        }
      ),
    description: Yup.string().test(
      "description",
      t("productModal.descriptionValidation"),
      function (value) {
        return value === "<p><br></p>" ? false : true;
      }
    ),
    dimension: Yup.string().max(
      255,
      t("productModal.dimensionLenghtValidation")
    ),
    packageDimensionId: "",
    countryOfOriginCode: Yup.string()
      .min(2, t("productModal.countryValidation"))
      .test(
        "isEmptyCountry",
        t("productModal.countryValidation"),
        function (value) {
          return filteredCountriesOfOrigin?.find((element) =>
            element?.countryCode === value ? true : false
          );
        }
      ),
    finenessId: "",
    materialId: "",
    manufacturerId: "",
    weight: Yup.number()
      .typeError(t("productModal.positiveNumberValidation"))
      .min(0, t("productModal.positiveNumberValidation"))
      .max(2147483647, t("productModal.maxNumberValidation")),
    status: Yup.string().min(2, t("productModal.statusValidation")),
  });

  const form = useForm({
    initialValues: {
      name: "",
      categoryId: "",
      description: "",
      dimension: "",
      packageDimensionId: "",
      countryOfOriginCode: "",
      finenessId: "",
      materialId: "",
      manufacturerId: "",
      mass: "",
      status: "",
      pictures: [],
    },
    schema: yupResolver(schema),
  });

  const prepareNamesForUpdate = (names, name) => {
    var filteredNames = names.filter((item) => item.locale !== "en");
    filteredNames = [...filteredNames, { locale: "en", name: name }];
    return filteredNames;
  };
  const prepareDescriptionsForUpdate = (categories, name) => {
    var filteredCategories = categories.filter((item) => item.locale !== "en");
    filteredCategories = [
      ...filteredCategories,
      { locale: "en", description: name },
    ];
    return filteredCategories;
  };

  const prepareUpdateObject = (formData, oldData, photoIds) => {
    var object = {
      categoryId: formData.categoryId,
      names: prepareNamesForUpdate(oldData.names, formData.name),
      descriptions: prepareDescriptionsForUpdate(
        oldData.descriptions,
        formData.description
      ),
      dimension: formData.dimension,
      packageDimensionId: packageDimensions?.find(
        (element) => element?.id === formData?.packageDimensionId
      )
        ? formData?.packageDimensionId
        : null,
      countryOfOriginCode: formData.countryOfOriginCode,
      finenessId: finesess.find(
        (element) => element?.id === formData?.finenessId
      )
        ? formData.finenessId
        : null,
      manufacturerId: manufacturers.find(
        (element) => element?.id === formData?.manufacturerId
      )
        ? formData.manufacturerId
        : null,
      weight: formData.weight,
      materialId: formData.materialId,
      status: formData.status,
      photoIds: photoIds,
      version: oldData?.version,
    };
    return object;
  };

  const productDataById = useSelector(
    (state) => state.product?.productDataById
  );

  const [uploadedImages, setUploadedImages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const uploadImage = async (files) => {
    
    setIsLoading(true);
    files.forEach(async (file) => {
      
      const formData = new FormData();

      formData.append("file", file, file.name);

      await dispatch(insertNewFileThunk(formData))
        .unwrap()
        .then((response) => {
          const url = response.location;
          const id = url.substring(url.lastIndexOf("/") + 1, url.length);
         
          setUploadedImages((prev) => [
            ...prev,
            { ...response, id, name: id, file: file },
          ]);
         
        });
        setIsLoading(false);
    });
  
  };
  const [isSubmit, setIsSubmit] = useState(false);
  const submitForm = async (data) => {
    setIsSubmit(true);
    const photoIds = uploadedImages?.map((image) => image.id);
    if (photoIds.length > 6) {
      setIsSubmit(false);
      return showNotification({
        message: t("productModal.imgError"),
        color: "red",
      });
    }
    var updateObject = prepareUpdateObject(data, updateData, photoIds);
    await dispatch(updateProductThunk({ updateData, updateObject }))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("productModal.updateSuccessfull"),
          color: "green",
        });
        form.reset();
        onClose();
      })
      .catch((error) => {
        if (error === 412) {
          showNotification({
            message: t("productModal.error_412"),
            color: "red",
          });
        } else {
          showNotification({
            message: t("productModal.updateFailed"),
            color: "red",
          });
        }
      });
    await dispatch(fetchProductDataThunk());

    setIsSubmit(false);
    setUploadedImages([]);
  };

  const getLocalizedName = (inputArray) => {
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
  const prepareCategoriesForSelect = () => {
    return categories.map((element) => ({
      label: getLocalizedName(element.names),
      value: element.id,
    }));
  };
  const preparePackageDimenision = () => {
    return packageDimensions.map((element) => ({
      label: element.description,
      value: element.id,
    }));
  };
  const prepareCountryOfOrigin = () => {
    return filteredCountriesOfOrigin.map((element) => ({
      label: getLocalizedName(element.countryNames),
      value: element.countryCode,
    }));
  };
  const prepareManufacturer = () => {
    return manufacturers.map((element) => ({
      label: element.name,
      value: element.id,
    }));
  };
  const prepareMaterial = () => {
    return productMaterials.map((element) => ({
      label: getLocalizedName(element.names),
      value: element.id,
    }));
  };
  const prepareFiness = () => {
    return finesess.map((element) => ({
      label: element.name,
      value: element.id,
    }));
  };
  const prepareStatus = () => {
    return [
      { label: "DRAFT", value: "DRAFT" },
      { label: "ACTIVE", value: "ACTIVE" },
      { label: "INACTIVE", value: "INACTIVE" },
    ];
  };

  useEffect(() => {
    dispatch(fetchProductCategoryDataThunk());
    dispatch(fetchProductCategoryDataThunk());

    dispatch(fetchGoldFinenessDataThunk());
    dispatch(fetchManufacturersThunk());
    dispatch(fetchCountriesDataThunk());

    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        name: updateData.name,
        categoryId: updateData.categoryId,
        description: updateData.description,
        dimension: updateData.dimension,
        packageDimensionId: updateData.packageDimensionId,
        countryOfOriginCode: updateData.countryOfOriginCode,
        finenessId: updateData.finenessId,
        materialId: updateData.materialId,
        manufacturerId: updateData.manufacturerId,
        weight: updateData.weight,
        status: updateData.status,
      });

      setUploadedImages(!!productDataById.photos ? productDataById.photos : []);
    }
  }, [updateData]);

  const deletePicture = (id) => {
    //napomena!!! trenutno nije podrzano brisanje slike s apija

    setUploadedImages((prev) => prev.filter((picture) => picture.id !== id));
  };

  const renderPhotos = uploadedImages.map((image, index) => {
    return (
      <Group key={index} spacing={"xs"}>
        <ProductPictureCard
          key={index}
          image={image}
          alt={image}
          name={image}
          onDelete={deletePicture}
        />
        {uploadedImages.length > 1 && index !== uploadedImages.length - 1 ? (
          <Stack>
            <ActionIcon
              onClick={() =>
                setUploadedImages((prev) => {
                  const tempArray = [...prev];
                  const tempValue = tempArray[index + 1];
                  tempArray[index + 1] = tempArray[index];
                  tempArray[index] = tempValue;
                  return tempArray;
                })
              }
            >
              <ArrowsLeftRight />
            </ActionIcon>
          </Stack>
        ) : null}
      </Group>
    );
  });

  const addPictures = (image) => {
    if (image.length + uploadedImages.length > 6) {
      showNotification({
        message: t("productModal.imgError"),
        color: "red",
      });
    } else {
      uploadImage(image);
    }
  };

  return (
    <Modal
      closeOnClickOutside={false}
      centered
      opened={opened}
      onClose={() => {
        setIsSubmit(false);
        setUploadedImages([]);
        form.reset();
        onClose();
      }}
      title={t("productModal.title")}
      classNames={{ title: classes.modalTitle, modal: classes.modalRoot }}
    >
      <form onSubmit={form.onSubmit(submitForm)}>
        {isUpdate ? (
          <Stack>
            <div style={{ display: "flex" }}>
              <Text className={classes.skuLabel}>{"SKU name: "}</Text>
              <Text className={classes.skuData}>{updateData.skuName}</Text>
            </div>
            <div style={{ display: "flex" }}>
              <Text className={classes.skuLabel}>{"SKU ID: "}</Text>
              <Text className={classes.skuData}>{updateData.skuId}</Text>
            </div>
          </Stack>
        ) : (
          ""
        )}
        <div className={classes.formContainer}>
          <div className={classes.leftFormContainer}>
            <TextInput
              classNames={classes}
              label={t("productModal.nameLabel")}
              placeholder={t("productModal.namePlaceholder")}
              {...form.getInputProps("name")}
            />
            <TextInput
              classNames={classes}
              label={t("productModal.dimensionLabel")}
              placeholder={t("productModal.dimensionPlaceholder")}
              {...form.getInputProps("dimension")}
            />
            <Select
              classNames={classes}
              data={prepareCountryOfOrigin()}
              searchable
              label={t("productModal.countryOfOriginLabel")}
              placeholder={t("productModal.countryOfOriginPLaceholder")}
              {...form.getInputProps("countryOfOriginCode")}
            />
            <Select
              classNames={classes}
              data={prepareMaterial()}
              searchable
              clearable
              label={t("productModal.materialLabel")}
              placeholder={t("productModal.materialPlaceholder")}
              {...form.getInputProps("materialId")}
            />
            <NumberInput
              label={t("productModal.massLabel")}
              placeholder={t("productModal.massPlaceholder")}
              classNames={classes}
              precision={4}
              min={0.0001}
              {...form.getInputProps("weight")}
            />
          </div>
          <div className={classes.rightFormContainer}>
            <Select
              classNames={classes}
              data={prepareCategoriesForSelect()}
              searchable
              label={t("productModal.categoryLabel")}
              placeholder={t("productModal.categoryDescription")}
              {...form.getInputProps("categoryId", { type: "select" })}
            />
            <Select
              classNames={classes}
              data={preparePackageDimenision()}
              searchable
              label={t("productModal.packageDimensionLabel")}
              placeholder={t("productModal.packageDimensionPlaceholder")}
              {...form.getInputProps("packageDimensionId")}
            />
            <Select
              classNames={classes}
              data={prepareFiness()}
              searchable
              clearable
              label={t("productModal.finessLabel")}
              placeholder={t("productModal.finessPlaceholder")}
              {...form.getInputProps("finenessId")}
            />
            <Select
              classNames={classes}
              data={prepareManufacturer()}
              searchable
              clearable
              label={t("productModal.manufacturerLabel")}
              placeholder={t("productModal.manufacturerPlaceholder")}
              {...form.getInputProps("manufacturerId")}
            />
            <Select
              classNames={classes}
              data={prepareStatus()}
              searchable
              label={t("productModal.statusLabel")}
              placeholder={t("productModal.statusPlaceholder")}
              {...form.getInputProps("status")}
            />
          </div>
        </div>
        <div className={classes.bottomFormContainer}>
          <RichTextEditor
            classNames={classes}
            sx={(theme) => ({
              ".ql-action::before": {
                background: theme.colors.colorDarkGray,
                wordBreak: "keep-all",
              },
            })}
            label={t("productModal.descriptionLabel")}
            placeholder={t("productModal.descriptionPlaceholder")}
            {...form.getInputProps("description")}
          />
          {form.errors.description !== null ? (
            <p className={classes.errorText}>{form.errors.description}</p>
          ) : (
            " "
          )}
        </div>
        <Group sx={{ alignItems: "flex-start" }} noWrap>
          <Image
            src={images.addPicture}
            width={120}
            fit="cover"
            alt="logo"
            onClick={() => openRef.current()}
            sx={{ cursor: "pointer", padding: 8 }}
          />
          <Group>
            {renderPhotos}
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: 120,
                  height: 100,
                  alignItems: "center",
                }}
              >
                <Loader />
              </Box>
            )}
          </Group>
        </Group>

        <Dropzone
          maxSize={1000000}
          onReject={() =>
            showNotification({
              message: t("productModal.imgSizeError"),
              color: "red",
            })
          }
          onDrop={addPictures}
          openRef={openRef}
          className={classes.dropzoneHidden}
          accept={IMAGE_MIME_TYPE}
        >
          {function dropzoneContent() {
            return (
              <>
                <div></div>
              </>
            );
          }}
        </Dropzone>
        <div className={classes.buttonContainer}>
          <Button
            loading={isSubmit}
            type="submit"
            className={classes.insertButton}
          >
            {t("modalCommon.saveButton")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductsModal;
