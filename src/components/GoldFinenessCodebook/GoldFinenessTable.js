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
import { fetchGoldFinenessDataThunk } from "../../store/slices/goldFineness";
import TableCell from "../common/TableCell";
import DeleteGoldFinenessBanner from "./DeleteGoldFinenessBanner";
import GoldFinesessModal from "./GoldFinenessModal";

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

const GoldFinenessTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);

  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const tableData = useSelector((state) => state.goldFineness.tableData);

  const [showGoldFinenessModal, setShowGoldFinenessModal] = useState(false);
  const [goldFinenessModalData, setGoldFinenessModalData] = useState(null);
  const [showDeleteGoldFinenessBanner, setShowDeleteGoldFinenessBanner] =
    useState(false);
  const [deleteGoldFinenessBannerData, setDeleteGoldFinenessBannerData] =
    useState(false);

  const openGoldFinenessModal = (data) => {
    setGoldFinenessModalData(data);
    setShowGoldFinenessModal(true);
  };

  const closeGoldFinenessModal = () => {
    setGoldFinenessModalData(null);
    setShowGoldFinenessModal(false);
  };

  const showDeleteBanner = (data) => {
    setShowDeleteGoldFinenessBanner(true);
    setDeleteGoldFinenessBannerData(data);
  };
  const closeDeleteBanner = () => {
    setShowDeleteGoldFinenessBanner(false);
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

  const prepareTableData = (data) => {
    if (data.length === 0) {
      return [];
    } else {
      return searchTableData(sortTableData(data));
    }
  };

  const searchTableData = (data) => {
    if (search !== "") {
      let filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
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
    } else {
      return data;
    }
  };

  const rows = prepareTableData(tableData).map((row) => (
    <tr key={row.id}>
      {TableCell(row.name)}
      <td className={classes.buttonColumn}>
        <Group position="right" className={classes.buttonContainer}>
          <Button
            className={classes.tableIconsButton}
            variant="subtle"
            onClick={() => {
              openGoldFinenessModal(row);
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

  useEffect(() => {
    dispatch(fetchGoldFinenessDataThunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            onClick={() => openGoldFinenessModal()}
          >
            <Plus size={18} />
          </Button>
        </div>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{ tableLayout: "fixed", minWidth: 700 }}
        >
          <thead className={classes.thead}>
            <tr>
              <Th
                className={classes.buttonColumn}
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                {t("goldFinenesTable.name")}
              </Th>
              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 && rows !== [] ? (
              rows
            ) : (
              <tr>
                <td colSpan={1}>
                  <Text weight={500} align="center">
                    {t("table.nothingFound")}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      <GoldFinesessModal
        show={showGoldFinenessModal}
        data={goldFinenessModalData}
        onClose={closeGoldFinenessModal}
      />
      <DeleteGoldFinenessBanner
        show={showDeleteGoldFinenessBanner}
        data={deleteGoldFinenessBannerData}
        onClose={closeDeleteBanner}
      />
    </>
  );
};

export default GoldFinenessTable;
