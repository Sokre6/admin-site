import React, { useState, useMemo, useEffect } from "react";
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
  World,
} from "tabler-icons-react";
import LanguageModal from "./LanguageModal";
import DeleteBanner from "../common/DeleteBanner";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteLanguageThunk,
  fetchLanguageByCodeThunk,
  fetchLanguagesDataThunk,
} from "../../store/slices/language";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import TableCell from "../common/TableCell";

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
}));

const LanguageTable = ({ insertFunction }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState();

  const [deleteBannerVisible, setDeleteBannerVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState([]);

  const locale = useSelector((state) => state.settings.language);
  const tableData = useSelector((state) => state.language.tableData);

  const getLocalized = (inputArray) => {
    var defaultName = "";
    var localizedName = "";
    for (let i = 0; i < inputArray.length; i++) {
      if (inputArray[i].locale === locale) {
        localizedName = inputArray[i].name;
      } else if (inputArray[i].locale === "en") {
        defaultName = inputArray[i].name;
      }
    }
    return localizedName !== "" ? localizedName : defaultName;
  };

  const searchTableData = (data) => {
    if (search !== "") {
      var filteredData = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.code.toLowerCase().includes(search.toLowerCase()) ||
          item.activity.toLowerCase().includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };

  const sortTableData = (data) => {
    if (sortBy === "name") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.name.localeCompare(b.name))
        : data.sort((a, b) => a.name.localeCompare(b.name)).reverse();
    } else if (sortBy === "code") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.code.localeCompare(b.code))
        : data.sort((a, b) => a.code.localeCompare(b.code)).reverse();
    } else if (sortBy === "activity") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.activity.localeCompare(b.activity))
        : data.sort((a, b) => a.activity.localeCompare(b.activity)).reverse();
    } else {
      return data;
    }
  };

  const localizeTableData = (data) => {
    if (data.length === 0) {
      return [];
    } else {
      const keys = Object.keys(data[0]);
      if (keys[1] === "names") {
        let tableData = data.map((element) => ({
          code: element.code,
          activity: element.activity,
          name: getLocalized(element.names),
        }));
        return searchTableData(sortTableData(tableData));
      } else {
        return data;
      }
    }
  };
  const closeInsertModal = () => {
    setModalVisible(false);
    setIsUpdate(false);
    setUpdateData([]);
  };
  const updateItem = (data) => {
    setIsUpdate(true);
    setUpdateData(data);
    setModalVisible(true);
  };

  const showDeleteBanner = (data) => {
    setDeleteBannerVisible(true);
    setDeleteItem(data);
  };

  const closeDeleteBanner = () => {
    setDeleteBannerVisible(false);
  };

  const deleteLanguage = async () => {
    await dispatch(deleteLanguageThunk({ code: deleteItem.code }))
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
    dispatch(fetchLanguagesDataThunk());
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
      <tr key={row.code}>
        {TableCell(row.code)}
        {TableCell(row.name)}
        {TableCell(row.activity)}
        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={async () => {
                await dispatch(fetchLanguageByCodeThunk(row.code));
                navigate(row.code);
              }}
            >
              <World className={classes.tableIconsLogo} />
            </Button>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
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
                setIsUpdate(true);
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

  useEffect(() => {
    dispatch(fetchLanguagesDataThunk());
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
                sorted={sortBy === "code"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("code")}
              >
                {t("tableLanguages.code")}
              </Th>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                {t("tableLanguages.name")}
              </Th>
              <Th
                sorted={sortBy === "activity"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("activity")}
              >
                {t("tableLanguages.status")}
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
      <LanguageModal
        opened={modalVisible}
        onClose={closeInsertModal}
        isUpdate={isUpdate}
        updateData={updateData}
      />
      <DeleteBanner
        deleteMethod={deleteLanguage}
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

export default LanguageTable;
