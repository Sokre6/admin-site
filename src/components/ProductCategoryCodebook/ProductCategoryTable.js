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
} from "@mantine/core";
import {
  Selector,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  Trash,
  Pencil,
  World,
  Minus,
} from "tabler-icons-react";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCategoryModal from "./ProductCategoryModal";
import {
  fetchProductCategoryByIdThunk,
  fetchProductCategoryDataThunk,
} from "../../store/slices/productCategory";
import DeleteProductCategoryBanner from "./DeleteProductCategoryBanner";
import TableCell from "../common/TableCell";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },
  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
  deleteIcon: {
    color:
      theme.colorScheme === "dark" ? theme.colors.red[5] : theme.colors.red[5],
    marginLeft: theme.spacing.xl,
  },
  worldIcon: {
    marginLeft: theme.spacing.xl,
  },
  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
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
  buttonContainer: {
    display: "flex",
    width: "280px",
    paddingRight: "16px",
    flexWrap: "wrap",
    "@media (max-width: 1150px)": {
      flexDirection: "column",
    },
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
  searchInput: {
    width: "25vw",
    marginBottom: "0px !important",
  },
  searchInputMargin: {
    marginBottom: "0px",
  },
  thead: {
    borderBottom: `1px solid #dee2e6`,
  },
}));

const ProductCategoryTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);

  const [showProductCategoryModal, setShowProductCategoryModal] =
    useState(false);
  const [productCategoryModalData, setProductCategoryModalData] =
    useState(null);

  const [showDeleteProductCategoryBanner, setShowDeleteProductCategoryBanner] =
    useState(false);
  const [
    deleteProductCategoryBannerData,
    setShowDeleteProductCategoryBannerData,
  ] = useState(false);

  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const locale = useSelector((state) => state.settings.language);

  const tableData = useSelector((state) => state.productCategories.tableData);

  const openProductCategoryModal = (data) => {
    setProductCategoryModalData(data);
    setShowProductCategoryModal(true);
  };

  const closeProductCategoryModal = () => {
    setProductCategoryModalData(null);
    setShowProductCategoryModal(false);
  };

  const showDeleteBanner = (data) => {
    setShowDeleteProductCategoryBanner(true);
    setShowDeleteProductCategoryBannerData(data);
  };
  const closeDeleteBanner = () => {
    setShowDeleteProductCategoryBanner(false);
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const sortTableData = (data) => {
    if (sortBy === "name") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.name.localeCompare(b.name))
        : data
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .reverse();
    } else if (sortBy === "parentCategoryId") {
      return !reverseSortDirection
        ? data
            ?.slice()
            ?.sort((a, b) =>
              a.parentCategory
                ? a.parentCategory?.toString()?.localeCompare(b.parentCategory)
                : 0
            )
        : data
            ?.slice()
            ?.sort((a, b) =>
              a.parentCategory
                ? a.parentCategory?.toString()?.localeCompare(b.parentCategory)
                : 0
            )
            ?.reverse();
    } else if (sortBy === "ordinalNumber") {
      return !reverseSortDirection
        ? data
            ?.slice()
            ?.sort((a, b) => Number(a.ordinalNumber) - Number(b.ordinalNumber))
        : data
            ?.slice()
            ?.sort((a, b) => Number(a.ordinalNumber) - Number(b.ordinalNumber))
            ?.reverse();
    } else if (sortBy === "activity") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.activity.localeCompare(b.activity))
        : data
            .slice()
            .sort((a, b) => a.activity.localeCompare(b.activity))
            .reverse();
    } else {
      return data;
    }
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

  const localizeTableData = (data) => {
    if (data.length === 0) {
      return [];
    } else {
      let tableData = data.map((item) => ({
        id: item.id,
        name: getLocalizedName(item.names),
        parentCategory:
          getLocalizeParentCategory(item.parentCategory?.names) || null,
        ordinalNumber: item.ordinalNumber,

        activity: item.activity,
      }));

      return searchTableData(sortTableData(tableData));
    }
  };

  const searchTableData = (data) => {
    if (search !== "") {
      let filteredData = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.parentCategory
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          item.ordinalNumber.toString().includes(search.toString()) ||
          item.activity.toLowerCase().includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };

  const Th = ({ children, reversed, sorted, onSort }) => {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
    return (
      <th className={classes.th}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="apart">
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

  const getLocalizeParentCategory = (inputArray) => {
    let defaultName = "";
    let localizedName = "";
    /*   const d = inputArray.map((item) => item.parentCategory?.names); */

    if (inputArray === undefined || null) {
      return [];
    } else {
      for (let i = 0; i < inputArray.length; i++) {
        if (inputArray[i].locale === locale) {
          localizedName = inputArray[i].name;
        } else if (inputArray[i].locale === "en") {
          defaultName = inputArray[i].name;
        }
      }
    }
    return localizedName !== "" ? localizedName : defaultName;
  };

  const rows = useMemo(() => {
    return localizeTableData(tableData).map((row) => (
      <tr key={row.id}>
        {TableCell(row.name)}
        {TableCell(row.parentCategory)}
        {TableCell(row.ordinalNumber)}
        {TableCell(row.activity)}
        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={async () => {
                await dispatch(fetchProductCategoryByIdThunk({ id: row.id }));
                await navigate(row.id);
              }}
            >
              <World className={classes.tableIconsLogo} />
            </Button>

            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={async () => {
                await dispatch(fetchProductCategoryByIdThunk({ id: row.id }));
                openProductCategoryModal(row);
              }}
            >
              <Pencil className={classes.tableIconsLogo} />
            </Button>

            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={() => showDeleteBanner(row)}
            >
              <Trash className={classes.tableIconsTrash} />
            </Button>
          </Group>
        </td>
      </tr>
    ));
  }, [sortBy, search, reverseSortDirection, tableData]);

  useEffect(() => {
    dispatch(fetchProductCategoryDataThunk());
  }, []);

  return (
    <>
      <ScrollArea className={classes.scrollArea}>
        <div className={classes.searchAndButtonContainter}>
          <TextInput
            className={classes.searchInput}
            placeholder={t("table.search")}
            mb="md"
            icon={<Search size={14} />}
            value={search}
            onChange={handleSearchChange}
          />
          <Button
            className={classes.insertButton}
            onClick={() => {
              setShowProductCategoryModal(true);
            }}
          >
            <Plus size={18} />
          </Button>
        </div>

        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{ tableLayout: "fixed", minWidth: 700 }}
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                {t("productCategoryTable.categoryName")}
              </Th>
              <Th
                sorted={sortBy === "parentCategoryId"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("parentCategoryId")}
              >
                {t("productCategoryTable.superiority")}
              </Th>
              <Th
                sorted={sortBy === "ordinalNumber"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("ordinalNumber")}
              >
                {t("productCategoryTable.ordinalNumber")}
              </Th>
              <Th
                sorted={sortBy === "activity"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("activity")}
              >
                {t("productCategoryTable.status")}
              </Th>
              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 && rows !== [] ? (
              rows
            ) : (
              <tr>
                <td colSpan={4}>
                  <Text weight={500} align="center">
                    {t("table.nothingFound")}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      <ProductCategoryModal
        show={showProductCategoryModal}
        data={productCategoryModalData}
        onClose={closeProductCategoryModal}
      />
      <DeleteProductCategoryBanner
        show={showDeleteProductCategoryBanner}
        data={deleteProductCategoryBannerData}
        onClose={closeDeleteBanner}
      />
    </>
  );
};

export default ProductCategoryTable;
