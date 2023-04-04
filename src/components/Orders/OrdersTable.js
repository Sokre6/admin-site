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
  NumberInput,
  Pagination,
  Box,
  TextInput,
  SimpleGrid,
  LoadingOverlay,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronUp, Search, Selector } from "tabler-icons-react";
import TableCell from "../common/TableCell";
import dayjs from "dayjs";
import { fetchOrdersThunk } from "../../store/slices/orders";
import { fetchPaymentMethodsByIdThunk, fetchPaymentMethodsThunk } from "../../store/slices/paymentMethods";
import { fetchDeliveryMethodByIdThunk, fetchDeliveryMethodDataThunk } from "../../store/slices/deliveryMethod";
import CustomLoader from "../common/CustomLoader";
import * as Yup from "yup";

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

const OrdersTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tableData =
    useSelector((state) => state?.orders?.ordersData?.content) || [];
  const paymentMethodsData = useSelector(
    (state) => state?.paymentMethods?.paymentMethodsData
  );
  const loading = useSelector((state) => state?.orders?.status);

  const deliveryMethodsData = useSelector(
    (state) => state?.deliveryMethod?.tableData
  );
  const totalPages = useSelector(
    (state) => state?.orders?.ordersData?.totalPages
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
    createdStart: Yup.date().nullable(),
    createdEnd: Yup.date()
      .nullable()
      .min(Yup.ref("createdStart"), t("ordersTable.greaterThan")),
    totalPriceAmountFrom: Yup.number().nullable(),
    totalPriceAmountTo: Yup.number()
      .nullable()
      .test(
        "isGreaterThan",
        t("ordersTable.isGreaterThanPriceCheck"),
        function (value) {
          const { totalPriceAmountFrom } = this.parent;

          if (value < totalPriceAmountFrom) {
            return false;
          }
          if (
            value === totalPriceAmountFrom &&
            value !== null &&
            totalPriceAmountFrom !== null &&
            value !== undefined &&
            totalPriceAmountFrom !== undefined
          ) {
            return false;
          } else {
            return true;
          }
        }
      ),
    customerEmail: Yup.string()
      .email(t("ordersTable.invalidEmail"))
      .matches(/^(?!.*@[^,]*,)/),
  });

  const form = useForm({
    initialValues: {
      createdStart: null,
      createdEnd: null,
      totalPriceAmountFrom: null,
      totalPriceAmountTo: null,
      paymentMethodType: null,
      customerName: "",
      customerEmail: "",
      orderNumber: "",
      status: null,
      deliveryMethodType: null,
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
      <td>
        <NavLink to={row.id} onClick={async()=>{
          await dispatch(fetchPaymentMethodsByIdThunk(row?.paymentMethodId));
          await dispatch(fetchDeliveryMethodByIdThunk(row?.deliveryMethodId));
        }}>
          <Text>{row?.id.substring(0, 8) + "..."}</Text>
        </NavLink>
      </td>
      {TableCell(row?.orderNumber)}
      {TableCell(row?.customerName)}
      {TableCell(row?.customerEmail)}
      {TableCell(dayjs(row?.createdAt).format("DD.MM.YYYY"))}
      {TableCell(row?.status)}
      {TableCell(row?.paymentMethodType)}
      {TableCell(row?.deliveryMethodType)}
      {TableCell(
        String(row?.totalPriceAmnt).replace(/(.)(?=(\d{3})+$)/g, "$1.")
      )}
      {TableCell(row?.totalPriceCurr)}

      <td></td>
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

  const translateLabel = (label) => {
    if (label === "HOME_DELIVERY") {
      return "HOME DELIVERY";
    }
    if (label === "STORAGE_IN_SHARED_SAFE") {
      return "STORAGE IN SHARED SAFE";
    }
    if (label === "STORE_PICKUP") {
      return "STORE PICKUP";
    }
    if (label === "TRANSACTIONAL_PAYMENT") {
      return "TRANSACTIONAL PAYMENT";
    }
    if (label === "CASH_ON_DELIVERY") {
      return "CASH ON DELIVERY";
    }
    if (label === "CASH_ON_STORE_PICKUP") {
      return "CASH ON STORE PICKUP";
    }
    if (label === "CARD_PAYMENT") {
      return "CARD PAYMENT";
    }
    if (label === "INSTALMENTS_CARD_PAYMENT") {
      return "INSTALMENTS CARD PAYMENT";
    } else {
      return label;
    }
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
      case "orderId":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection ? ["id,ASC"] : ["id", "DESC"],
        }));
        break;
      case "orderNumber":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["ordNumber,ASC"]
            : ["ordNumber,DESC"],
        }));
        break;
      case "fullName":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["custName,ASC"]
            : ["custName,DESC"],
        }));
        break;
      case "email":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["custEmail,ASC"]
            : ["custEmail,DESC"],
        }));
        break;
      case "createdAt":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["createdAt,ASC"]
            : ["createdAt,DESC"],
        }));
        break;
      case "status":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection ? ["status,ASC"] : ["status,DESC"],
        }));
        break;
      case "paymentMethodType":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["paymentMethod_type,ASC"]
            : ["paymentMethod_type,DESC"],
        }));
        break;
      case "deliveryMethodType":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["deliveryMethod_type,ASC"]
            : ["deliveryMethod_type,DESC"],
        }));
        break;
      case "totalPriceAmnt":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["totalPriceAmnt,ASC"]
            : ["totalPriceAmnt,DESC"],
        }));
        break;
      case "totalPriceCurr":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? ["totalPriceCurr,ASC"]
            : ["totalPriceCurr,DESC"],
        }));
        break;

      default:
        break;
    }
  }, [sortBy, reverseSortDirection]);

  useEffect(() => {
    dispatch(fetchPaymentMethodsThunk());
    dispatch(fetchDeliveryMethodDataThunk());
    dispatch(
      fetchOrdersThunk({
        createdStart: form.values?.createdStart,
        createdEnd: form.values?.createdEnd,
        totalPriceAmountFrom: form.values?.totalPriceAmountFrom,
        totalPriceAmountTo: form.values?.totalPriceAmountTo,
        paymentMethodType: form.values?.paymentMethodType,
        customerName: form.values?.customerName,
        customerEmail: form.values?.customerEmail,
        orderNumber: form.values?.orderNumber,
        status: form.values?.status,
        deliveryMethodType: form.values?.deliveryMethodType,
        page: state?.activePage,
        size: state?.pageSize,
        sort: state?.sortType,
      })
    );
  }, [state]);

  return (
    <>
      {" "}
      <form onSubmit={form.onSubmit(submitForm)}>
        <ScrollArea className={classes.scrollArea}>
          <Box style={{ display: "flex",paddingBottom:10 }}>
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
                placeholder={t("ordersTable.createdFrom")}
                {...form.getInputProps("createdStart")}
              />
              <DatePicker
                classNames={classes}
                inputFormat="DD.MM.YYYY"
                placeholder={t("ordersTable.createdTo")}
                {...form.getInputProps("createdEnd")}
              />
              <NumberInput
                min={0}
                placeholder={t("ordersTable.totalPriceRangeAmountFrom")}
                {...form.getInputProps("totalPriceAmountFrom")}
              />
              <NumberInput
                min={0}
                placeholder={t("ordersTable.totalPriceRangeAmountTo")}
                {...form.getInputProps("totalPriceAmountTo")}
              />
              <Select
                clearable
                data={
                  paymentMethodsData.map((payment) => ({
                    value: payment?.type,
                    label: translateLabel(payment?.type),
                  })) || []
                }
                placeholder={t("ordersTable.paymentMethodType")}
                searchable
                {...form.getInputProps("paymentMethodType")}
              />

              <TextInput
                placeholder={t("ordersTable.customerName")}
                {...form.getInputProps("customerName")}
              />
              <TextInput
                placeholder={t("ordersTable.customerEmail")}
                {...form.getInputProps("customerEmail")}
              />

              <Select
                clearable
                data={["AWAITING_PAYMENT", "CONFIRMED", "CANCELLED"].map(
                  (status) => ({
                    value: status,
                    label:
                      status === "AWAITING_PAYMENT"
                        ? "AWAITING PAYMENT"
                        : status,
                  })
                )}
                searchable
                placeholder={t("ordersTable.status")}
                {...form.getInputProps("status")}
              />
              <TextInput
                placeholder={t("ordersTable.orderNumber")}
                {...form.getInputProps("orderNumber")}
              />

              <Select
                clearable
                data={
                  deliveryMethodsData.map((payment) => ({
                    value: payment?.type,
                    label: translateLabel(payment?.type),
                  })) || []
                }
                placeholder={t("ordersTable.deliveryMethodType")}
                searchable
                {...form.getInputProps("deliveryMethodType")}
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
            sx={{ tableLayout: "auto", minWidth: 700, overflowX: "auto" }}
          >
            <thead>
              <tr>
                <Th
                  sorted={sortBy === "orderId"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("orderId")}
                >
                  {t("ordersTable.orderId")}
                </Th>
                <Th
                  sorted={sortBy === "orderNumber"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("orderNumber")}
                >
                  {t("ordersTable.orderNumber")}
                </Th>

                <Th
                  sorted={sortBy === "fullName"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("fullName")}
                >
                  {t("ordersTable.fullName")}
                </Th>
                <Th
                  sorted={sortBy === "email"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("email")}
                >
                  {t("ordersTable.email")}
                </Th>
                <Th
                  sorted={sortBy === "createdAt"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("createdAt")}
                >
                  {t("ordersTable.createdAt")}
                </Th>
                <Th
                  sorted={sortBy === "status"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("status")}
                >
                  {t("ordersTable.status")}
                </Th>
                <Th
                  sorted={sortBy === "paymentMethodType"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("paymentMethodType")}
                >
                  {t("ordersTable.paymentMethodType")}
                </Th>
                <Th
                  sorted={sortBy === "deliveryMethodType"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("deliveryMethodType")}
                >
                  {t("ordersTable.deliveryMethodType")}
                </Th>

                <Th
                  sorted={sortBy === "totalPriceAmnt"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("totalPriceAmnt")}
                >
                  {t("ordersTable.totalPriceAmnt")}
                </Th>

                <Th
                  sorted={sortBy === "totalPriceCurr"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("totalPriceCurr")}
                >
                  {t("ordersTable.totalPriceCurr")}
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

export default OrdersTable;
