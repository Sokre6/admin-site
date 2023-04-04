import {
  Center,
  createStyles,
  Group,
  UnstyledButton,
  Text,
  Button,
  ScrollArea,
  Table,
  Select,
  Pagination,
  Box,
  TextInput,
  SimpleGrid,
  LoadingOverlay,
  NumberInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronUp,
  InfoSquare,
  Search,
  Selector,
} from "tabler-icons-react";
import TableCell from "../common/TableCell";
import dayjs from "dayjs";
import {
  fetchBuybackThunk,
  fetchBuybackByIdThunk,
} from "../../store/slices/buyback";
import CustomLoader from "../common/CustomLoader";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";

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
    right: 10,
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
}));

const BuybackTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const tableData =
    useSelector((state) => state?.buyback?.buybackData?.content) || [];

  const loading = useSelector((state) => state?.buyback?.status);
  const totalPages = useSelector(
    (state) => state?.buyback?.buybackData?.totalPages
  );

  const { classes } = useStyles();

  const [sortBy, setSortBy] = useState(null);
  const [state, setState] = useState({
    activePage: 0,
    pageSize: "10",
    sortType: [],
  });

  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const schema = Yup.object().shape({
    createdAtStart: Yup.date().nullable(),
    createdAtEnd: Yup.date()
      .nullable()
      .min(Yup.ref("createdAtStart"), t("ordersTable.greaterThan")),
  });

  const form = useForm({
    initialValues: {
      createdAtStart: null,
      createdAtEnd: null,
      serialNumber: "",
      status: null,
    },
    schema: yupResolver(schema),
  });

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const rows = tableData.map((row) => (
    <tr key={row.id}>
      {TableCell(!!row?.number ? row?.number : "")}
      {TableCell(!!row?.productCategoryName ? row?.productCategoryName : "")}
      {TableCell(!!row?.productSkuName ? row?.productSkuName : "")}
      {TableCell(
        String(
          !!row?.appraisalPriceAmount ? row?.appraisalPriceAmount : ""
        ).replace(/(.)(?=(\d{3})+$)/g, "$1.")
      )}
      {TableCell(
        !!row?.appraisalPriceCurrency ? row?.appraisalPriceCurrency : ""
      )}
      {TableCell(!!row?.status ? row?.status : "")}
      {TableCell(
        !!row?.createdAt ? dayjs(row?.createdAt).format("DD.MM.YYYY") : ""
      )}

      <td>
        <Group position="right" className={classes.buttonContainer}>
          <NavLink
            className={classes.tableIconsButton}
            variant="subtle"
            to={row.id}
            onClick={async () => {
              await dispatch(fetchBuybackByIdThunk(row?.id));
            }}
          >
            <InfoSquare className={classes.tableIconsLogo} />
          </NavLink>
        </Group>
      </td>
    </tr>
  ));

  const Th = ({ children, reversed, sorted, onSort }) => {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;

    return (
      <th className={classes.th}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="left" noWrap>
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

  const submitForm = () => {
    setState((prev) => ({
      ...prev,
      activePage: 0,
      pageSize: "10",
    }));
  };

  useEffect(() => {
    switch (sortBy) {
      case "number":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["NUMBER_AT_ASC"]
            : ["NUMBER_AT_DESC"],
        }));
        break;
      case "serialNumber":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["SERIAL_NUMBER_ASC"]
            : ["SERIAL_NUMBER_DESC"],
        }));
        break;
      case "productSkuName":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["PRODUCT_SKU_NAME_ASC"]
            : ["PRODUCT_SKU_NAME_DESC"],
        }));
        break;
      case "productCategoryName":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["PRODUCT_CATEGORY_NAME_ASC"]
            : ["PRODUCT_CATEGORY_NAME_DESC"],
        }));
        break;
      case "status":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection ? ["STATUS_ASC"] : ["STATUS_DESC"],
        }));
        break;
      case "appraisalPriceAmount":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["APPRAISAL_PRICE_AMOUNT_ASC"]
            : ["APPRAISAL_PRICE_AMOUNT_DESC"],
        }));
        break;
      case "createdAt":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["CREATED_AT_ASC"]
            : ["CREATED_AT_DESC"],
        }));
        break;
      default:
        break;
    }
  }, [sortBy, reverseSortDirection]);

  useEffect(() => {
    dispatch(
      fetchBuybackThunk({
        number: form.values?.number,
        status: form.values?.status,
        createdAtStart: form.values?.createdAtStart,
        createdAtEnd: form.values?.createdAtEnd,
        appraisalPriceAmountFrom: form.values?.appraisalPriceAmountFrom,
        appraisalPriceAmountTo: form.values?.appraisalPriceAmountTo,
        productSkuName: form.values?.productSkuName,
        productCategoryName: form.values?.productCategoryName,
        sort: state?.sortType,
        subjRef: form.values?.subjRef,
        page: state?.activePage,
        size: state?.pageSize,
      })
    );
  }, [state]);

  return (
    <>
      {" "}
      <form onSubmit={form.onSubmit(submitForm)}>
        <ScrollArea className={classes.scrollArea}>
          <Box style={{ display: "flex", paddingBottom: 10 }}>
            <SimpleGrid
              cols={5}
              breakpoints={[
                { maxWidth: 1700, cols: 4, spacing: "md" },
                { maxWidth: 1450, cols: 3, spacing: "sm" },
                { maxWidth: 1200, cols: 2, spacing: "sm" },
              ]}
            >
              <DatePicker
                classNames={classes}
                inputFormat="DD.MM.YYYY"
                placeholder={t("buybackTable.createdFrom")}
                {...form.getInputProps("createdAtStart")}
              />
              <DatePicker
                classNames={classes}
                inputFormat="DD.MM.YYYY"
                placeholder={t("buybackTable.createdTo")}
                {...form.getInputProps("createdAtEnd")}
              />
              <TextInput
                placeholder={t("buybackTable.appraisalNumber")}
                {...form.getInputProps("number")}
              />
              <TextInput
                placeholder={t("buybackTable.productName")}
                {...form.getInputProps("productSkuName")}
              />
              <Select
                clearable
                data={[
                  "PENDING",
                  "APPRAISED",
                  "USER_COMPLETED_REQUEST",
                  "COMPLETED",
                  "CANCELED",
                ].map((status) => ({
                  value: status,
                  label:
                    status === "USER_COMPLETED_REQUEST"
                      ? "USER COMPLETED REQUEST"
                      : status,
                }))}
                searchable
                placeholder={t("buybackTable.status")}
                {...form.getInputProps("status")}
              />
              <NumberInput
                precision={2}
                min={0}
                placeholder={t("buybackTable.appraisalPriceAmountFrom")}
                {...form.getInputProps("appraisalPriceAmountFrom")}
              />
              <NumberInput
                precision={2}
                min={0}
                placeholder={t("buybackTable.appraisalPriceAmountTo")}
                {...form.getInputProps("appraisalPriceAmountTo")}
              />
            </SimpleGrid>

            <Button
              className={classes.insertButton}
              style={{ justifyContent: "flex-end", marginLeft: 50 }}
              type="submit"
            >
              <Search />
              {t("modalCommon.search")}
            </Button>
          </Box>
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            sx={{ tableLayout: "fixed", minWidth: 700, overflowX: "auto" }}
          >
            <thead>
              <tr>
                <Th
                  sorted={sortBy === "number"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("number")}
                >
                  {t("buybackTable.number")}
                </Th>
                <Th
                  sorted={sortBy === "productCategoryName"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("productCategoryName")}
                >
                  {t("buybackTable.productCategoryName")}
                </Th>
                <Th
                  sorted={sortBy === "productSkuName"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("productSkuName")}
                >
                  {t("buybackTable.productName")}
                </Th>
                <Th
                  sorted={sortBy === "appraisalPriceAmount"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("appraisalPriceAmount")}
                >
                  {t("buybackTable.appraisalPriceAmount")}
                </Th>
                <Th>{t("buybackTable.appraisalPriceCurrency")}</Th>
                <Th
                  sorted={sortBy === "status"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("status")}
                >
                  {t("buybackTable.status")}
                </Th>
                <Th
                  sorted={sortBy === "createdAt"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("createdAt")}
                >
                  {t("buybackTable.createdAt")}
                </Th>

                <th className={classes.buttonColumn}></th>
              </tr>
            </thead>
            <tbody>
              {loading === "pending" && (
                <tr>
                  <td style={{ borderBottom: "none" }}>
                    <LoadingOverlay loader={CustomLoader()} visible />
                  </td>
                </tr>
              )}
              {rows.length > 0 && rows !== [] ? (
                rows
              ) : (
                <tr>
                  <td colSpan={7}>
                    <Text weight={500} align="center">
                      {t("table.nothingFound")}
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ScrollArea>
        <Group style={{ bottom: 5, position: "absolute", right: 5 }}>
          <Pagination
            page={state.activePage + 1}
            onChange={(page) =>
              setState((prev) => ({ ...prev, activePage: page - 1 }))
            }
            total={totalPages}
            color={"dark"}
          />
          <Select
            styles={{
              root: {
                width: 65,
              },
            }}
            data={["10", "25", "50"]}
            placeholder={t("posts.mediaGallery.pageSize")}
            value={state.pageSize}
            onChange={(value) =>
              setState((prev) => ({ ...prev, activePage: 0, pageSize: value }))
            }
          />
        </Group>
      </form>
    </>
  );
};

export default BuybackTable;
