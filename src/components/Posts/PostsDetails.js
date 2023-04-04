import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import PostDetailsForm from "./PostsDetailsForm";

const PostsDetails = () => {
  const { postsId } = useParams();

  const tableDataById = useSelector((state) => state?.posts?.tableDataById);

  const prepareTableDataById = (data) => {
    if (data === undefined) {
      return [];
    } else {
      const tableDataById = {
        id: data?.id,
        title: data?.titles?.find((item) => item.locale === "en").title,
        seoTitle: data?.seoData?.find((item) => item.locale === "en").title,
        metaDescription: data?.seoData?.find((item) => item?.locale === "en")
          .metaDescription,
        metaKeywords: data?.seoData?.find((item) => item?.locale === "en")
          .metaKeywords,
        blogCategoryId: data?.blogCategoryId,
        publishedAt: data?.publishedAt !== null && new Date(data?.publishedAt),
        createdAt: data?.createdAt,
        authorId: data?.authorId,
        shortContent: data?.contents?.find((item) => item.locale === "en")
          .shortContent,
        content: data?.contents?.find((item) => item.locale === "en").content,
        time: data?.publishedAt !== null && new Date(data?.publishedAt),
        tags: data?.tags.map((n) => n.id),
        coverPhotoTitle: data?.coverPhoto?.title,
        thumbnailPhotoTitle: data?.thumbnailPhoto?.title,
        altTextCoverPhoto: data?.coverPhoto?.localizations.find(
          (item) => item?.locale === "en"
        ).altText,
        captionCoverPhoto: data?.coverPhoto?.localizations.find(
          (item) => item?.locale === "en"
        ).caption,
        altTextThumbnailPhoto: data?.thumbnailPhoto?.localizations.find(
          (item) => item?.locale === "en"
        ).altText,
        captionThumbnailPhoto: data?.thumbnailPhoto?.localizations.find(
          (item) => item?.locale === "en"
        ).caption,
        coverPhotoFileId: data?.coverPhoto?.mediaAssetInfo?.fileId,
        thumbnailPhotoFileId: data?.thumbnailPhoto?.mediaAssetInfo?.fileId,
        coverPhotoFileUrl:data?.coverPhoto?.mediaAssetInfo?.fileLocationUrl,
        thumbnailPhotoFileUrl:data?.thumbnailPhoto?.mediaAssetInfo?.fileLocationUrl
      };

      return tableDataById;
    }
  };

  const setFormInitialValues = (postsId) => {
    return postsId === "new"
      ? {
          authorId: null,
          blogCategoryId: null,
          publishedAt: new Date(),
          time: new Date(),
          metaDescription: "",
          metaKeywords: "",
          seoTitle: "",
          title: "",
          shortContent: "",
          content: "<p><br></p>",
          tags: [],
          altTextCoverPhoto: "",
          captionCoverPhoto: "",
          altTextThumbnailPhoto: "",
          captionThumbnailPhoto: "",
          coverPhotoTitle: "",
          thumbnailPhotoTitle: "",
        }
      : prepareTableDataById(tableDataById);
  };

  return (
    <>
      <PostDetailsForm
        initialValues={setFormInitialValues(postsId)}
        status={postsId !== "new" && tableDataById?.status}
      />
    </>
  );
};

export default PostsDetails;
