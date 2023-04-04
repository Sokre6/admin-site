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
  Upload,
  ArrowsDownUp,
  Article,
  BookOff,
  Book,
 
} from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import DeleteBanner from "../common/DeleteBanner";
import { useNavigate } from "react-router-dom";
import {
  deleteQuestionThunk,
  fetchQuestionByIdThunk,
  fetchQuestionsDataThunk,
  updateQuestionActivityThunk,
} from "../../store/slices/question";
import QuestionsModal from "./QuestionsModal";
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
  tableRoot: {
    tableLayout: "fixed",
    minWidth: 700,
  },
}));

const QuestionsTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const locale = useSelector((state) => state.settings.language);
  const tableData = useSelector((state) => state.questions.tableData);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteBannerVisible, setDeleteBannerVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState([]);

  const closeInsertModal = () => {
    setModalVisible(false);
    setIsUpdate(false);
    setUpdateData([]);
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

  const closeDeleteBanner = () => {
    setDeleteBannerVisible(false);
  };

  const showDeleteBanner = () => {
    setDeleteBannerVisible(true);
  };

  const deleteQuestion = async () => {
    await dispatch(deleteQuestionThunk(deleteItem))
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
    dispatch(fetchQuestionsDataThunk());
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
  const updateItem = (data) => {
    setIsUpdate(true);
    setUpdateData(data);
    setModalVisible(true);
  };
  const localizeTableData = (data) => {
    if (data.length === 0) {
      return [];
    } else {
      var tableData = data.map((element) => ({
        id: element.id,
        category: element.questionCategoryName,
        categoryId: element.questionCategoryId,
        question: getLocalized(element.questions),
        answer: getLocalized(element.answers),
        status: element.activity,
        ordinalNumber: element.ordinalNumber,
      }));
      return searchTableData(sortTableData(tableData));
    }
  };
  const searchTableData = (data) => {
    if (search !== "") {
      var filteredData = data.filter(
        (item) =>
          item.category.toLowerCase().includes(search.toLowerCase()) ||
          item.question.toLowerCase().includes(search.toLowerCase()) ||
          item.answer.toLowerCase().includes(search.toLowerCase()) ||
          item.status.toLowerCase().includes(search.toLowerCase()) ||
          String(item.ordinalNumber).includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };
  const sortTableData = (data) => {
    if (sortBy === "question") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.question.localeCompare(b.question))
        : data.sort((a, b) => a.question.localeCompare(b.question)).reverse();
    } else if (sortBy === "answer") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.answer.localeCompare(b.answer))
        : data.sort((a, b) => a.answer.localeCompare(b.answer)).reverse();
    } else if (sortBy === "category") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.category.localeCompare(b.category))
        : data.sort((a, b) => a.category.localeCompare(b.category)).reverse();
    } else if (sortBy === "status") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.status.localeCompare(b.status))
        : data.sort((a, b) => a.status.localeCompare(b.status)).reverse();
    }else if (sortBy === "ordinalNumber") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.ordinalNumber - b.ordinalNumber)
        : data.sort((a, b) => a.ordinalNumber - b.ordinalNumber).reverse();
    }else {
      return data;
    }
  };

  const changeQuestionActivity = async (data) => {
    await dispatch(
      updateQuestionActivityThunk({
        id: data.id,
        activity: data.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      })
    );
    await dispatch(fetchQuestionsDataThunk());
  };
  const rows = useMemo(() => {
    return localizeTableData(tableData).map((row) => (
      <tr key={row.id}>
        {TableCell(row.category)}
        {TableCell(row.question)}
        {TableCell(row.answer)}
        {TableCell(row.status)}
        {TableCell(row.ordinalNumber)}
        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              variant="subtle"
              className={classes.tableIconsButton}
              onClick={async () => {
                changeQuestionActivity(row);
               
              }}
            >
             {row.status==="ACTIVE" ? <Book className={classes.tableIconsLogo} /> :<BookOff
              className={classes.tableIconsLogo}/>}
            </Button>
            <Button
              variant="subtle"
              className={classes.tableIconsButton}
              onClick={async () => {
                await dispatch(fetchQuestionByIdThunk(row.id));
                navigate(row.id);
              }}
            >
              <World className={classes.tableIconsLogo} />
            </Button>
            <Button
              variant="subtle"
              className={classes.tableIconsButton}
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
                setIsUpdate(true);
                setDeleteItem(row);
                showDeleteBanner();
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
    dispatch(fetchQuestionsDataThunk());
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
          className={classes.tableRoot}
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === "category"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("category")}
              >
                {t("questionTable.questionCategory")}
              </Th>
              <Th
                sorted={sortBy === "question"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("question")}
              >
                {t("questionTable.question")}
              </Th>
              <Th
                sorted={sortBy === "answer"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("answer")}
              >
                {t("questionTable.answer")}
              </Th>
              <Th
                sorted={sortBy === "status"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("status")}
              >
                {t("questionTable.status")}
              </Th>
              <Th
                sorted={sortBy === "ordinalNumber"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("ordinalNumber")}
              >
                {t("questionTable.ordinalNumber")}
              </Th>
              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 && rows !== [] ? (
              rows
            ) : (
              <tr>
                <td colSpan={4}>
                  <Text weight={500} align="center">
                    {t("table.nothingFound")}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      <QuestionsModal
        opened={modalVisible}
        onClose={closeInsertModal}
        isUpdate={isUpdate}
        updateData={updateData}
      />
      <DeleteBanner
        deleteMethod={deleteQuestion}
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
export default QuestionsTable;
