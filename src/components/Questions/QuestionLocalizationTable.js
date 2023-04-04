import React, { useEffect, useMemo, useState } from "react";
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
} from "tabler-icons-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DeleteBanner from "../common/DeleteBanner";
import { showNotification } from "@mantine/notifications";
import {
  fetchQuestionByIdThunk,
  updateQuestionThunk,
} from "../../store/slices/question";
import QuestionLocalizationModal from "./QuestionLocalizationModal";
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
  searchInput: {
    width: "25vw",
    marginBottom: "0px !important",
  },
  searchInputMargin: {
    marginBottom: "0px",
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
}));

const QuestionLocalizationTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const tableData = useSelector((state) => state.questions.questionData);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteBannerVisible, setDeleteBannerVisible] = useState(false);
  const [deleteData, setDeleteData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  let params = useParams();

  useEffect(() => {
    dispatch(fetchQuestionByIdThunk(params.questionId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible, deleteBannerVisible]);
  useEffect(() => {}, [tableData]);

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

  const closeModal = async () => {
    setModalVisible(false);
    setIsUpdate(false);
    setUpdateData([]);
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

  const sortTableData = (data) => {
    data = [...data];
    if (sortBy === "locale") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.locale.localeCompare(b.locale))
        : data.sort((a, b) => a.locale.localeCompare(b.locale)).reverse();
    } else if (sortBy === "question") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.question.localeCompare(b.question))
        : data.sort((a, b) => a.question.localeCompare(b.question)).reverse();
    } else if (sortBy === "answer") {
      return !reverseSortDirection
        ? data.sort((a, b) => a.answer.localeCompare(b.answer))
        : data.sort((a, b) => a.answer.localeCompare(b.answer)).reverse();
    } else {
      return data;
    }
  };

  const searchTableData = (data) => {
    if (search !== "") {
      var filteredData = data.filter(
        (item) =>
          item.locale.toLowerCase().includes(search.toLowerCase()) ||
          item.question.toLowerCase().includes(search.toLowerCase()) ||
          item.answer.includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };
  const rows = useMemo(() => {
    return searchTableData(sortTableData(tableData)).map((row) => (
      <tr key={row.locale}>
        {TableCell(row.locale)}
        {TableCell(row.question)}
        {TableCell(row.answer)}
        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              variant="subtle"
              className={classes.tableIconsButton}
              onClick={() => updateQuestionLocalization(row)}
            >
              <Pencil className={classes.tableIconsLogo} />
            </Button>
            <Button
              disabled={row.locale === "en" ? true : false}
              variant="subtle"
              className={classes.tableIconsButton}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, search, reverseSortDirection, tableData]);

  const addNewQuestionLocalization = () => {
    setModalData(tableData);
    setModalVisible(true);
  };

  const updateQuestionLocalization = (data) => {
    setIsUpdate(true);
    setModalData(tableData);
    setUpdateData(data);
    setModalVisible(true);
  };

  const deleteQuestionLocalization = async () => {
    var deleteItem = [];
    await dispatch(fetchQuestionByIdThunk(deleteData.id))
      .unwrap()
      .then((response) => {
        deleteItem = response;
      })
      .catch((e) => {
        showNotification({
          message: t("questionLocalizationModal.insertFailed"),
          color: "red",
        });
      });
    var updateObject = {
      questions: deleteItem.questions.filter(
        (item) => item.locale !== deleteData.locale
      ),
      answers: deleteItem.answers.filter(
        (item) => item.locale !== deleteData.locale
      ),
      questionCategoryId: deleteItem.questionCategoryId,
      activity: deleteItem.activity,
      ordinalNumber: deleteItem.ordinalNumber,
    };
    await dispatch(
      updateQuestionThunk({ updateData: deleteData, updateObject })
    )
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
    await dispatch(fetchQuestionByIdThunk(deleteData.id));
    closeDeleteBanner();
  };

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
          onClick={() => addNewQuestionLocalization()}
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
          <thead>
            <tr>
              <Th
                sorted={sortBy === "locale"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("locale")}
              >
                {t("questionLocalizationTable.locale")}
              </Th>
              <Th
                sorted={sortBy === "question"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("question")}
              >
                {t("questionLocalizationTable.question")}
              </Th>
              <Th
                sorted={sortBy === "answer"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("answer")}
              >
                {t("questionLocalizationTable.answer")}
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
      <QuestionLocalizationModal
        opened={modalVisible}
        onClose={closeModal}
        modalData={modalData}
        isUpdate={isUpdate}
        updateData={updateData}
      />
      <DeleteBanner
        deleteMethod={deleteQuestionLocalization}
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

export default QuestionLocalizationTable;
