import React, { useState, useMemo } from "react";
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
  Pencil,
  Trash,
} from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DeliveryCostModal from "./DeliveryCostModal";
import DeleteBanner from "../common/DeleteBanner";
import { showNotification } from "@mantine/notifications";
import {
  deleteDeliveryCostThunk,
  fetchDeliveryCostData,
} from "../../store/slices/deliveryCost";
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
}));

const DeliveryCostTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const tableData = useSelector((state) => state.deliveryCost.tableData);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteBannerVisible, setDeleteBannerVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState([]);

  const showDeleteBanner = (data) => {
    setDeleteBannerVisible(true);
    setDeleteItem(data);
  };
  const closeDeleteBanner = () => {
    setDeleteBannerVisible(false);
  };
  const deleteDeliveryCost = async () => {
    await dispatch(deleteDeliveryCostThunk(deleteItem.id))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("deleteBanner.deleteSucessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("deleteBanner.deleteFailed"),
          color: "red",
        });
      });
    await dispatch(fetchDeliveryCostData());
    closeDeleteBanner();
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

  const updateItem = (data) => {
    setIsUpdate(true);
    setUpdateData(data);
    setModalVisible(true);
  };

  const closeInsertModal = () => {
    setModalVisible(false);
    setIsUpdate(false);
    setUpdateData([]);
  };

  const sortTableData = (data) => {
    if (sortBy === "deliveryCountry") {
      return !reverseSortDirection
        ? data.sort((a, b) =>
          a.deliveryCountry.localeCompare(b.deliveryCountry)
        )
        : data
          .sort((a, b) =>
            a.deliveryCountry.localeCompare(b.deliveryCountry)
          )
          .reverse();
    } else if (sortBy === "coverageTo") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.coverageTo - b.coverageTo)
        : data.sort((a, b) => a.coverageTo - b.coverageTo).reverse();
    } else if (sortBy === "totalAmntCoeff") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.totalAmntCoeff - b.totalAmntCoeff)
        : data.sort((a, b) => a.totalAmntCoeff - b.totalAmntCoeff).reverse();
    } else if (sortBy === "fixedAmnt") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.fixedAmnt - b.fixedAmnt)
        : data.sort((a, b) => a.fixedAmnt - b.fixedAmnt).reverse();
    } else if (sortBy === "coverageFrom") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.coverageFrom - b.coverageFrom)
        : data.sort((a, b) => a.coverageFrom - b.coverageFrom).reverse();
    } else if (sortBy === "coverageCurr") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.coverageCurr - b.coverageCurr)
        : data.sort((a, b) => a.coverageCurr - b.coverageCurr).reverse();
    } else {
      return data;
    }
  };
  const searchTableData = (data) => {
    debugger;
    if (search !== "") {
      var filteredData = data.filter(
        (item) =>
          item.deliveryCountry
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          String(item.coverageTo).includes(search.toLowerCase()) ||
          String(item.coverageFrom).includes(search.toLowerCase()) ||
          String(item.coverageCurr).toLowerCase()
            .includes(search.toLowerCase()) ||
          String(item.totalAmntCoeff).includes(search.toLowerCase()) ||
          String(item.fixedAmnt).includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };
  const localizeTableData = (data) => {
    if (data.length === 0) {
      return [];
    } else {
      var tableData = data.map((element) => ({
        id: element.id,
        coverageFrom: element.coverageFrom,
        coverageTo: element.coverageTo,
        coverageCurr: element.coverageCurr,
        totalAmntCoeff: element.totalAmntCoeff,
        deliveryCountry:
          element.deliveryCountry === null
            ? ""
            : element.deliveryCountry,
        fixedAmnt: element.fixedAmnt,
      }));
      return searchTableData(sortTableData(tableData));
    }
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

  const rows = useMemo(() => {
    return localizeTableData(tableData).map((row) => (
      <tr key={row.id}>
        <td>{row.coverageFrom}</td>
        <td>{row.coverageTo}</td>
        <td>{row.coverageCurr}</td>
        <td>{row.totalAmntCoeff}</td>
        <td>{row.deliveryCountry}</td>
        <td>{row.fixedAmnt}</td>
        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              variant="subtle"
              className={classes.tableIconsButton}
              onClick={() => {
                updateItem(row);
              }}
            >
              <Pencil className={classes.tableIconsLogo} />
            </Button>
            <Button
              variant="subtle"
              className={classes.tableIconsButton}
              onClick={() => {
                showDeleteBanner();
                setDeleteItem(row);
              }}
            >
              <Trash className={classes.tableIconsTrash} />
            </Button>
          </Group>
        </td>
      </tr>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, search, reverseSortDirection, tableData]);

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
        <Button
          className={classes.insertButton}
          onClick={() => {
            setIsUpdate(false);
            setModalVisible(true);
          }}
        >
          <Plus size={18} />
        </Button>
      </div>
      <ScrollArea className={classes.scrollArea}>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          className={classes.tableStyle}
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === "coverageFrom"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("coverageFrom")}
              >
                {t("deliveryCostTable.coverageFrom")}
              </Th>
              <Th
                sorted={sortBy === "coverageTo"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("coverageTo")}
              >
                {t("deliveryCostTable.coverageTo")}
              </Th>
              <Th
                sorted={sortBy === "coverageCurr"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("coverageCurr")}
              >
                {t("deliveryCostTable.coverageCurr")}
              </Th>
              <Th
                sorted={sortBy === "totalAmntCoeff"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("totalAmntCoeff")}
              >
                {t("deliveryCostTable.totalAmntCoeff")}
              </Th>
              <Th
                sorted={sortBy === "deliveryCountry"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("deliveryCountry")}
              >
                {t("deliveryCostTable.deliveryCountry")}
              </Th>
              <Th
                sorted={sortBy === "fixedAmnt"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("fixedAmnt")}
              >
                {t("deliveryCostTable.fixedAmnt")}
              </Th>
              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 && rows !== [] ? (
              rows
            ) : (
              <tr>
                <td colSpan={5}>
                  <Text weight={500} align="center">
                    {t("table.nothingFound")}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      <DeliveryCostModal
        opened={modalVisible}
        onClose={closeInsertModal}
        isUpdate={isUpdate}
        updateData={updateData}
      />
      <DeleteBanner
        deleteMethod={deleteDeliveryCost}
        centered={true}
        opened={deleteBannerVisible}
        onClose={closeDeleteBanner}
        modalTitle={t("deleteBanner.title")}
        message={t("deleteBanner.message")}
        okButtonText={t("deleteBanner.okButton")}
        cancelButtonText={t("deleteBanner.cancelButton")}
      />
    </>
  );
};

export default DeliveryCostTable;
