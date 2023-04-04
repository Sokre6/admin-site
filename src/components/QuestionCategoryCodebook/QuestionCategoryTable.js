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
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import DeleteBanner from "../common/DeleteBanner";
import { useNavigate } from "react-router-dom";
import {
  deleteQuestionCategoryThunk,
  fetchQuestionCategoryByCodeThunk,
  fetchQuestionCategoryDataThunk,
} from "../../store/slices/questionCategory";
import QuestionCategoryModal from "./QuestionCategoryModal";
import TableCell from "../common/TableCell";

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
  insertButton: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
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
  searchInput: {
    width: "25vw",
    marginBottom: "0px !important",
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
  searchInputMargin: {
    marginBottom: "0px",
  },
  tableIconsTrash: {
    color: theme.colors.colorRed,
    "&:hover": {
      color: theme.colors.colorRed,
    },
  },
}));

const QuestionCategoryTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const locale = useSelector((state) => state.settings.language);
  const tableData = useSelector((state) => state.questionCategory.tableData);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteBannerVisible, setDeleteBannerVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState([]);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const showDeleteBanner = (data) => {
    setDeleteBannerVisible(true);
    setDeleteItem(data);
  };

  const closeInsertModal = () => {
    setModalVisible(false);
    setIsUpdate(false);
    setUpdateData([]);
  };

  const closeDeleteBanner = () => {
    setDeleteBannerVisible(false);
  };
  const getLocalized = (inputArray) => {
    var defaultName = "";
    var localizedName = "";
    for (let i = 0; i < inputArray.length; i++) {
      if (inputArray[i].locale === locale) {
        localizedName = inputArray[i].value;
      } else if (inputArray[i].locale === "en") {
        defaultName = inputArray[i].value;
      }
    }
    return localizedName !== "" ? localizedName : defaultName;
  };

  const sortTableData = (data) => {
    if (sortBy === "name") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.name.localeCompare(b.name))
        : data.sort((a, b) => a.name.localeCompare(b.name)).reverse();
    } else if (sortBy === "active") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.active.localeCompare(b.active))
        : data.sort((a, b) => a.active.localeCompare(b.active)).reverse();
    } else if (sortBy === "ordinalNumber") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.ordinalNumber - b.ordinalNumber)
        : data.sort((a, b) => a.ordinalNumber - b.ordinalNumber).reverse();
    } else {
      return data;
    }
  };

  const searchTableData = (data) => {
    if (search !== "") {
      var filteredData = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.active.toLowerCase().includes(search.toLowerCase()) ||
          String(item.ordinalNumber).includes(search.toLowerCase())
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
      const keys = Object.keys(data[0]);
      if (keys[1] === "names") {
        var tableData = data.map((element) => ({
          id: element.id,
          name: getLocalized(element.names),
          active: element.active,
          ordinalNumber: element.ordinalNumber,
        }));
        return searchTableData(sortTableData(tableData));
      } else {
        return data;
      }
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
      <tr key={row.id}>
        {TableCell(row.name)}
        {TableCell(row.active)}
        {TableCell(row.ordinalNumber)}
        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={async () => {
                await dispatch(fetchQuestionCategoryByCodeThunk(row.id));
                navigate(row.id);
              }}
            >
              <World className={classes.tableIconsLogo} />
            </Button>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={() => {
                updateQuestionCategory(row);
              }}
            >
              <Pencil className={classes.tableIconsLogo} />
            </Button>

            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={() => {
                showDeleteBanner();
                setDeleteItem(row);
              }}
            >
              <Trash className={classes.tableIconsTrash} />
            </Button>
          </Group>
        </td>
      </tr>
    ));
   
  }, [sortBy, search, reverseSortDirection, tableData]);

  const deleteQuestionCategory = async () => {
    await dispatch(deleteQuestionCategoryThunk(deleteItem.id));
    dispatch(fetchQuestionCategoryDataThunk())
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
  };

  const updateQuestionCategory = async (data) => {
    setIsUpdate(true);
    setUpdateData(data);
    setModalVisible(true);
  };

  useEffect(() => {
    dispatch(fetchQuestionCategoryDataThunk());
    
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
                {t("questionCategoryTable.name")}
              </Th>
              <Th
                sorted={sortBy === "active"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("active")}
              >
                {t("questionCategoryTable.active")}
              </Th>
              <Th
                sorted={sortBy === "ordinalNumber"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("ordinalNumber")}
              >
                {t("questionCategoryTable.order")}
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
      <QuestionCategoryModal
        opened={modalVisible}
        onClose={closeInsertModal}
        isUpdate={isUpdate}
        updateData={updateData}
      />
      <DeleteBanner
        deleteMethod={deleteQuestionCategory}
        centered={true}
        opened={deleteBannerVisible}
        onClose={closeDeleteBanner}
        modalTitle={t("deleteBanner.title")}
        message={t("deleteBanner.specificMessage")}
        okButtonText={t("deleteBanner.okButton")}
        cancelButtonText={t("deleteBanner.cancelButton")}
      />
    </>
  );
};
export default QuestionCategoryTable;
