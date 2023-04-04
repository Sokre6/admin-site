import {
  Button,
  createStyles,
  Group,
  ScrollArea,
  TextInput,
  Text,
  Table,
  UnstyledButton,
  Center,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "../../http/axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Pencil,
  Plus,
  Search,
  Selector,
  Trash,
} from "tabler-icons-react";
import {
  fetchLegalDocumentsByTypeIdThunk,
  updateLegalDocumentsByTypeThunk,
} from "../../store/slices/legalDocuments";

import DeleteBanner from "../common/DeleteBanner";
import TableCell from "../common/TableCell";
import OrderTermsAndConditionsLocalizationModal from "./OrderTermsAndConditionsLocalizationModal";

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
}));

const OrderTermsAndConditionsLocalizationTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const tableData = useSelector(
    (state) => state?.legalDocumentsByType?.legalDocumentsByTypeId
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteBannerVisible, setDeleteBannerVisible] = useState(false);
  const [deleteData, setDeleteData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const params = useParams();

  const closeDeleteBanner = () => {
    setDeleteBannerVisible(false);
  };

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const closeModal = async () => {
    setModalVisible(false);
    setIsUpdate(false);
    setUpdateData([]);
  };
  const addNewOrderTermsAndConditionsLocalization = () => {
    setModalData(tableData);
    setModalVisible(true);
  };

  const updateOrderTermsAndConditionsLocalization = (data) => {
    setIsUpdate(true);
    setModalData(tableData);
    setUpdateData(data);
    setModalVisible(true);
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const sortTableData = (tableData) => {
    const data = [...tableData.descriptions];

    if (sortBy === "locale") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.locale.localeCompare(b.locale))
        : data.sort((a, b) => a.locale.localeCompare(b.locale)).reverse();
    } else {
      return data;
    }
  };
  const searchTableData = (data) => {
    if (search !== "") {
      const filteredData = data.filter((item) =>
        item.locale.toLowerCase().includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };

  const deleteOrderTermsAndConditionsLocalization = async () => {
    const updateData = tableData.descriptions.filter(
      (item) => item.locale !== deleteData.locale
    );

    const objectToUpdate = {
      validFrom: tableData.validFrom,
      validTo: tableData.validTo,
      contents: updateData,
    };
    await dispatch(
      updateLegalDocumentsByTypeThunk({
        id: tableData.id,
        data: objectToUpdate,
      })
    )
      .unwrap()
      .then(() => {
        showNotification({
          message: t(
            "orderTermsAndConditionsLocalizationTable.deleteSucessfull"
          ),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("orderTermsAndConditionsLocalizationTable.deleteError"),
          color: "red",
        });
      });
    dispatch(
      fetchLegalDocumentsByTypeIdThunk(params?.orderTermsAndConditionsId)
    );
    closeDeleteBanner();
  };

  const downloadFile = async (id) => {
    await axios
      .get(`aurodomus-file/api/v1/files/${id}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `export_file.pdf`);
        document.body.appendChild(link);
        link.click();
        showNotification({
          message: t("orderTermsAndConditionsLocalizationTable.downloadSuccessfully"),
          color: "green",
        })
      })
      .catch(() =>
        showNotification({
          message: t("orderTermsAndConditionsLocalizationTable.downloadError"),
          color: "red",
        })
      );
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

  const rows = searchTableData(sortTableData(tableData)).map((row) => (
    <tr key={row.fileId}>
      {TableCell(row.locale)}

      <td className={classes.buttonColumn}>
        <Group position="right" className={classes.buttonContainer}>
          <Button
            className={classes.tableIconsButton}
            variant="subtle"
            onClick={() => downloadFile(row.fileId)}
          >
            <Download className={classes.tableIconsLogo} />
          </Button>
          <Button
            className={classes.tableIconsButton}
            variant="subtle"
            onClick={() => updateOrderTermsAndConditionsLocalization(row)}
          >
            <Pencil className={classes.tableIconsLogo} />
          </Button>
          <Button
            disabled={row.locale === "en" ? true : false}
            variant="subtle"
            className={classes.tableIconsButton}
            onClick={() => {
              setDeleteBannerVisible(true);
              setDeleteData(row);
            }}
          >
            <Trash
              className={row.locale === "en" ? null : classes.tableIconsTrash}
            />
          </Button>
        </Group>
      </td>
    </tr>
  ));

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
            onClick={() => addNewOrderTermsAndConditionsLocalization()}
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
                className={classes.buttonColumn}
                sorted={sortBy === "locale"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("locale")}
              >
                {t("orderTermsAndConditionsLocalizationTable.locale")}
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
      <OrderTermsAndConditionsLocalizationModal
        opened={modalVisible}
        onClose={closeModal}
        modalData={modalData}
        isUpdate={isUpdate}
        updateData={updateData}
      />
      <DeleteBanner
        deleteMethod={deleteOrderTermsAndConditionsLocalization}
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

export default OrderTermsAndConditionsLocalizationTable;
