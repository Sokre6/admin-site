import {
  Center,
  createStyles,
  Group,
  ScrollArea,
  Table,
  TextInput,
  UnstyledButton,
  Text,
  Select,
} from "@mantine/core";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronUp, Search, Selector } from "tabler-icons-react";
import {
  fetchApplicableCountriesThunk,
  fetchOfficesThunk,
} from "../../store/slices/office";
import TableCell from "../common/TableCell";
import { status } from "./heplers";

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
  searchInputMargin: {
    marginBottom: "0px",
  },
  thead: {
    borderBottom: `1px solid #dee2e6`,
  },
}));

const OfficeTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);

  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [countryCode, setCountryCode] = useState("HR");
  const [statusValue, setStatusValue] = useState("");

  const applicableCountriesData = useSelector(
    (state) => state.office.applicableCountriesData
  );
  const tableData = useSelector((state) => state.office.tableData);

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const Th = ({ children, reversed, sorted, onSort }) => {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;

    return (
      <th className={classes.th}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="left" noWrap>
            <Text style={{ whiteSpace: "nowrap" }} weight={500} size="sm">
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

  useEffect(() => {
    dispatch(fetchApplicableCountriesThunk());
  }, []);

  useEffect(() => {
    dispatch(fetchOfficesThunk(countryCode.toUpperCase()));
  }, [countryCode]);

  const renameString = (value) => {
    if (value === "CLOSED_PERMANENTLY") {
      return "CLOSED PERMANENTLY";
    } else {
      return value;
    }
  };

  const searchByStatus = (data) => {
    if (statusValue !== "" && statusValue !== null) {
      let filteredData = data.filter(
        (item) => renameString(item.status) === statusValue
      );

      return filteredData;
    } else {
      return data;
    }
  };

  const searchTableData = (data) => {
    if (search !== "") {
      let filteredData = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.countryCode.toLowerCase().includes(search.toLowerCase()) ||
          item.region.toLowerCase().includes(search.toLowerCase()) ||
          item.place.toLowerCase().includes(search.toLowerCase()) ||
          item.postalCode.toLowerCase().includes(search.toLowerCase()) ||
          item.street.toLowerCase().includes(search.toLowerCase()) ||
          item.houseNumber.toLowerCase().includes(search.toLowerCase()) ||
          item.telephone.toLowerCase().includes(search.toLowerCase()) ||
          renameString(item.status)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          item.emailAddress.toLowerCase().includes(search.toLowerCase()) ||
          item.locationLatitude
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          item.locationLongitude
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };

  const sortTableData = (data) => {
    if (sortBy === "name") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.name.localeCompare(b.name))
        : data
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .reverse();
    }
    if (sortBy === "countryCode") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort((a, b) => a.countryCode.localeCompare(b.countryCode))
        : data
            .slice()
            .sort((a, b) => a.countryCode.localeCompare(b.countryCode))
            .reverse();
    }
    if (sortBy === "region") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.region.localeCompare(b.region))
        : data
            .slice()
            .sort((a, b) => a.region.localeCompare(b.region))
            .reverse();
    }
    if (sortBy === "place") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.place.localeCompare(b.place))
        : data
            .slice()
            .sort((a, b) => a.place.localeCompare(b.place))
            .reverse();
    }
    if (sortBy === "postalCode") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.postalCode.localeCompare(b.postalCode))
        : data
            .slice()
            .sort((a, b) => a.postalCode.localeCompare(b.postalCode))
            .reverse();
    }
    if (sortBy === "street") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.street.localeCompare(b.street))
        : data
            .slice()
            .sort((a, b) => a.street.localeCompare(b.street))
            .reverse();
    }
    if (sortBy === "houseNumber") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort((a, b) => a.houseNumber.localeCompare(b.houseNumber))
        : data
            .slice()
            .sort((a, b) => a.houseNumber.localeCompare(b.houseNumber))
            .reverse();
    }
    if (sortBy === "telephone") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.telephone.localeCompare(b.telephone))
        : data
            .slice()
            .sort((a, b) => a.telephone.localeCompare(b.telephone))
            .reverse();
    }
    if (sortBy === "status") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort((a, b) =>
              renameString(a.status).localeCompare(renameString(b.status))
            )
        : data
            .slice()
            .sort((a, b) =>
              renameString(a.status).localeCompare(renameString(b.status))
            )
            .reverse();
    }
    if (sortBy === "emailAddress") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort((a, b) => a.emailAddress.localeCompare(b.emailAddress))
        : data
            .slice()
            .sort((a, b) => a.emailAddress.localeCompare(b.emailAddress))
            .reverse();
    }
    if (sortBy === "locationLatitude") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort(
              (a, b) =>
                parseFloat(a.locationLatitude) - parseFloat(b.locationLatitude)
            )
        : data
            .slice()
            .sort(
              (a, b) =>
                parseFloat(a.locationLatitude) - parseFloat(b.locationLatitude)
            )
            .reverse();
    }
    if (sortBy === "locationLongitude") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort(
              (a, b) =>
                parseFloat(a.locationLongitude) -
                parseFloat(b.locationLongitude)
            )
        : data
            .slice()
            .sort(
              (a, b) =>
                parseFloat(a.locationLongitude) -
                parseFloat(b.locationLongitude)
            )
            .reverse();
    } else {
      return data;
    }
  };
  const prepareTableData = (data) => {
    if (data.length === 0) {
      return [];
    } else {
      return searchTableData(searchByStatus(sortTableData(data)));
    }
  };

  const rows = prepareTableData(tableData).map((row) => (
    <tr key={row.id}>
      {TableCell(row.name)}
      {TableCell(row.countryCode)}
      {TableCell(row.region)}
      {TableCell(row.place)}
      {TableCell(row.postalCode)}
      {TableCell(row.street)}
      {TableCell(row.houseNumber)}
      {TableCell(row.telephone)}
      {TableCell(
        row.status === "CLOSED_PERMANENTLY" ? "CLOSED PERMANENTLY" : row.status
      )}
      {TableCell(row.emailAddress)}
      {TableCell(parseFloat(row.locationLatitude))}
      {TableCell(parseFloat(row.locationLongitude))}
    </tr>
  ));

  return (
    <>
      <ScrollArea className={classes.scrollArea}>
        <div className={classes.searchAndButtonContainter}>
          <Group>
            <TextInput
              className={classes.searchInput}
              placeholder={t("table.search")}
              mb="md"
              icon={<Search size={14} />}
              value={search}
              onChange={handleSearchChange}
            />

            <Select
              value={countryCode}
              data={applicableCountriesData}
              onChange={setCountryCode}
              placeholder={t("office.codeInputPlaceholder")}
              searchable
            />
            <Select
              value={statusValue}
              data={status}
              placeholder={t("office.status")}
              onChange={setStatusValue}
              searchable
              clearable
            />
          </Group>
        </div>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{ tableLayout: "auto", minWidth: 700, overflowX: "auto" }}
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                {t("officeTable.name")}
              </Th>
              <Th
                sorted={sortBy === "countryCode"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("countryCode")}
              >
                {t("officeTable.countryCode")}
              </Th>
              <Th
                sorted={sortBy === "region"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("region")}
              >
                {t("officeTable.region")}
              </Th>
              <Th
                sorted={sortBy === "place"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("place")}
              >
                {t("officeTable.place")}
              </Th>
              <Th
                sorted={sortBy === "postalCode"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("postalCode")}
              >
                {t("officeTable.postalCode")}
              </Th>
              <Th
                sorted={sortBy === "street"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("street")}
              >
                {t("officeTable.street")}
              </Th>
              <Th
                sorted={sortBy === "houseNumber"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("houseNumber")}
              >
                {t("officeTable.houseNumber")}
              </Th>
              <Th
                sorted={sortBy === "telephone"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("telephone")}
              >
                {t("officeTable.telephone")}
              </Th>
              <Th
                sorted={sortBy === "status"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("status")}
              >
                {t("officeTable.status")}
              </Th>
              <Th
                sorted={sortBy === "emailAddress"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("emailAddress")}
              >
                {t("officeTable.emailAddress")}
              </Th>
              <Th
                sorted={sortBy === "locationLatitude"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("locationLatitude")}
              >
                {t("officeTable.locationLatitude")}
              </Th>
              <Th
                sorted={sortBy === "locationLongitude"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("locationLongitude")}
              >
                {t("officeTable.locationLongitude")}
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 && rows !== [] ? (
              rows
            ) : (
              <tr>
                <td colSpan={7}>
                  <Text weight={500} align="center">
                    {t("table.nothingFound")}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default OfficeTable;
