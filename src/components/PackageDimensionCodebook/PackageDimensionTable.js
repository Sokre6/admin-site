import {
  Button,
  Center,
  createStyles,
  Group,
  ScrollArea,
  Table,
  TextInput,
  UnstyledButton,
  Text,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Search,
  Selector,
  Trash,
} from "tabler-icons-react";
import { fetchManufacturersThunk } from "../../store/slices/manufacturers";
import { fetchPackageDimensionDataThunk } from "../../store/slices/packageDimension";
import TableCell from "../common/TableCell";
import DeletePackageDimensionBanner from "./DeletePackageDimensionBanner";
import PackageDimensionModal from "./PackageDimensionModal";

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

const PackageDimensionTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();

  const tableData = useSelector((state) => state.packageDimension.tableData);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);

  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [showPackageDimensionModal, setShowPackageDimensionModal] =
    useState(false);
  const [packageDimensionModalData, setPackageDimensionModalData] =
    useState(null);

  const [showDeletePackageDimensionModal, setShowDeletePackageDimensionModal] =
    useState(false);
  const [deletePackageDimensionModalData, setDeletePackageDimensionModalData] =
    useState(false);

  const openPackageDimensionModal = (data) => {
    setPackageDimensionModalData(data);
    setShowPackageDimensionModal(true);
  };
  const closePackageDimensionModal = () => {
    setPackageDimensionModalData(null);
    setShowPackageDimensionModal(false);
  };


  
  const showDeleteModal = (data) => {
    setShowDeletePackageDimensionModal(true);
    setDeletePackageDimensionModalData(data);
  };

  const closeDeletePackageDimensionModal = () => {
    setShowDeletePackageDimensionModal(false);
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

  const searchTableData = (data) => {
    if (search !== "") {
      let filteredData = data.filter((item) =>
        item.description.toLowerCase().includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };

  const sortTableData = (data) => {
    if (sortBy === "description") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort((a, b) => a.description.localeCompare(b.description))
        : data
            .slice()
            .sort((a, b) => a.description.localeCompare(b.description))
            .reverse();
    } else {
      return data;
    }
  };

  const prepareTableData = (data) => {
    if (data.length === 0) {
      return [];
    } else {
      return searchTableData(sortTableData(data));
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

  const rows = prepareTableData(tableData).map((row) => (
    <tr key={row.id}>
      {TableCell(row.description)}
      <td className={classes.buttonColumn}>
        <Group position="right" className={classes.buttonContainer}>
          <Button
            className={classes.tableIconsButton}
            variant="subtle"
            onClick={() => {
              openPackageDimensionModal(row);
            }}
          >
            <Pencil className={classes.tableIconsLogo} />
          </Button>

          <Button
            className={classes.tableIconsButton}
            variant="subtle"
            onClick={() => showDeleteModal(row)}
          >
            <Trash className={classes.tableIconsTrash} />
          </Button>
        </Group>
      </td>
    </tr>
  ));
  useEffect(() => {
    dispatch(fetchPackageDimensionDataThunk());
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
            onClick={() => openPackageDimensionModal()}
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
                sorted={sortBy === "description"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("description")}
              >
                {t("packageDimensionTable.packageDimension")}
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
      <PackageDimensionModal
        show={showPackageDimensionModal}
        data={packageDimensionModalData}
        onClose={closePackageDimensionModal}
      />
      <DeletePackageDimensionBanner
       show={showDeletePackageDimensionModal}
       data={deletePackageDimensionModalData}
       onClose={closeDeletePackageDimensionModal}/>
    </>
  );
};

export default PackageDimensionTable;
