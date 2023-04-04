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
  Calculator,
  Pencil,
  World,
} from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDeliveryMethodByIdThunk,
  fetchDeliveryMethodDataThunk,
} from "../../store/slices/deliveryMethod";
import DeliveryMethodModal from "./DeliveryMethodModal";
import { fetchDeliveryCostData } from "../../store/slices/deliveryCost";
import TableCell from "../common/TableCell";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },
  tableStyle: {
    tableLayout: "fixed",
    minWidth: 700,
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
  searchInput: {
    width: "25vw",
    marginBottom: "0px !important",
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
  searchInputMargin: {
    marginBottom: "0px",
  },
}));

const DeliveryMethodTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const lang = useSelector((state) => state.settings.language);
  const tableData = useSelector((state) => state.deliveryMethod.tableData);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const updateItem = (data) => {
    setIsUpdate(true);
    setUpdateData(data);
    setModalVisible(true);
  };

  const closeInsertModal = () => {
    setModalVisible(false);
    setIsUpdate(false);
    setUpdateData([]);
  };

  const getLocalized = (inputArray) => {
    var defaultName = "";
    var localizedName = "";
    for (let i = 0; i < inputArray.length; i++) {
      if (inputArray[i].lang === lang) {
        localizedName = inputArray[i].value;
      } else if (inputArray[i].lang === "en") {
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
    } else {
      return data;
    }
  };

  const searchTableData = (data) => {
    if (search !== "") {
      var filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
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
      if (keys[2] === "names") {
        var tableData = data.map((element) => ({
          id: element.id,
          type: element.type,
          name: getLocalized(element.names),
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

  const rows = useMemo(() => {
    return localizeTableData(tableData).map((row) => (
      <tr key={row.id}>
        {TableCell(row.name)}
        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            {row.type === "HOME_DELIVERY" ? (
              <Button
                variant="subtle"
                className={classes.tableIconsButton}
                onClick={async () => {
                  await dispatch(fetchDeliveryCostData());
                  navigate("deliveryCost");
                }}
              >
                <Calculator className={classes.tableIconsLogo} />
              </Button>
            ) : (
              ""
            )}
            <Button
              variant="subtle"
              className={classes.tableIconsButton}
              onClick={async () => {
                await dispatch(fetchDeliveryMethodByIdThunk(row.id));
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
          </Group>
        </td>
      </tr>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, search, reverseSortDirection, tableData]);

  useEffect(() => {
    dispatch(fetchDeliveryMethodDataThunk());
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
        </div>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          className={classes.tableStyle}
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                {t("deliveryMethodTable.name")}
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
      <DeliveryMethodModal
        opened={modalVisible}
        onClose={closeInsertModal}
        isUpdate={isUpdate}
        updateData={updateData}
      />
    </>
  );
};

export default DeliveryMethodTable;
