import {
  Button,
  Center,
  createStyles,
  Group,
  LoadingOverlay,
  Pagination,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  GitPullRequest,
  GitPullRequestClosed,
  GitPullRequestDraft,
  Pencil,
  Plus,
  Search,
  Selector,
  Trash,
  World,
} from "tabler-icons-react";
import { fetchAuthorsThunk } from "../../store/slices/author";
import { fetchParametersValidationsThunk } from "../../store/slices/parameters";
import { fetchPostsByIdThunk, fetchPostsThunk } from "../../store/slices/posts";
import CustomLoader from "../common/CustomLoader";
import TableCell from "../common/TableCell";
import {
  getAuthorsById,
  getBlogCategoryById,
  getLocalizedName,
  getLocalizedPostTitles,
  STATUS,
} from "./helpers/helpers";
import ActionModal from "./modal/ActionModal";
import DeletePostsBanner from "./modal/DeletePostsBanner";
import PublishModal from "./modal/PublishModal";

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
  deleteIcon: {
    color:
      theme.colorScheme === "dark" ? theme.colors.red[5] : theme.colors.red[5],
    marginLeft: theme.spacing.xl,
  },
  worldIcon: {
    marginLeft: theme.spacing.xl,
  },
  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
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
  thead: {
    borderBottom: `1px solid #dee2e6`,
  },
}));

const PostsTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();

  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const locale = useSelector((state) => state.settings.language);
  const blogsData = useSelector((state) => state.blog.tableData);
  const authorsData = useSelector((state) => state.author.tableData);
  const tableData = useSelector((state) => state.posts.tableData.content);
  const totalPages = useSelector((state) => state.posts.tableData.totalPages);
  const status = useSelector((state) => state.posts.status);
  


  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [showDeleteBanner, setShowDeleteBanner] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [rowId, setRowId] = useState("");
  const [statusType, setStatusType] = useState("");

  const [state, setState] = useState({
    activePage: 0,
    pageSize: "10",
    sortType: null,
  });

  const form = useForm({
    initialValues: {
      title: "",
      blogCategoryId: null,
      authorId: null,
      status: null,
    },
  });

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const prepareBlogCategories = (blogsData) => {
    return blogsData.map((element) => ({
      label: getLocalizedName(element.names, locale),
      value: element.id,
    }));
  };

  const prepareAuthors = (authorsData) => {
    return authorsData.map((element) => ({
      label: `${element?.givenName} ${element?.familyName}`,
      value: element.id,
    }));
  };

  const prepareTableData = (data) => {
    if (data === undefined) {
      return [];
    } else {
      const tableData = data.map((item) => ({
        id: item.id,
        titles: getLocalizedPostTitles(item.titles),
        blogCategory: getLocalizedName(
          getBlogCategoryById(item.blogCategoryId, blogsData),
          locale
        ),
        publishedAt: item.publishedAt,
        createdAt: item.createdAt,
        author: getAuthorsById(item?.authorId, authorsData),
        status: item.status,
      }));

      return tableData;
    }
  };

  const submitForm = () => {
    setState((prev) => ({ ...prev, activePage: 0 }));
  };

  const rows = useMemo(() => {
    return prepareTableData(tableData).map((row, index) => (
      <tr key={index}>
        {TableCell(row.titles)}
        {TableCell(row.blogCategory)}
        {TableCell(
          row.publishedAt ? dayjs(row.publishedAt).format("DD.MM.YYYY.") : ""
        )}
        {TableCell(dayjs(row.createdAt).format("DD.MM.YYYY."))}
        {TableCell(row.author)}
        {TableCell(row.status)}
        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              disabled={row.status !== "DRAFT"}
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={async () => {
                await dispatch(fetchPostsByIdThunk(row.id));
                navigate(`localization/${row.id}`);
              }}
            >
              <World
                className={row.status !== "DRAFT" ? "" : classes.tableIconsLogo}
              />
            </Button>

            <Tooltip label={t("posts.postTable.publish")} withArrow>
              <Button
                disabled={row.status !== "DRAFT"}
                className={classes.tableIconsButton}
                variant="subtle"
                onClick={() => {
                  setOpenModal(true);
                  setModalData(row);
                  form.reset();
                }}
              >
                <GitPullRequest
                  className={
                    row.status === "DRAFT" ? classes.tableIconsLogo : ""
                  }
                />
              </Button>
            </Tooltip>
            <Tooltip label={t("posts.postTable.retire")} withArrow>
              <Button
                disabled={row.status === "RETIRED"}
                className={classes.tableIconsButton}
                variant="subtle"
                onClick={() => {
                  setShowActionModal(true);
                  setRowId(row.id);
                  setStatusType("retire");
                }}
              >
                <GitPullRequestClosed
                  className={
                    row.status !== "RETIRED" ? classes.tableIconsLogo : ""
                  }
                />
              </Button>
            </Tooltip>
            <Tooltip label={t("posts.postTable.switchToDraft")} withArrow>
              <Button
                disabled={row.status === "DRAFT"}
                className={classes.tableIconsButton}
                variant="subtle"
                onClick={() => {
                  setShowActionModal(true);
                  setRowId(row.id);
                  setStatusType("switch-to-draft");
                }}
              >
                <GitPullRequestDraft
                  className={
                    row.status !== "DRAFT" ? classes.tableIconsLogo : ""
                  }
                />
              </Button>
            </Tooltip>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={async () => {
                await dispatch(fetchPostsByIdThunk(row.id));
                navigate(`details/${row.id}`);
              }}
            >
              <Pencil className={classes.tableIconsLogo} />
            </Button>
            <Button
              disabled={row.status === "PUBLISHED"}
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={async () => {
                setShowDeleteBanner(true);
                setModalData(row);
              }}
            >
              <Trash
                className={
                  row.status === "PUBLISHED" ? "" : classes.tableIconsTrash
                }
              />
            </Button>
          </Group>
        </td>
      </tr>
    ));
  }, [sortBy, reverseSortDirection, tableData]);

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

  useEffect(() => {
    switch (sortBy) {
      case "title":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection ? "TITLE_ASC" : "TITLE_DESC",
        }));
        break;
      case "blogCategory":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? "BLOG_CATEGORY_NAME_ASC"
            : "BLOG_CATEGORY_NAME_DESC",
        }));
        break;
      case "publishedAt":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? "PUBLISHED_AT_ASC"
            : "PUBLISHED_AT_DESC",
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
      case "author":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection
            ? "AUTHOR_NAME_ASC"
            : "AUTHOR_NAME_DESC",
        }));

        break;

      case "status":
        setState((prev) => ({
          ...prev,
          sortType: !reverseSortDirection ? "STATUS_ASC" : "STATUS_DESC",
        }));
        break;

      default:
        break;
    }
  }, [sortBy, reverseSortDirection]);

  useEffect(() => {
    dispatch(fetchAuthorsThunk());
    dispatch(fetchParametersValidationsThunk())

    dispatch(
      fetchPostsThunk({
        title: form.values.title,
        blogCategoryId: form.values.blogCategoryId,
        authorId: form.values.authorId,
        status: form.values.status,
        sortBy: state.sortType,
        page: state.activePage,
        pageSize: state.pageSize,
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
                placeholder={t("posts.title")}
                mb="md"
                icon={<Search size={14} />}
                {...form.getInputProps("title")}
              />
              <Select
                className={classes}
                searchable
                data={prepareBlogCategories(blogsData) || []}
                clearable
                placeholder={t("posts.blogCategory")}
                {...form.getInputProps("blogCategoryId")}
              />
              <Select
                className={classes}
                data={prepareAuthors(authorsData) || []}
                clearable
                placeholder={t("posts.author")}
                {...form.getInputProps("authorId")}
              />
              <Select
                className={classes}
                data={STATUS || []}
                clearable
                placeholder={t("posts.status")}
                {...form.getInputProps("status")}
              />
              <Button
                type="submit"
                className={classes.insertButton}
                leftIcon={<Search />}
              >
                {t("posts.searchButton")}
              </Button>
            </Group>
          </form>
          <Button
            className={classes.insertButton}
            onClick={() => {
              navigate(`details/new`);
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
                sorted={sortBy === "title"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("title")}
              >
                {t("posts.postTable.title")}
              </Th>
              <Th
                sorted={sortBy === "blogCategory"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("blogCategory")}
              >
                {t("posts.postTable.blogCategory")}
              </Th>
              <Th
                sorted={sortBy === "publishedAt"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("publishedAt")}
              >
                {t("posts.postTable.publishedAt")}
              </Th>
              <Th
                sorted={sortBy === "createdAt"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("createdAt")}
              >
                {t("posts.postTable.createdAt")}
              </Th>
              <Th
                sorted={sortBy === "author"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("author")}
              >
                {t("posts.postTable.author")}
              </Th>
              <Th
                sorted={sortBy === "status"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("status")}
              >
                {t("posts.postTable.status")}
              </Th>
              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          {
            <tbody>
              {status === "pending" && (
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
                  <td colSpan={6}>
                    <Text weight={500} align="center">
                      {t("table.nothingFound")}
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          }
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

      <PublishModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        modalData={modalData}
      />
      <DeletePostsBanner
        pageSize={state.pageSize}
        page={state.activePage}
        show={showDeleteBanner}
        id={modalData?.id}
        onClose={() => setShowDeleteBanner(false)}
      />
      <ActionModal
        showModal={showActionModal}
        rowId={rowId}
        type={statusType}
        onClose={() => setShowActionModal(false)}
      />
    </>
  );
};

export default PostsTable;
