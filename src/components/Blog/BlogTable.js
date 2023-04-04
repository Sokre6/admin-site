import {
  Button,
  Center,
  createStyles,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Search,
  Selector,
  World,
} from "tabler-icons-react";
import { fetchBlogByIdThunk, fetchBlogsThunk } from "../../store/slices/blog";
import TableCell from "../common/TableCell";
import BlogModal from "./BlogModal";

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

const BlogTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const locale = useSelector((state) => state.settings.language);
  const tableData = useSelector((state) => state.blog.tableData);

  const closeInsertModal = () => {
    setModalVisible(false);
    setIsUpdate(false);
    setUpdateData([]);
  };
  const updateModal = (data) => {
    setIsUpdate(true);
    setUpdateData(data);
    setModalVisible(true);
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
      let filteredData = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.colorHexCode.toLowerCase().includes(search.toLowerCase())
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
    if (sortBy === "colorHexCode") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort((a, b) => a.colorHexCode.localeCompare(b.colorHexCode))
        : data
            .slice()
            .sort((a, b) => a.colorHexCode.localeCompare(b.colorHexCode))
            .reverse();
    } else {
      return data;
    }
  };

  const getLocalized = (inputArray) => {
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
      const keys = Object.keys(data[0]);

      if (keys[1] === "names") {
        let tableData = data.map((element) => ({
          id: element.id,
          colorHexCode: element.colorHexCode,
          name: getLocalized(element.names),
        }));
        return searchTableData(sortTableData(tableData));
      } else {
        return data;
      }
    }
  };

  const rows = useMemo(() => {
    return localizeTableData(tableData).map((row) => (
      <tr key={row.id}>
        {TableCell(row.name)}
        {TableCell(row.colorHexCode)}

        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={async () => {
                await dispatch(fetchBlogByIdThunk(row.id));

                navigate(row.id);
              }}
            >
              <World className={classes.tableIconsLogo} />
            </Button>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={() => {
                updateModal(row);
              }}
            >
              <Pencil className={classes.tableIconsLogo} />
            </Button>
          </Group>
        </td>
      </tr>
    ));
  }, [sortBy, search, reverseSortDirection, tableData]);

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

  useEffect(() => {
    dispatch(fetchBlogsThunk());
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
            onClick={() => {
              setIsUpdate(false);
              setModalVisible(true);
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
                {t("blogTable.name")}
              </Th>
              <Th
                sorted={sortBy === "colorHexCode"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("colorHexCode")}
              >
                {t("blogTable.hexCode")}
              </Th>
              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          {
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
          }
        </Table>
      </ScrollArea>
      <BlogModal
        opened={modalVisible}
        onClose={closeInsertModal}
        isUpdate={isUpdate}
        updateData={updateData}
      />
    </>
  );
};

export default BlogTable;
