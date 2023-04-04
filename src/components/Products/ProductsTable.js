import React, { useState, useEffect, useMemo } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Button,
  LoadingOverlay,
  Tooltip,
} from "@mantine/core";
import {
  Selector,
  ChevronDown,
  ChevronUp,
  Search,
  Pencil,
  World,
  Package,
  PackageOff,
} from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductByIdThunk,
  fetchProductDataThunk,
  updateProductThunk,
} from "../../store/slices/product";
import { fetchProductCategoryDataThunk } from "../../store/slices/productCategory";
import * as dayjs from "dayjs";
import ProductModal from "./ProductsModal";
import { fetchManufacturersThunk } from "../../store/slices/manufacturers";
import { fetchGoldFinenessDataThunk } from "../../store/slices/goldFineness";
import { fetchPackageDimensionDataThunk } from "../../store/slices/packageDimension";
import { fetchProductMaterialDataThunk } from "../../store/slices/productMaterial";
import TableCell from "../common/TableCell";
import CustomLoader from "../common/CustomLoader";
import { fetchCountriesDataThunk } from "../../store/slices/countries";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },
  tableStyle: {
    tableLayout: "fixed",
    minWidth: 700,
  },
  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor: theme.colors.colorLightGray,
    },
  },
  scrollArea: {
    height: "85vh",
  },
  searchAndButtonContainter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
  },
  searchInput: {
    width: "25vw",
    marginBottom: "0px !important",
  },
  buttonContainer: {
    display: "flex",
    width: "280px",
    paddingRight: "16px",
    flexWrap: "wrap",
    "@media (max-width: 1150px)": {
      flexDirection: "column",
    },
  },
  insertButton: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
  buttonColumn: {
    width: "300px !important",
  },
  tableIconsButton: {
    padding: "0px",
    "&:hover": {
      backgroundColor: theme.colors.colorGray,
    },
  },
  tableIconsLogo: {
    color: theme.colors.colorDarkGray,
    "&:hover": {
      color: theme.colors.colorBlack,
    },
  },
  tableIconsTrash: {
    color: theme.colors.colorRed,
    "&:hover": {
      color: theme.colors.colorRed,
    },
  },
  searchInputMargin: {
    marginBottom: "0px",
  },
  tableHeaders: {
    position: "sticky",
    zIndex: 100,
    top: 0,
    background: "white",
  },
}));

const ProductsTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const locale = useSelector((state) => state.settings.language);
  const tableData = useSelector((state) => state.product.tableData);
  const status = useSelector((state) => state.product.status);
  const categories = useSelector((state) => state.productCategories.tableData);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const manufacturers = useSelector((state) => state.manufacturers.tableData);
  const finesess = useSelector((state) => state.goldFineness.tableData);
  const packageDimensions = useSelector(
    (state) => state.packageDimension.tableData
  );
  const productMaterials = useSelector(
    (state) => state.productMaterial.tableData
  );

  const closeModal = async () => {
    setModalVisible(false);
    setIsUpdate(false);
    setUpdateData([]);
  };

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };
  const Th = ({ children, reversed, sorted, onSort }) => {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
    return (
      <th className={classes.th}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="left">
            <Text weight={500} size="sm">
              {children}
            </Text>
            <Center className={classes.icon}>
              <Icon size={14} />
            </Center>
          </Group>
        </UnstyledButton>
      </th>
    );
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
  const getLocalizedDescription = (inputArray) => {
    let defaultDescription = "";
    let localizedDescription = "";
    for (let i = 0; i < inputArray.length; i++) {
      if (inputArray[i].locale === locale) {
        localizedDescription = inputArray[i].description;
      } else if (inputArray[i].locale === "en") {
        defaultDescription = inputArray[i].description;
      }
    }
    return localizedDescription !== ""
      ? localizedDescription
      : defaultDescription;
  };

  const searchTableData = (data) => {
    if (search !== "") {
      var filteredData = data.filter(
        (item) =>
          item.skuName.toLowerCase().includes(search.toLowerCase()) ||
          item.skuStatus.toLowerCase().includes(search.toLowerCase()) ||
          String(item.skuId).toLowerCase().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()) ||
          item.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
          item.status.toLowerCase().includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };
  const sortTableData = (data) => {
    if (sortBy === "skuName") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.skuName.localeCompare(b.skuName))
        : data.sort((a, b) => a.skuName.localeCompare(b.skuName)).reverse();
    } else if (sortBy === "skuStatus") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.skuStatus.localeCompare(b.skuStatus))
        : data.sort((a, b) => a.skuStatus.localeCompare(b.skuStatus)).reverse();
    } else if (sortBy === "skuId") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.skuId - b.skuId)
        : data.sort((a, b) => a.skuId - b.skuId).reverse();
    } else if (sortBy === "name") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.name.localeCompare(b.name))
        : data.sort((a, b) => a.name.localeCompare(b.name)).reverse();
    } else if (sortBy === "category") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.category.localeCompare(b.category))
        : data.sort((a, b) => a.category.localeCompare(b.category)).reverse();
    } else if (sortBy === "manufacturer") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.manufacturer.localeCompare(b.manufacturer))
        : data
            .sort((a, b) => a.manufacturer.localeCompare(b.manufacturer))
            .reverse();
    } else if (sortBy === "status") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.status.localeCompare(b.status))
        : data.sort((a, b) => a.status.localeCompare(b.status)).reverse();
    } else {
      return data;
    }
  };
  const fetchCategoryById = (id) => {
    if (id !== null && id !== undefined) {
      var category = categories.filter((item) => item.id === id);
      if (category !== undefined && category.length > 0)
        return getLocalizedName(category[0].names);
      else return "";
    } else {
      return "";
    }
  };

  const fetchManufacturerById = (id) => {
    if (id !== null && id !== undefined) {
      var manufacturer = manufacturers.filter((item) => item.id === id);
      if (manufacturer !== undefined && manufacturer.length > 0)
        return manufacturer[0].name;
      else return "";
    } else {
      return "";
    }
  };

  const fetchGoldFinesse = (id) => {
    if (id !== null && id !== undefined) {
      var finese = finesess.filter((item) => item.id === id);
      if (finese !== undefined && finese.length > 0) {
        return finese[0].name;
      } else return "";
    } else {
      return "";
    }
  };

  const fetchPackageDimension = (id) => {
    if (id !== null && id !== undefined) {
      var packageDimension = packageDimensions.filter((item) => item.id === id);
      if (packageDimension !== undefined && packageDimension.length > 0)
        return packageDimension[0].description;
      else return "";
    } else {
      return "";
    }
  };

  const prepareEURPrice = (data) => {
    if (data !== undefined && data.length > 0) {
      var price = data.filter((item) => item.currency === "EUR");
      return price[0].amount;
    } else {
      return "";
    }
  };
  const fetchProductMaterial = (id) => {
    if (id !== null && id !== undefined) {
      var productMaterial = productMaterials.filter((item) => item.id === id);
      if (productMaterial !== undefined && productMaterial.length > 0) {
        {
          return getLocalizedName(productMaterial[0].names);
        }
      } else return "";
    }
  };
  const prepareTableData = (data) => {
    if (data === undefined) {
      return [];
    } else {
      var tableData = data.map((element) => ({
        id: element.id,
        skuName: element.skuName === null ? "" : element.skuName,
        skuStatus: element.skuStatus === null ? "" : element.skuStatus,
        skuId: element.skuId === null ? "" : element.skuId,
        name: getLocalizedName(element.names === null ? [] : element.names),
        names: element.names === null ? [] : element.names,
        description: getLocalizedDescription(
          element.descriptions === null ? [] : element.descriptions
        ),
        descriptions: element.descriptions === null ? [] : element.descriptions,
        buybackPrice: prepareEURPrice(element.buybackPrices),
        oneTimePaymentPrice: prepareEURPrice(element.oneTimePaymentPrices),
        installmentsPaymentPrice: prepareEURPrice(
          element.installmentsPaymentPrices
        ),
        category:
          element.categoryId === null
            ? ""
            : fetchCategoryById(element.categoryId),
        categoryId: element.categoryId,
        countryOfOriginCode:
          element.countryOfOriginCode === null ? "" : element.countryOfOriginCode,
        manufacturer:
          element.manufacturerId === null
            ? ""
            : fetchManufacturerById(element.manufacturerId),
        manufacturerId: element.manufacturerId,
        material: fetchProductMaterial(element.materialId),
        materialId: element.materialId,
        goldFinesses: fetchGoldFinesse(element.finenessId),
        finenessId: element.finenessId,
        packageDimension: fetchPackageDimension(element.packageDimensionId),
        packageDimensionId: element.packageDimensionId,
        dimension: element.dimension === null ? "" : element.dimension,
        weight: element.weight === null ? "" : element.weight,
        status: element.status === null ? "" : element.status,
        activatedAt:
          element.activatedAt === null
            ? ""
            : dayjs(element.activatedAt)
                .format("DD.MM.YYYY HH:mm:ss")
                .toString(),
        createdAt:
          element.createdAt === null
            ? ""
            : dayjs(element.createdAt).format("DD.MM.YYYY HH:mm:ss").toString(),
          photoIds: element.photoIds,
          version:element.version
      }));

      return searchTableData(sortTableData(tableData));
    }
  };

  const updateProduct = (data) => {
    setIsUpdate(true);
    setModalData(tableData);
    setUpdateData(data);
    setModalVisible(true);
  };

  const rows = useMemo(() => {
    return prepareTableData(tableData).map((row) => (
      <tr key={row.id}>
        {TableCell(row.skuName)}
        {TableCell(row.skuStatus)}
        {TableCell(row.skuId)}
        {TableCell(row.name)}
        {TableCell(row.category)}
        {TableCell(row.manufacturer)}
        {TableCell(row.status)}
        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            {row.status !== "DRAFT" && (
              <Tooltip label={t("productsTable.changeStatus")}>
              <Button
                variant="subtle"
                className={classes.tableIconsButton}
                onClick={async () => {
                  const changeStatus =
                    row["status"] === "ACTIVE" ? "INACTIVE" : "ACTIVE";

                  const newObj = {
                    ...row,
                    status: changeStatus,
                  };

                  await dispatch(
                    updateProductThunk({
                      updateData: newObj,
                      updateObject: newObj,
                    })
                  );
                  await dispatch(fetchProductDataThunk());
                }}
              >
                
                {row.status === "ACTIVE" ? (
                  <Package className={classes.tableIconsLogo} />
                ) : (
                  <PackageOff className={classes.tableIconsLogo} />
                )}
              </Button>
              </Tooltip>
            )}
            <Button
              disabled={row.categoryId === null ? true : false}
              variant="subtle"
              className={classes.tableIconsButton}
              onClick={async () => {
                await dispatch(fetchProductByIdThunk(row.id));
                navigate(row.id);
              }}
            >
              <World
                className={
                  row.categoryId === null ? null : classes.tableIconsLogo
                }
              />
            </Button>
            <Button
              variant="subtle"
              className={classes.tableIconsButton}
              onClick={async () => {
                await dispatch(fetchProductByIdThunk(row.id));
                await updateProduct(row);
              }}
            >
              <Pencil className={classes.tableIconsLogo} />
            </Button>
          </Group>
        </td>
      </tr>
    ));
    
  }, [sortBy, search, reverseSortDirection, tableData]);

  useEffect(() => {
    dispatch(fetchProductDataThunk());
    dispatch(fetchProductCategoryDataThunk());
    dispatch(fetchCountriesDataThunk());
    dispatch(fetchManufacturersThunk());
    dispatch(fetchGoldFinenessDataThunk());
    dispatch(fetchPackageDimensionDataThunk());
    dispatch(fetchProductMaterialDataThunk());
    
  }, []);

  return (
    <>
      <div className={classes.searchAndButtonContainter}>
        <TextInput
          className={classes.searchInput}
          placeholder={t("table.search")}
          mb="md"
          icon={<Search size={14} />}
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <ScrollArea className={classes.scrollArea}>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          className={classes.tableStyle}
        >
          <thead className={classes.tableHeaders}>
            <tr>
              <Th
                sorted={sortBy === "skuName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("skuName")}
              >
                {t("productsTable.skuName")}
              </Th>

              <Th
                sorted={sortBy === "skuStatus"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("skuStatus")}
              >
                {t("productsTable.skuStatus")}
              </Th>

              <Th
                sorted={sortBy === "skuId"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("skuId")}
              >
                {t("productsTable.skuID")}
              </Th>

              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                {t("productsTable.name")}
              </Th>
              <Th
                sorted={sortBy === "category"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("category")}
              >
                {t("productsTable.category")}
              </Th>

              <Th
                sorted={sortBy === "manufacturer"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("manufacturer")}
              >
                {t("productsTable.manufacturer")}
              </Th>
              <Th
                sorted={sortBy === "status"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("status")}
              >
                {t("productsTable.status")}
              </Th>

              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          <tbody>
            {status === "pending" && (
              <tr>
                <td style={{ borderBottom: "none" }}>
                  <LoadingOverlay loader={CustomLoader()} visible />
                </td>
              </tr>
            )}

            {rows.length > 0 && rows !== [] ? (
              rows
            ) : (
              <tr>
                <td colSpan={8}>
                  <Text weight={500} align="center">
                    {t("table.nothingFound")}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      <ProductModal
        opened={modalVisible}
        onClose={closeModal}
        modalData={modalData}
        isUpdate={isUpdate}
        updateData={updateData}
      />
    </>
  );
};

export default ProductsTable;
