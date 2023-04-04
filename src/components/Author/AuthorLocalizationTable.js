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
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Search,
  Selector,
  Trash,
} from "tabler-icons-react";
import {
  fetchAuthorByIdThunk,
  updateAuthorThunk,
} from "../../store/slices/author";
import DeleteBanner from "../common/DeleteBanner";
import TableCell from "../common/TableCell";
import AuthorLocalizationModal from "./AuthorLocalizationModal";

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

const AuthorLocalizationTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const params = useParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteBannerVisible, setDeleteBannerVisible] = useState(false);
  const [deleteData, setDeleteData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState([]);

  const tableData = useSelector((state) => state.author.authorDataById);

  const updateAuthorLocalizationModal = (data) => {
    setModalData(tableData);
    setIsUpdate(true);
    setModalVisible(true);
    setUpdateData(data);
  };
  const createNewAuthorLocalizationModal = () => {
    setIsUpdate(false);
    setModalVisible(true);
  };
  const closeModal = async () => {
    setModalVisible(false);
    setIsUpdate(false);
    setModalData([]);
    setUpdateData([]);
  };
  const closeDeleteBanner = () => {
    setDeleteBannerVisible(false);
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
  const sortTableData = (tableData) => {
    const data = [...tableData.descriptions];
    if (sortBy === "locale") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.locale.localeCompare(b.locale))
        : data.sort((a, b) => a.locale.localeCompare(b.locale)).reverse();
    } else if (sortBy === "description") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.description.localeCompare(b.description))
        : data
            .sort((a, b) => a.description.localeCompare(b.description))
            .reverse();
    } else {
      return data;
    }
  };
  const searchTableData = (data) => {
    if (search !== "") {
      const filteredData = data.filter(
        (item) =>
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.locale.toLowerCase().includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };

  const prepareDeleteObject = (data) => {
    const object = {
      givenName: tableData.givenName,
      familyName: tableData.familyName,
      photoId: tableData.photoId,
      socialMediaProfiles: tableData.socialMediaProfiles,
      descriptions: data,
    };

    return object;
  };

  const deleteAuthorLocalization = async () => {
    let updateData = tableData.descriptions.filter(
      (item) => item.locale !== deleteData.locale
    );

    let updateObject = prepareDeleteObject(updateData);

    await dispatch(updateAuthorThunk({ id: tableData.id, data: updateObject }))
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
    closeDeleteBanner();
    dispatch(fetchAuthorByIdThunk(params.authorId));
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
    return searchTableData(sortTableData(tableData)).map((row) => (
      <tr key={row.locale}>
        {TableCell(row.locale)}
        {TableCell(row.description)}
        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={() => updateAuthorLocalizationModal(row)}
            >
              <Pencil className={classes.tableIconsLogo} />
            </Button>
            <Button
              disabled={row.locale === "en" ? true : false}
              className={classes.tableIconsButton}
              variant="subtle"
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
  }, [sortBy, search, reverseSortDirection, tableData]);

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
            onClick={() => createNewAuthorLocalizationModal()}
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
                {t("authorLocaleTable.locale")}
              </Th>
              <Th
                sorted={sortBy === "description"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("description")}
              >
                {t("authorLocaleTable.description")}
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
      <AuthorLocalizationModal
        opened={modalVisible}
        onClose={closeModal}
        modalData={modalData}
        isUpdate={isUpdate}
        updateData={updateData}
      />
      <DeleteBanner
        deleteMethod={deleteAuthorLocalization}
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

export default AuthorLocalizationTable;
