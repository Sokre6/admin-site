import {
    Center,
    createStyles,
    Group,
    UnstyledButton,
    Text,
    Button,
    ScrollArea,
    TextInput,
    Table,
  } from "@mantine/core";
  import { useEffect, useMemo, useState } from "react";
  import { useTranslation } from "react-i18next";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import {
    ChevronDown,
    ChevronUp,
    Pencil,
    Search,
    Selector,
    World,
  } from "tabler-icons-react";

  import TableCell from "../common/TableCell";
  
  import dayjs from "dayjs";
import { fetchLegalDocumentsByTypeIdThunk, fetchLegalDocumentsByTypeThunk } from "../../store/slices/legalDocuments";
import AboutUsModal from "./AboutUsModal";
  
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
    insertButton: {
      alignSelf: "flex-end",
      backgroundColor: theme.colors.colorDarkGray,
      "&:hover": {
        backgroundColor: theme.colors.colorBlack,
      },
    },
  }));

const AboutUsTable=()=>{

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();

  const ABOUT_US = "ABOUT_US";

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);

  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const locale = useSelector((state) => state.settings.language);
  const tableData =
    useSelector((state) => state?.legalDocumentsByType?.tableData) || [];

  const navigate = useNavigate();

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

  const searchTableData = (data) => {
    if (search !== "") {
      let filteredData = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.type.toLowerCase().includes(search.toLowerCase()) ||
          dayjs(item.validFrom)
            .format("DD.MM.YYYY.")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          dayjs(item.validTo)
            .format("DD.MM.YYYY.")
            .toLowerCase()
            .includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };
  const getLocalizedName = (inputArray) => {
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
  const getLocalizedContent = (inputArray) => {
    let defaultContent = "";
    let localizedContent = "";
    for (let i = 0; i < inputArray.length; i++) {
      if (inputArray[i].locale === locale) {
        localizedContent = inputArray[i].content;
      } else if (inputArray[i].locale === "en") {
        defaultContent = inputArray[i].content;
      }
    }
    return localizedContent !== "" ? localizedContent : defaultContent;
  };
  const localizeTableData = (data) => {
    if (data.length === 0) {
      return [];
    } else {
      const tableData = data.map((element) => ({
        id: element.id,
        name: getLocalizedName(element?.descriptions),
        type: element.type,
        validFrom: element.validFrom,
        validTo: element.validTo,
        content: getLocalizedContent(element?.descriptions),
      }));
      return searchTableData(sortTableData(tableData));
    }
  };

  const sortTableData = (data) => {
    if (sortBy === "name") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.name.localeCompare(b.name))
        : data
            .slice()
            .sort((a, b) => a.type.localeCompare(b.type))
            .reverse();
    }
    if (sortBy === "type") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.type.localeCompare(b.type))
        : data
            .slice()
            .sort((a, b) => a.type.localeCompare(b.type))
            .reverse();
    }
    if (sortBy === "dateFrom") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort(
              (a, b) =>
                new Date(a.validFrom).getTime() -
                new Date(b.validFrom).getTime()
            )
        : data
            .slice()
            .sort(
              (a, b) =>
                new Date(a.validFrom).getTime() -
                new Date(b.validFrom).getTime()
            )
            .reverse();
    }
    if (sortBy === "dateTo") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort(
              (a, b) =>
                new Date(a.validTo).getTime() - new Date(b.validTo).getTime()
            )
        : data
            .slice()
            .sort(
              (a, b) =>
                new Date(a.validTo).getTime() - new Date(b.validTo).getTime()
            )
            .reverse();
    } else {
      return data;
    }
  };

  const rows = useMemo(() => {
    return localizeTableData(tableData).map((row) => (
      <tr key={row.id}>
        {TableCell(row.name)}
        {TableCell(row.type)}
        {TableCell(dayjs(row.validFrom).format("DD.MM.YYYY."))}
        {TableCell(dayjs(row.validTo).format("DD.MM.YYYY."))}

        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              variant="subtle"
              className={classes.tableIconsButton}
              onClick={async () => {
                await dispatch(fetchLegalDocumentsByTypeIdThunk(row.id));
                navigate(row.id);
              }}
            >
              <World className={classes.tableIconsLogo} />
            </Button>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={async () => {
                /* await dispatch(fetchProductCategoryByIdThunk({ id: row.id })); */
                
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

  useEffect(() => {
    dispatch(fetchLegalDocumentsByTypeThunk(ABOUT_US));
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
                {t("aboutUsTable.name")}
              </Th>
              <Th
                sorted={sortBy === "type"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("type")}
              >
                {t("aboutUsTable.type")}
              </Th>
              <Th
                sorted={sortBy === "dateFrom"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("dateFrom")}
              >
                {t("aboutUsTable.dateFrom")}
              </Th>
              <Th
                sorted={sortBy === "dateTo"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("dateTo")}
              >
                {t("aboutUsTable.dateTo")}
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
      <AboutUsModal
        opened={modalVisible}
        onClose={closeInsertModal}
        isUpdate={isUpdate}
        updateData={updateData}
        ABOUT_US={ABOUT_US}
      />
      </>)

}

export default AboutUsTable;