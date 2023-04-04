import React, { useEffect, useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  Box,
  LoadingOverlay,
  Button,
} from "@mantine/core";
import {
  Selector,
  ChevronDown,
  ChevronUp,
  ReportMoney,
} from "tabler-icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import TableCell from "../common/TableCell";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { CardCustomerData } from "./Cards/CardCustomerData";
import { CardOrderDetails } from "./Cards/CardOrderDetails";
import { CardTableData } from "./Cards/CardTableData";
import { fetchOrdersByIdThunk } from "../../store/slices/orders";
import CustomLoader from "../common/CustomLoader";
import PaymentUpdateModal from "./PaymentUpdateModal";

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
  tableIconsButton: {
    padding: "0px",
    "&:hover": {
      backgroundColor: theme.colors.colorGray,
    },
  },
  tableHeaders: {
    position: "sticky",
    zIndex: 100,
    top: 0,
    background: "white",
  },
}));

const OrderDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const params = useParams();
  const { classes } = useStyles();

  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const ordersDataById =
    useSelector((state) => state?.orders?.ordersDataById) || [];
  const paymentsDataById =
    useSelector((state) => state?.paymentMethods?.paymentMethodsDataById) || [];

  const deliveryDataById =
    useSelector((state) => state?.deliveryMethod?.deliveryMethodData) || [];

  const loading = useSelector((state) => state?.orders?.status);

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
  const sortTableData = (data) => {
    if (sortBy === "quantity") {
      return !reverseSortDirection
        ? data?.slice()?.sort((a, b) => Number(a.quantity) - Number(b.quantity))
        : data
            ?.slice()
            ?.sort((a, b) => Number(a.quantity) - Number(b.quantity))
            ?.reverse();
    }
    if (sortBy === "skuId") {
      return !reverseSortDirection
        ? data?.slice().sort((a, b) => Number(a?.skuId) - Number(b?.skuId))
        : data
            ?.slice()
            .sort((a, b) => Number(a?.skuId) - Number(b?.skuId))
            .reverse();
    }
    if (sortBy === "totalPriceAmnt") {
      return !reverseSortDirection
        ? data
            ?.slice()
            ?.sort(
              (a, b) => Number(a.totalPriceAmnt) - Number(b.totalPriceAmnt)
            )
        : data
            ?.slice()
            ?.sort(
              (a, b) => Number(a.totalPriceAmnt) - Number(b.totalPriceAmnt)
            )
            ?.reverse();
    }
    if (sortBy === "unitPriceAmnt") {
      return !reverseSortDirection
        ? data
            ?.slice()
            ?.sort((a, b) => Number(a.unitPriceAmnt) - Number(b.unitPriceAmnt))
        : data
            ?.slice()
            ?.sort((a, b) => Number(a.unitPriceAmnt) - Number(b.unitPriceAmnt))
            ?.reverse();
    }
    if (sortBy === "totalPriceCurr") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort((a, b) => a.totalPriceCurr.localeCompare(b.totalPriceCurr))
        : data
            .slice()
            .sort((a, b) => a.totalPriceCurr.localeCompare(b.totalPriceCurr))
            .reverse();
    }

    if (sortBy === "type") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.type.localeCompare(b.type))
        : data
            .slice()
            .sort((a, b) => a.type.localeCompare(b.type))
            .reverse();
    } else {
      return data;
    }
  };

  const prepareTableData = (data) => {
    if (data === undefined || data === null || data === {}) {
      return [];
    } else {
      return sortTableData(data);
    }
  };

  const rows = prepareTableData(ordersDataById?.items).map((row, index) => (
    <tr key={index}>
      {TableCell(row?.quantity)}
      {TableCell(row?.skuId ? row.skuId : "")}
      {TableCell(
        String(row?.totalPriceAmnt).replace(/(.)(?=(\d{3})+$)/g, "$1.")
      )}
      {TableCell(
        String(row?.unitPriceAmnt).replace(/(.)(?=(\d{3})+$)/g, "$1.")
      )}
      {TableCell(row?.totalPriceCurr)}
      {TableCell(row?.type)}
      <td>
        <Group position="right">
          <Button
            variant="subtle"
            className={classes.tableIconsButton}
            onClick={() => setOpenPaymentModal(true)}
          >
            <ReportMoney className={classes.tableIconsLogo} />
          </Button>
        </Group>
      </td>
    </tr>
  ));

  useEffect(() => {
    dispatch(fetchOrdersByIdThunk(params?.orderId));
  }, [params?.orderId]);

  return (
    <>
      <ScrollArea className={classes.scrollArea}>
        {loading === "pending" && (
          <LoadingOverlay loader={CustomLoader()} visible />
        )}
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <CardCustomerData
            givenName={ordersDataById?.customer?.name?.givenName}
            familyName={ordersDataById?.customer?.name?.familyName}
            street={ordersDataById?.customer?.address?.street}
            postalCode={ordersDataById?.customer?.address?.postalCode}
            place={ordersDataById?.customer?.address?.place}
            countryCode={ordersDataById?.customer?.address?.countryCode}
            houseNumber={ordersDataById?.customer?.address?.houseNumber}
            emailAddress={ordersDataById?.customer?.emailAddress}
          />

          <CardOrderDetails
            orderNumber={ordersDataById?.orderNumber}
            createdAt={dayjs(ordersDataById?.createdAt).format("DD.MM.YYYY")}
            paymentMethod={paymentsDataById?.type}
            deliveryMethod={deliveryDataById?.type}
            totalAmount={String(ordersDataById?.totalPriceAmnt).replace(
              /(.)(?=(\d{3})+$)/g,
              "$1."
            )}
          />

          <CardTableData
            orderId={params?.orderId}
            documentList={ordersDataById?.documents}
          />
        </div>

        <Box style={{ padding: 10 }}>
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            sx={{
              tableLayout: "fixed",
              minWidth: 700,
              marginTop: 50,
            }}
          >
            <thead className={classes.tableHeaders}>
              <tr>
                <Th
                  sorted={sortBy === "quantity"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("quantity")}
                >
                  {t("ordersDetailsTable.quantity")}
                </Th>
                <Th
                  sorted={sortBy === "skuId"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("skuId")}
                >
                  {t("ordersDetailsTable.skuId")}
                </Th>
                <Th
                  sorted={sortBy === "totalPriceAmnt"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("totalPriceAmnt")}
                >
                  {t("ordersDetailsTable.totalPriceAmnt")}
                </Th>
                <Th
                  sorted={sortBy === "unitPriceAmnt"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("unitPriceAmnt")}
                >
                  {t("ordersDetailsTable.unitPriceAmnt")}
                </Th>
                <Th
                  sorted={sortBy === "totalPriceCurr"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("totalPriceCurr")}
                >
                  {t("ordersDetailsTable.totalPriceCurr")}
                </Th>

                <Th
                  sorted={sortBy === "type"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("type")}
                >
                  {t("ordersDetailsTable.type")}
                </Th>
                <th></th>
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
        </Box>
      </ScrollArea>

      <PaymentUpdateModal
        show={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        source={"admin"}
        orderId={params?.orderId}
      />
    </>
  );
};

export default OrderDetails;
