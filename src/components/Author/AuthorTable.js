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
import { showNotification } from "@mantine/notifications";
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
  Trash,
  World,
} from "tabler-icons-react";
import {
  deleteAuthorThunk,
  fetchAuthorByIdThunk,
  fetchAuthorsThunk,
} from "../../store/slices/author";
import DeleteBanner from "../common/DeleteBanner";
import TableCell from "../common/TableCell";
import AuthorModal from "./AuthorModal";

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

const AuthorTable = () => {
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
  const [deleteBannerVisible, setDeleteBannerVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState([]);

  const locale = useSelector((state) => state.settings.language);
  const tableData = useSelector((state) => state.author.tableData);

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

  const showDeleteBanner = (data) => {
    setDeleteBannerVisible(true);
    setDeleteItem(data);
  };

  const closeDeleteBanner = () => {
    setDeleteBannerVisible(false);
  };

  const deleteAuthor = async () => {
    await dispatch(deleteAuthorThunk({ id: deleteItem.id }))
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
    dispatch(fetchAuthorsThunk());
    closeDeleteBanner();
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
          item.givenName.toLowerCase().includes(search.toLowerCase()) ||
          item.familyName.toLowerCase().includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };

  const sortTableData = (data) => {
    if (sortBy === "givenName") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.givenName.localeCompare(b.givenName))
        : data
            .slice()
            .sort((a, b) => a.givenName.localeCompare(b.givenName))
            .reverse();
    }
    if (sortBy === "familyName") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.familyName.localeCompare(b.familyName))
        : data
            .slice()
            .sort((a, b) => a.familyName.localeCompare(b.familyName))
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
        localizedName = inputArray[i].description;
      } else if (inputArray[i].locale === "en") {
        defaultName = inputArray[i].description;
      }
    }

    return localizedName !== "" ? localizedName : defaultName;
  };

  const localizeTableData = (data) => {
    if (data.length === 0) {
      return [];
    } else {
      const keys = Object.keys(data[0]);

      if (keys[3] === "descriptions") {
        let tableData = data.map((element) => ({
          id: element.id,
          givenName: element.givenName,
          familyName: element.familyName,
          description: getLocalized(element.descriptions),
          socialMediaProfiles: element?.socialMediaProfiles,
          photoId: element.photoId,
        }));

        return searchTableData(sortTableData(tableData));
      } else {
        return data;
      }
    }
  };

  const rows = useMemo(() => {
    return localizeTableData(searchTableData(sortTableData(tableData))).map(
      (row) => (
        <tr key={row.id}>
          {TableCell(row.givenName)}
          {TableCell(row.familyName)}

          <td className={classes.buttonColumn}>
            <Group position="right" className={classes.buttonContainer}>
              <Button
                className={classes.tableIconsButton}
                variant="subtle"
                onClick={async () => {
                  await dispatch(fetchAuthorByIdThunk(row.id));

                  navigate(row.id);
                }}
              >
                <World className={classes.tableIconsLogo} />
              </Button>
              <Button
                className={classes.tableIconsButton}
                variant="subtle"
                onClick={async () => {
                  await dispatch(fetchAuthorByIdThunk(row.id));

                  updateModal(row);
                }}
              >
                <Pencil className={classes.tableIconsLogo} />
              </Button>
              <Button
                variant="subtle"
                className={classes.tableIconsButton}
                onClick={() => {
                  showDeleteBanner(row);
                  
                }}
              >
                <Trash className={classes.tableIconsTrash} />
              </Button>
            </Group>
          </td>
        </tr>
      )
    );
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
    dispatch(fetchAuthorsThunk());
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
                sorted={sortBy === "givenName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("givenName")}
              >
                {t("authorTable.name")}
              </Th>
              <Th
                sorted={sortBy === "familyName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("familyName")}
              >
                {t("authorTable.familyName")}
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
      <AuthorModal
        opened={modalVisible}
        onClose={closeInsertModal}
        isUpdate={isUpdate}
        updateData={updateData}
      />
      <DeleteBanner
        deleteMethod={deleteAuthor}
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

export default AuthorTable;
