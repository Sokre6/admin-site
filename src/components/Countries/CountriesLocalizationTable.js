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

import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import TableCell from "../common/TableCell";
import { showNotification } from "@mantine/notifications";
import DeleteBanner from "../common/DeleteBanner";
import { useParams } from "react-router-dom";
import CountriesLocalizationModal from "./CountriesLocalizationModal";
import {
  fetchCountriesByIdThunk,
  updateCountries,
} from "../../store/slices/countries";

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

const CountriesLocalizationTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteBannerVisible, setDeleteBannerVisible] = useState(false);
  const [deleteData, setDeleteData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const params = useParams();
  const tableData = useSelector((state) => state?.countries.tableDataById);

  const tableLocalizationData = useSelector(
    (state) => state?.countries?.tableDataById
  );

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
  const addNewCountriesLocalization = () => {
    setModalData(tableData);
    setModalVisible(true);
  };

  const updateCountriesLocalization = (data) => {
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
    const data = [...tableData.countryNames];
    if (sortBy === "locale") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.locale.localeCompare(b.locale))
        : data.sort((a, b) => a.locale.localeCompare(b.locale)).reverse();
    } else if (sortBy === "name") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.name.localeCompare(b.name))
        : data.sort((a, b) => a.name.localeCompare(b.name)).reverse();
    } else {
      return data;
    }
  };

  const searchTableData = (data) => {
    if (search !== "") {
      const filteredData = data.filter(
        (item) =>
          item.locale.toLowerCase().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };

  const deleteGeneralTermsLocalization = async () => {
    const updateData = tableLocalizationData.countryNames.filter(
      (item) => item.locale !== deleteData.locale
    );

    const objectToUpdate = {
      countryCode: tableLocalizationData.countryCode,
      applicability: {
        countryOfOrigin: tableLocalizationData?.applicability?.countryOfOrigin,
        countryOfDelivery:
          tableLocalizationData?.applicability?.countryOfDelivery,
      },
      activity: tableLocalizationData?.activity,
      countryNames: updateData,
    };
    await dispatch(
      updateCountries({
        countryCode: tableLocalizationData.countryCode,
        data: objectToUpdate,
      })
    )
      .unwrap()
      .then(() => {
        showNotification({
          message: t("generalTermsLocalizationTable.deleteSucessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("generalTermsLocalizationTable.deleteError"),
          color: "red",
        });
      });
    dispatch(fetchCountriesByIdThunk(params?.code));
    closeDeleteBanner();
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
    <tr key={row.locale}>
      {TableCell(row.locale)}
      {TableCell(row.name)}
      <td className={classes.buttonColumn}>
        <Group position="right" className={classes.buttonContainer}>
          <Button
            className={classes.tableIconsButton}
            variant="subtle"
            onClick={() => updateCountriesLocalization(row)}
          >
            <Pencil className={classes.tableIconsLogo} />
          </Button>
          <Button
            disabled={row.locale === "en"}
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
            onClick={() => addNewCountriesLocalization()}
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
                {t("countriesTable.locale")}
              </Th>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                {t("countriesTable.name")}
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
      <CountriesLocalizationModal
        opened={modalVisible}
        onClose={closeModal}
        modalData={modalData}
        isUpdate={isUpdate}
        updateData={updateData}
      />
      <DeleteBanner
        deleteMethod={deleteGeneralTermsLocalization}
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

export default CountriesLocalizationTable;
