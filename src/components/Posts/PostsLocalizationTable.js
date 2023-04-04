import {
  Button,
  createStyles,
  Group,
  ScrollArea,
  TextInput,
  Text,
  Table,
  UnstyledButton,
  Center,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Search,
  Selector,
  Trash,
} from "tabler-icons-react";

import {
  fetchPostsByIdThunk,
  updatePostsThunk,
} from "../../store/slices/posts";
import DeleteBanner from "../common/DeleteBanner";
import TableCell from "../common/TableCell";
import PostsLocalizationModal from "./PostsLocalizationModal";

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
    width: "25vw",
    marginBottom: "0px !important",
  },
  searchInputMargin: {
    marginBottom: "0px",
  },
}));

const PostsLocalizationTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const params = useParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteBannerVisible, setDeleteBannerVisible] = useState(false);
  const [deleteData, setDeleteData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState([]);

  const tableDataById = useSelector((state) => state.posts.tableDataById);

  const updateLocalizationModal = (data) => {
    setModalData(data);
    setIsUpdate(true);
    setModalVisible(true);
  };
  const createNewLocalizationModal = () => {
    setIsUpdate(false);
    setModalVisible(true);
  };
  const closeModal = async () => {
    setModalVisible(false);
    setIsUpdate(false);
    setModalData([]);
    setUpdateData([]);
  };

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

  const searchTableData = (data) => {
    if (search !== "") {
      const filteredData = data.filter(
        (item) =>
          item.seoLocale.toLowerCase().includes(search.toLowerCase()) ||
          item.seoTitle.toLowerCase().includes(search.toLowerCase()) ||
          item.metaDescription.toLowerCase().includes(search.toLowerCase()) ||
          item.metaKeywords.toLowerCase().includes(search.toLowerCase()) ||
          item.title.toLowerCase().includes(search.toLowerCase())
      );
      return filteredData;
    } else {
      return data;
    }
  };
  const sortTableData = (data) => {
    if (sortBy === "title") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.title.localeCompare(b.title))
        : data
            .slice()
            .sort((a, b) => a.title.localeCompare(b.title))
            .reverse();
    }
    if (sortBy === "seoLocale") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.seoLocale.localeCompare(b.seoLocale))
        : data
            .slice()
            .sort((a, b) => a.seoLocale.localeCompare(b.seoLocale))
            .reverse();
    }
    if (sortBy === "metaDescription") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort((a, b) => a.metaDescription.localeCompare(b.metaDescription))
        : data
            .slice()
            .sort((a, b) => a.metaDescription.localeCompare(b.metaDescription))
            .reverse();
    }
    if (sortBy === "metaKeywords") {
      return !reverseSortDirection
        ? data
            .slice()
            .sort((a, b) => a.metaKeywords.localeCompare(b.metaKeywords))
        : data
            .slice()
            .sort((a, b) => a.metaKeywords.localeCompare(b.metaKeywords))
            .reverse();
    }
    if (sortBy === "seoTitle") {
      return !reverseSortDirection
        ? data.slice().sort((a, b) => a.seoTitle.localeCompare(b.seoTitle))
        : data
            .slice()
            .sort((a, b) => a.seoTitle.localeCompare(b.seoTitle))
            .reverse();
    } else {
      return data;
    }
  };
  const preparedTableData = (data) => {
    const preparedTableData = data.seoData.map((item) => ({
      seoLocale: item.locale,
      seoTitle: item.title,
      metaDescription: item.metaDescription,
      metaKeywords: item.metaKeywords,
      shortContent: tableDataById.contents.find((i) => i.locale === item.locale)
        .shortContent,
      content: tableDataById.contents.find((i) => i.locale === item.locale)
        .content,
      title: data?.titles.find((t) => t.locale === item.locale)?.title,
      coverAltText: tableDataById?.coverPhoto.localizations.find(
        (t) => t.locale === item.locale
      )?.altText,
      coverCaption: tableDataById?.coverPhoto.localizations.find(
        (t) => t.locale === item.locale
      )?.caption,
      thumbnailAltText: tableDataById?.thumbnailPhoto?.localizations.find(
        (t) => t.locale === item.locale
      )?.altText,
      thumbnailCaption: tableDataById?.thumbnailPhoto.localizations.find(
        (t) => t.locale === item.locale
      )?.caption,
    }));

    return searchTableData(sortTableData(preparedTableData));
  };

  const deletePostsLocalization = async () => {
    let filteredContentData = tableDataById.contents.filter(
      (item) => item.locale !== deleteData.seoLocale
    );
    let filteredSeoData = tableDataById.seoData.filter(
      (item) => item.locale !== deleteData.seoLocale
    );
    let filteredTitlesData = tableDataById.titles.filter(
      (item) => item.locale !== deleteData.seoLocale
    );

    let filterCoverPhotoLocalization =
      tableDataById.coverPhoto?.localizations?.filter(
        (item) => item.locale !== deleteData.seoLocale
      );

    let filterThumbnailPhotoLocalization =
      tableDataById.thumbnailPhoto?.localizations?.filter(
        (item) => item.locale !== deleteData.seoLocale
      );

    const obj = {
      authorId: tableDataById?.authorId,
      blogCategoryId: tableDataById?.blogCategoryId,
      contentsData: filteredContentData,
      seoData: filteredSeoData,
      titlesData: filteredTitlesData,
      publishedAt: tableDataById?.publishedAt,
      coverPhoto: {
        id: tableDataById?.coverPhoto?.id,
        localization: filterCoverPhotoLocalization,
        title: tableDataById?.coverPhoto?.title,
      },
      thumbnailPhoto: {
        id: tableDataById?.thumbnailPhoto?.id,
        localization: filterThumbnailPhotoLocalization,
        title: tableDataById?.thumbnailPhoto?.title,
      },
    };

    await dispatch(
      updatePostsThunk({
        id: tableDataById.id,
        data: obj,
        contentsData: obj.contentsData,
        titlesData: obj.titlesData,
        seoData: obj.seoData,
        coverPhoto: obj.coverPhoto,
        thumbnailPhoto: obj.thumbnailPhoto,
      })
    )
      .unwrap()
      .then(() => {
        showNotification({
          message: t("posts.localizationTable.deleteSucessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("posts.localizationTable.deleteError"),
          color: "red",
        });
      });
    dispatch(fetchPostsByIdThunk(tableDataById.id));
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

  const rows = useMemo(() => {
    return preparedTableData(tableDataById).map((row, index) => (
      <tr key={index}>
        {TableCell(row.seoLocale)}
        {TableCell(row.title)}
        {TableCell(row.metaDescription)}
        {TableCell(row.metaKeywords)}
        {TableCell(row.seoTitle)}

        <td className={classes.buttonColumn}>
          <Group position="right" className={classes.buttonContainer}>
            <Button
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={() => updateLocalizationModal(row)}
            >
              <Pencil className={classes.tableIconsLogo} />
            </Button>
            <Button
              disabled={row.seoLocale === "en" ? true : false}
              className={classes.tableIconsButton}
              variant="subtle"
              onClick={() => {
                setDeleteBannerVisible(true);
                setDeleteData(row);
              }}
            >
              <Trash
                className={
                  row.seoLocale === "en" ? null : classes.tableIconsTrash
                }
              />
            </Button>
          </Group>
        </td>
      </tr>
    ));
  }, [sortBy, search, reverseSortDirection, tableDataById]);

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
            onClick={() => createNewLocalizationModal()}
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
                sorted={sortBy === "seoLocale"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("seoLocale")}
              >
                {t("posts.localizationTable.seoLocale")}
              </Th>
              <Th
                sorted={sortBy === "title"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("title")}
              >
                {t("posts.localizationTable.postTitle")}
              </Th>
              <Th
                sorted={sortBy === "metaDescription"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("metaDescription")}
              >
                {t("posts.localizationTable.metaDescription")}
              </Th>
              <Th
                sorted={sortBy === "metaKeywords"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("metaKeywords")}
              >
                {t("posts.localizationTable.metaKeywords")}
              </Th>

              <Th
                sorted={sortBy === "seoTitle"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("seoTitle")}
              >
                {t("posts.localizationTable.seoTitle")}
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
      <PostsLocalizationModal
        opened={modalVisible}
        onClose={closeModal}
        modalData={modalData}
        isUpdate={isUpdate}
        updateData={updateData}
      />
      <DeleteBanner
        deleteMethod={deletePostsLocalization}
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

export default PostsLocalizationTable;
