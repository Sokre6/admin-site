import React, { useEffect, useMemo, useState } from "react";
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
} from "tabler-icons-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DeleteBanner from "../common/DeleteBanner";
import { showNotification } from "@mantine/notifications";
import { fetchProductCategoryByIdThunk } from "../../store/slices/productCategory";
import ProductCategoryLocalizationTableModal from "./ProductCategoryLocalizationTableModal";
import DeleteProductCategoryBanner from "./DeleteProductCategoryBanner";
import DeleteProductCategoryLocalizationBanner from "./DeleteProductCategoryLocalizationBanner";
import TableCell from "../common/TableCell";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
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
  searchInput: {
    width: "25vw",
    marginBottom: "0px !important",
  },
  searchInputMargin: {
    marginBottom: "0px",
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
  tableIconsButton: {
    padding: "0px",
    "&:hover": {
      backgroundColor: theme.colors.colorGray,
    },
  },
  insertButton: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
}));

const ProductCategoryLocalizationTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();

  let params = useParams();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);

  const [
    showProductCategoryLocalizationModal,
    setShowProductCategoryLocalizationModal,
  ] = useState(false);
  const [
    productCategoryLocalizationModalData,
    setProductCategoryLocalizationModalData,
  ] = useState(null);

  const [
    showDeleteProductCategoryLocalizationBanner,
    setShowDeleteProductCategoryLocalizationBanner,
  ] = useState(false);
  const [
    deleteProductCategoryLocalizationBannerData,
    setShowDeleteProductCategoryLocalizationBannerData,
  ] = useState(false);

  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const tableLocalizationData = useSelector(
    (state) => state.productCategories.productCategoryLocalizationTableData
  );

  const openProductCategoryLocalizationModal = (data) => {
    setProductCategoryLocalizationModalData(data);
    setShowProductCategoryLocalizationModal(true);
  };

  const closeProductCategoryLocalizationModal = () => {
    setProductCategoryLocalizationModalData(null);
    setShowProductCategoryLocalizationModal(false);
  };

  const showDeleteBanner = (data) => {
    setShowDeleteProductCategoryLocalizationBanner(true);
    setShowDeleteProductCategoryLocalizationBannerData(data);
  };
  const closeDeleteBanner = () => {
    setShowDeleteProductCategoryLocalizationBanner(false);
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

  const searchTableData = (data) => {
    if (search !== "") {
      var filteredData = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.locale.toLowerCase().includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };
  const sortTableData = (data) => {
    if (sortBy === "locale") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.locale.localeCompare(b.locale))
        : data
            .slice()
            .sort((a, b) => a.locale.localeCompare(b.locale))
            .reverse();
    } else if (sortBy === "name") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.name.localeCompare(b.name))
        : data
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .reverse();
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

  const rows = useMemo(() => {
    return searchTableData(sortTableData(tableLocalizationData?.names)).map(
      (row) => (
        <tr key={row.locale}>
          {TableCell(row.locale)}
          {TableCell(row.name)}
          <td className={classes.buttonColumn}>
            <Group position="right" className={classes.buttonContainer}>
              <Button
                className={classes.tableIconsButton}
                variant="subtle"
                onClick={() => {
                  openProductCategoryLocalizationModal(row);
                }}
              >
                <Pencil className={classes.tableIconsLogo} />
              </Button>

              <Button
                className={classes.tableIconsButton}
                variant="subtle"
                disabled={row.locale === "en"}
                onClick={() => {
                  showDeleteBanner(row);
                }}
              >
                <Trash
                  className={row.locale === "en" ? "" : classes.tableIconsTrash}
                />
              </Button>
            </Group>
          </td>
        </tr>
      )
    );
  }, [sortBy, search, reverseSortDirection, tableLocalizationData]);

  useEffect(() => {
    dispatch(fetchProductCategoryByIdThunk(params.questionId));
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
              openProductCategoryLocalizationModal();
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
                sorted={sortBy === "locale"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("locale")}
              >
                {t("productCategoryTableLocale.locale")}
              </Th>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                {t("productCategoryTableLocale.name")}
              </Th>

              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 && rows !== [] ? (
              rows
            ) : (
              <tr>
                <td colSpan={3}>
                  <Text weight={500} align="center">
                    {t("table.nothingFound")}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      <ProductCategoryLocalizationTableModal
        show={showProductCategoryLocalizationModal}
        data={productCategoryLocalizationModalData}
        onClose={closeProductCategoryLocalizationModal}
      />
      <DeleteProductCategoryLocalizationBanner
        show={showDeleteProductCategoryLocalizationBanner}
        deleteData={deleteProductCategoryLocalizationBannerData}
        onClose={closeDeleteBanner}
      />
    </>
  );
};

export default ProductCategoryLocalizationTable;
