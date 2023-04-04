import React, { useEffect, useState } from "react";
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
import {
  fetchDeliveryMethodByIdThunk,
  updateDeliveryMethodThunk,
} from "../../store/slices/deliveryMethod";
import DeliveryLocalizationModal from "./DeliveryLocalizationModal";
import TableCell from "../common/TableCell";
import { showNotification } from "@mantine/notifications";

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
  insertButton: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
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
  tableIconsButton: {
    padding: "0px",
    "&:hover": {
      backgroundColor: theme.colors.colorGray,
    },
  },
}));

const DeliveryMethodLocalizationTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const tableData = useSelector(
    (state) => state.deliveryMethod.deliveryMethodData
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteBannerVisible, setDeleteBannerVisible] = useState(false);
  const [deleteData, setDeleteData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  let params = useParams();

  useEffect(() => {
    dispatch(fetchDeliveryMethodByIdThunk(params.deliveryMethodId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible, deleteBannerVisible]);
  useEffect(() => { }, [tableData]);

  const closeDeleteBanner = () => {
    setDeleteBannerVisible(false);
  };

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const sortTableData = (tableData) => {
    var data = [...tableData.names];
    if (sortBy === "lang") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.lang.localeCompare(b.lang))
        : data.sort((a, b) => a.lang.localeCompare(b.lang)).reverse();
    } else if (sortBy === "name") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.value.localeCompare(b.value))
        : data.sort((a, b) => a.value.localeCompare(b.value)).reverse();
    } else {
      return data;
    }
  };
  const searchTableData = (data) => {
    if (search !== "") {
      var filteredData = data.filter(
        (item) =>
          item.value.toLowerCase().includes(search.toLowerCase()) ||
          item.lang.toLowerCase().includes(search.toLowerCase())
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

  const rows = searchTableData(sortTableData(tableData)).map((row) => (
    <tr key={row.lang}>
      {TableCell(row.lang)}
      {TableCell(row.value)}
      <td className={classes.buttonColumn}>
        <Group position="right" className={classes.buttonContainer}>
          <Button
            className={classes.tableIconsButton}
            variant="subtle"
            onClick={() => updateDeliveryMethodLocalization(row)}
          >
            <Pencil className={classes.tableIconsLogo} />
          </Button>
          <Button
            disabled={row.lang === "en" ? true : false}
            variant="subtle"
            className={classes.tableIconsButton}
            onClick={() => {
              setDeleteBannerVisible(true);
              setDeleteData(row);
            }}
          >
            <Trash
              className={row.lang === "en" ? null : classes.tableIconsTrash}
            />
          </Button>
        </Group>
      </td>
    </tr>
  ));

  const closeModal = async () => {
    setModalVisible(false);
    setIsUpdate(false);
    setUpdateData([]);
  };

  const addNewDeliveryMethodLocalization = () => {
    setModalData(tableData);
    setModalVisible(true);
  };

  const updateDeliveryMethodLocalization = (data) => {
    setIsUpdate(true);
    setModalData(tableData);
    setUpdateData(data);
    setModalVisible(true);
  };

  const deleteDeliveryMethodLocalization = async () => {
    var updateData = tableData.names.filter(
      (item) => item.lang !== deleteData.lang
    );
    await dispatch(
      updateDeliveryMethodThunk({ id: tableData.id, names: updateData })
    )
      .unwrap()
      .then(() => {
        showNotification({
          message: t("deliveryMethodLocalizationTable.deleteSucessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("deliveryMethodLocalizationTable.deleteError"),
          color: "red",
        });
      });
    dispatch(fetchDeliveryMethodByIdThunk(tableData.id));
    closeDeleteBanner();
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

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
            style={{ alignSelf: "flex-end" }}
            onClick={() => addNewDeliveryMethodLocalization()}
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
                sorted={sortBy === "lang"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("locale")}
              >
                {t("deliveryMethodLocalizationTable.locale")}
              </Th>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                {t("deliveryMethodLocalizationTable.name")}
              </Th>
              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 && rows !== [] ? (
              rows
            ) : (
              <tr>
                <td colSpan={2}>
                  <Text weight={500} align="center">
                    {t("table.nothingFound")}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      <DeliveryLocalizationModal
        opened={modalVisible}
        onClose={closeModal}
        modalData={modalData}
        isUpdate={isUpdate}
        updateData={updateData}
      />
      <DeleteBanner
        deleteMethod={deleteDeliveryMethodLocalization}
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
export default DeliveryMethodLocalizationTable;
