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
} from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DeleteBanner from "../common/DeleteBanner";
import { showNotification } from "@mantine/notifications";

import { useNavigate } from "react-router-dom";
import TableCell from "../common/TableCell";
import {
  fetchCountriesByIdThunk,
  fetchCountriesDataThunk,
} from "../../store/slices/countries";
import CustomLoader from "../common/CustomLoader";
import CountriesModal from "./CountriesModal";
import DeleteCountriesBanner from "./DeleteCountriesBanner";
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

const CountriesTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [showCountriesModal, setShowCountriesModal] = useState(false);
  const [countriesModalData, setCountriesModalData] = useState(null);

  const [showDeleteCountriesBanner, setShowDeleteCountriesBanner] =
    useState(false);
  const [deleteCountriesBannerData, setShowDeleteCountriesBannerData] =
    useState(false);

  const locale = useSelector((state) => state.settings.language);
  const status = useSelector((state) => state.countries.status);
  const tableData = useSelector((state) => state.countries.tableData);

  const openCountriesModal = (data) => {
    setCountriesModalData(data);
    setShowCountriesModal(true);
  };

  const closeCountriesModal = () => {
    setCountriesModalData(null);
    setShowCountriesModal(false);
  };

  const showDeleteBanner = (data) => {
    setShowDeleteCountriesBanner(true);
    setShowDeleteCountriesBannerData(data);
  };
  const closeDeleteBanner = () => {
    setShowDeleteCountriesBanner(false);
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

  const sortTableData = (data) => {
    
    if (sortBy === "countryCode") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort((a, b) => a.countryCode.localeCompare(b.countryCode))
        : data
            .slice()
            .sort((a, b) => a.countryCode.localeCompare(b.countryCode))
            .reverse();
    } else if (sortBy === "name") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.name.localeCompare(b.name))
        : data
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .reverse();
    }else if (sortBy === "countryOfDelivery") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.countryOfDelivery.localeCompare(b.countryOfDelivery))
        : data
            .slice()
            .sort((a, b) => a.countryOfDelivery.localeCompare(b.countryOfDelivery))
            .reverse();
    }else if (sortBy === "countryOfOrigin") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.countryOfOrigin.localeCompare(b.countryOfOrigin))
        : data
            .slice()
            .sort((a, b) => a.countryOfOrigin.localeCompare(b.countryOfOrigin))
            .reverse();
    } else if (sortBy === "activity") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.activity.localeCompare(b.activity))
        : data
            .slice()
            .sort((a, b) => a.activity.localeCompare(b.activity))
            .reverse();
    } 
    else {
      return data;
    }
  };

  const searchTableData = (data) => {
    if (search !== "") {
      let filteredData = data.filter(
        (item) =>
          item.countryCode.toLowerCase().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.countryOfDelivery.toLowerCase().includes(search.toLowerCase()) ||
          item.countryOfOrigin.toLowerCase().includes(search.toLowerCase()) ||
          item.activity.toLowerCase().includes(search.toLowerCase())
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
      let tableData = data.map((item) => ({
        countryCode: item.countryCode,
        name: getLocalizedName(item.countryNames),
        countryOfDelivery: item?.applicability?.countryOfDelivery
          ? t("countriesTable.yes")
          : t("countriesTable.no"),
        countryOfOrigin: item?.applicability?.countryOfOrigin
          ? t("countriesTable.yes")
          : t("countriesTable.no"),
        activity: item.activity,
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
    return localizeTableData(tableData).map((row) => (
      <tr key={row.countryCode}>
        {TableCell(row.countryCode)}
        {TableCell(row.name)}
        {TableCell(row.countryOfOrigin)}
        {TableCell(row.countryOfDelivery)}
        {TableCell(row.activity)}
        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={async () => {
                await dispatch(
                  fetchCountriesByIdThunk(row.countryCode)
                );
                await navigate(row.countryCode);
              }}
            >
              <World className={classes.tableIconsLogo} />
            </Button>

            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={async () => {
                
                openCountriesModal(row);
              }}
            >
              <Pencil className={classes.tableIconsLogo} />
            </Button>

            <Button
              className={classes.tableIconsButton}
              disabled={row.activity === "INACTIVE"}
              variant="subtle"
              onClick={() => showDeleteBanner(row)}
            >
              <Trash
                className={
                  row.activity === "INACTIVE" ? null : classes.tableIconsTrash
                }
              />
            </Button>
          </Group>
        </td>
      </tr>
    ));
  }, [sortBy, search, reverseSortDirection, tableData]);

  useEffect(() => {
    dispatch(fetchCountriesDataThunk());
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
        <Button
          className={classes.insertButton}
          onClick={() => {
            setShowCountriesModal(true);
          }}
        >
          <Plus size={18} />
        </Button>
      </div>
      <ScrollArea className={classes.scrollArea}>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{ tableLayout: "fixed", minWidth: 700 }}
        >
          <thead className={classes.tableHeaders}>
            <tr>
              <Th
                sorted={sortBy === "countryCode"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("countryCode")}
              >
                {t("countriesTable.code")}
              </Th>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                {t("countriesTable.name")}
              </Th>
              <Th
                sorted={sortBy === "countryOfOrigin"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("countryOfOrigin")}
              >
                {t("countriesTable.countryOfOrigin")}
              </Th>
              <Th
                sorted={sortBy === "countryOfDelivery"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("countryOfDelivery")}
              >
                {t("countriesTable.countryOfDelivery")}
              </Th>
              <Th
                sorted={sortBy === "activity"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("activity")}
              >
                {t("countriesTable.activity")}
              </Th>
              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          <tbody>
            {status === "pending" && (
              <tr>
                <td>
                  {" "}
                  <LoadingOverlay loader={CustomLoader()} visible />
                </td>
              </tr>
            )}
            {rows.length > 0 && rows !== [] ? (
              rows
            ) : (
              <tr>
                <td colSpan={6}>
                  <Text weight={500} align="center">
                    {t("table.nothingFound")}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      <CountriesModal
        show={showCountriesModal}
        data={countriesModalData}
        onClose={closeCountriesModal}
      />
      <DeleteCountriesBanner  show={showDeleteCountriesBanner}
    data={deleteCountriesBannerData}
    onClose={closeDeleteBanner} />
    </>
  );
};

export default CountriesTable;
