import {
  Button,
  Center,
  Group,
  Text,
  UnstyledButton,
  TextInput,
  Table,
  ScrollArea,
  createStyles,
  Select,
  Pagination,
  LoadingOverlay,
  Image,
  Loader,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Search,
  Selector,
  Trash,
} from "tabler-icons-react";
import { fetchMediaAssetsThunk } from "../../store/slices/mediaAssets";
import axios from "../../http/axios";
import CustomLoader from "../common/CustomLoader";
import TableCell from "../common/TableCell";
import MediaAssetsModal from "./MediaAssetsModal";
import DeleteMediaAssetsBanner from "./DeleteMediaAssetsBanner";
import dayjs from "dayjs";

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
    width: "200px",
    marginBottom: "0px !important",
  },
  searchInputMargin: {
    marginBottom: "0px",
  },
}));

const MediaAssetsTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();

  const mediaAssetsData =
    useSelector((state) => state?.mediaAssets?.tableData?.content) || [];

  const status = useSelector((state) => state?.mediaAssets?.status);

  const totalPages = useSelector(
    (state) => state?.mediaAssets?.tableData?.totalPages
  );

  const [sortBy, setSortBy] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDeleteBanner, setShowDeleteBanner] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [state, setState] = useState({
    activePage: 0,
    pageSize: "10",
    sortType: null,
  });

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const form = useForm({
    initialValues: {
      title: "",
      altText: "",
      caption: "",
      fileName: "",
    },
  });

  const closeModal = () => {
    setModalVisible(false);

    setModalData(null);
  };
  const openModal = (data) => {
    setModalData(data);
    setModalVisible(true);
  };

  const submitForm = () => {
    setState((prev) => ({
      ...prev,
      activePage: 0,
      pageSize: "10",
    }));
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

  useEffect(() => {
    switch (sortBy) {
      case "title":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection ? "TITLE_ASC" : "TITLE_DESC",
        }));
        break;
      case "fileName":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection ? "FILE_NAME_ASC" : "FILE_NAME_DESC",
        }));
        break;
      case "caption":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection ? "CAPTION_ASC" : "CAPTION_DESC",
        }));
        break;
      case "altText":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection ? "ALT_TEXT_ASC" : "ALT_TEXT_DESC",
        }));
        break;
      case "createdAt":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? "CREATED_AT_ASC"
            : "CREATED_AT_DESC",
        }));
        break;

      default:
        break;
    }
  }, [sortBy, reverseSortDirection]);

  useEffect(() => {
    dispatch(
      fetchMediaAssetsThunk({
        title: form.values?.title,
        altText: form.values?.altText,
        caption: form.values?.caption,
        fileName: form.values?.fileName,
        sortBy: state?.sortType,
        page: state?.activePage,
        size: state?.pageSize,
      })
    );
  }, [state]);

  return (
    <>
      <ScrollArea className={classes.scrollArea}>
        <div className={classes.searchAndButtonContainter}>
          <form onSubmit={form.onSubmit(submitForm)}>
            <Group>
              <TextInput
                className={classes.searchInput}
                placeholder={t("mediaAssets.title")}
                mb="md"
                icon={<Search size={14} />}
                {...form.getInputProps("title")}
              />
              <TextInput
                className={classes.searchInput}
                placeholder={t("mediaAssets.fileName")}
                mb="md"
                icon={<Search size={14} />}
                {...form.getInputProps("fileName")}
              />
              <TextInput
                className={classes.searchInput}
                placeholder={t("mediaAssets.altText")}
                mb="md"
                icon={<Search size={14} />}
                {...form.getInputProps("altText")}
              />
              <TextInput
                className={classes.searchInput}
                placeholder={t("mediaAssets.caption")}
                mb="md"
                icon={<Search size={14} />}
                {...form.getInputProps("caption")}
              />

              <Button
                type="submit"
                className={classes.insertButton}
                leftIcon={<Search />}
              >
                {t("mediaAssets.searchButton")}
              </Button>
            </Group>
          </form>

          <Button className={classes.insertButton} onClick={() => openModal()}>
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
                sorted={sortBy === "title"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("title")}
              >
                {t("mediaAssets.mediaAssetsTable.title")}
              </Th>
              <Th
                sorted={sortBy === "fileName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("fileName")}
              >
                {t("mediaAssets.mediaAssetsTable.fileName")}
              </Th>

              <Th
                sorted={sortBy === "altText"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("altText")}
              >
                {t("mediaAssets.mediaAssetsTable.altText")}
              </Th>
              <Th
                sorted={sortBy === "caption"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("caption")}
              >
                {t("mediaAssets.mediaAssetsTable.caption")}
              </Th>
              <Th
                sorted={sortBy === "createdAt"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("createdAt")}
              >
                {t("mediaAssets.mediaAssetsTable.createdAt")}
              </Th>
              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          <tbody>
            {status === "pending" && (
              <tr>
                <td style={{ borderBottom: "none" }}>
                  <LoadingOverlay loader={CustomLoader()} visible />
                </td>
              </tr>
            )}

            {mediaAssetsData.length > 0 && mediaAssetsData !== [] ? (
              mediaAssetsData.map((row, index) => (
                <tr key={index}>
                  {
                    <td>
                      {!row?.fileLocationUrl ? (
                        <Loader />
                      ) : (
                        <Box>
                          {" "}
                          <Image
                            height={50}
                            width={100}
                            src={row?.fileLocationUrl}
                          />
                          {row.title}
                        </Box>
                      )}
                    </td>
                  }
                  {TableCell(row?.fileName)}
                  {TableCell(row?.altText || "")}
                  {TableCell(row?.caption || "")}
                  {TableCell(dayjs(row?.createdAt).format("DD.MM.YYYY."))}

                  <td className={classes.buttonColumn}>
                    <Group position="right" className={classes.buttonContainer}>
                      <Button
                        className={classes.tableIconsButton}
                        variant="subtle"
                        onClick={() => {
                          openModal(row);
                        }}
                      >
                        <Pencil className={classes.tableIconsLogo} />
                      </Button>
                      <Button
                        className={classes.tableIconsButton}
                        variant="subtle"
                        onClick={async () => {
                          setShowDeleteBanner(true);
                          setDeleteData(row);
                        }}
                      >
                        <Trash className={classes.tableIconsTrash} />
                      </Button>
                    </Group>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <Text weight={500} align="center">
                    {t("table.nothingFound")}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      {totalPages > 0 && (
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
      )}
      <MediaAssetsModal
        opened={modalVisible}
        onClose={closeModal}
        modalData={modalData}
        page={state?.activePage}
        size={state?.pageSize}
      />
      <DeleteMediaAssetsBanner
        page={state?.activePage}
        size={state?.pageSize}
        show={showDeleteBanner}
        id={deleteData?.id}
        onClose={() => setShowDeleteBanner(false)}
      />
    </>
  );
};

export default MediaAssetsTable;
