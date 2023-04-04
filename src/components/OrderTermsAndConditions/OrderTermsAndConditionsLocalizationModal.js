import { useForm, yupResolver } from "@mantine/form";
import {
  createStyles,
  Modal,
  Button,
  Select,
  Group,
  Text,
  Box,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import axios from "../../http/axios";
import { showNotification } from "@mantine/notifications";
import { parseLanguageNames } from "../common/parseLanguageNames";
import { useParams } from "react-router-dom";
import {
  fetchLegalDocumentsByTypeIdThunk,
  updateLegalDocumentsByTypeThunk,
} from "../../store/slices/legalDocuments";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { FileHorizontal, Trash, Upload } from "tabler-icons-react";
import { insertNewFileThunk } from "../../store/slices/file";

const useStyles = createStyles((theme) => ({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: `${theme.spacing.xs}px `,
  },
  root: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 18,
    marginTop: 20,
    zIndex: 2,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
  insertButton: {
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
}));

const OrderTermsAndConditionsLocalizationModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const params = useParams();

  const tableLocalizationData = useSelector(
    (state) => state?.legalDocumentsByType?.legalDocumentsByTypeId
  );
  const languageData = useSelector((state) => state.language.tableData);

  const { opened, onClose, updateData, isUpdate, modalData } = props;

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const schema = Yup.object().shape({
    locale: Yup.string().min(
      2,
      t("orderTermsAndConditionsLocalizationModal.codeValidation")
    ),
  });

  const uploadFile = async (files) => {
    if (files.length > 1) {
      showNotification({
        message: t("orderTermsAndConditionsLocalizationModal.fileLengthError"),
        color: "red",
      });
    } else {
      setIsLoading(true);
      const [file] = files;
      const formData = new FormData();

      formData.append("file", file, file.path);
      await dispatch(insertNewFileThunk(formData))
        .unwrap()
        .then((response) => {
          const url = response.location;
          const id = url.substring(url.lastIndexOf("/") + 1, url.length);
          setUploadedFile({ ...response, id, file: file });
        });
    }
    setIsLoading(false);
  };

  const parseLanguage = (languages) => {
    const locales = tableLocalizationData.descriptions.map(
      ({ locale }) => locale
    );

    const mappedLanguage = languages.map(({ code }) => code);

    const filteredLanguage = mappedLanguage.filter(
      (item) => !locales.includes(item)
    );

    return parseLanguageNames(languages, filteredLanguage);
  };

  const form = useForm({
    initialValues: {
      locale: "",

      name:
        modalData !== []
          ? tableLocalizationData?.descriptions?.find(
              (item) => item?.locale === "en"
            )?.name
          : "",
    },
    schema: yupResolver(schema),
  });

  const prepareUpdateObject = (data) => {
    const object = {
      validFrom: tableLocalizationData.validFrom,
      validTo: tableLocalizationData.validTo,
      contents: data,
    };

    return object;
  };

  const submitForm = async (data) => {
    const preparedData = {
      locale: data.locale,
      fileId: uploadedFile.id,
      name: data.name,
    };

    let updateObject = [];

    if (isUpdate) {
      setIsSubmit(true)
      let updatedData = modalData.descriptions.filter(
        (item) => item.locale !== preparedData.locale
      );

      updatedData = [...updatedData, preparedData];

      updateObject = prepareUpdateObject(updatedData);

      await dispatch(
        updateLegalDocumentsByTypeThunk({
          id: modalData.id,

          data: updateObject,
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t(
              "orderTermsAndConditionsLocalizationModal.updateSuccessfull"
            ),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("orderTermsAndConditionsLocalizationModal.updateFailed"),
            color: "red",
          });
        });
        setIsSubmit(false)
    } else {
      let createdData = tableLocalizationData.descriptions.filter(
        (item) => item.locale !== preparedData.locale
      );

      createdData = [...createdData, preparedData];

      updateObject = prepareUpdateObject(createdData);
      setIsSubmit(true)
      await dispatch(
        updateLegalDocumentsByTypeThunk({
          id: tableLocalizationData.id,

          data: updateObject,
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t(
              "orderTermsAndConditionsLocalizationModal.insertSuccessfull"
            ),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("orderTermsAndConditionsLocalizationModal.insertFailed"),
            color: "red",
          });
        });
        setIsSubmit(false)
    }
    dispatch(
      fetchLegalDocumentsByTypeIdThunk(params?.orderTermsAndConditionsId)
    );
  };

  const fetchFile = async (id) => {
    setIsLoading(true);

    if (id !== null) {
      const response = await axios.get(`/aurodomus-file/api/v1/files/${id}`, {
        responseType: "blob",
      });
      setUploadedFile({ ...response, id, name: id });
    }
    setIsLoading(false);
  };

  const deleteFile = () => {
    //napomena!!! trenutno nije podrzano brisanje slike s apija

    setUploadedFile(null);
  };

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        locale: updateData.locale,
        name: updateData.name,
      });
      fetchFile(updateData.fileId);
      setUploadedFile(null);
    }
  }, [updateData]);
  return (
    <>
      <Modal
        closeOnClickOutside={false}
        centered
        opened={opened}
        onClose={() => {
          form.reset();
          onClose();
          setUploadedFile(null);
        }}
        title={t("orderTermsAndConditionsLocalizationModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <Select
            disabled={isUpdate}
            data={parseLanguage(languageData)}
            label={t("orderTermsAndConditionsLocalizationModal.codeInputTitle")}
            placeholder={t(
              "orderTermsAndConditionsLocalizationModal.codeInputPlaceholder"
            )}
            classNames={classes}
            searchable
            {...form.getInputProps("locale", { type: "select" })}
          />
          <Box sx={{ position: "relative" }}>
            <Dropzone
              style={{ marginTop: 20, minHeight: uploadedFile ? 150 : 90 }}
              loading={isLoading}
              disabled={isLoading}
              maxSize={1000000}
              onReject={(file) => {
                if (
                  file[0].errors?.find((err) => err).code ===
                  "file-invalid-type"
                ) {
                  return showNotification({
                    message: t(
                      "orderTermsAndConditionsLocalizationModal.fileTypeError"
                    ),
                    color: "red",
                  });
                } else {
                  showNotification({
                    message: t(
                      "orderTermsAndConditionsLocalizationModal.fileSizeError"
                    ),
                    color: "red",
                  });
                }
              }}
              onDrop={uploadFile}
              accept={[MIME_TYPES.pdf]}
            >
              {function dropzoneContent() {
                return (
                  <>
                    <Group
                      position="left"
                      spacing="xl"
                      style={{ minHeight: 50, pointerEvents: "none" }}
                    >
                      {uploadedFile ? (
                        <Box>
                          <FileHorizontal size={40} />
                          <Text size="sm">
                            {t("orderTermsAndConditionsModal.name")}
                            {uploadedFile.id}
                          </Text>
                        </Box>
                      ) : (
                        (
                          <Box
                            sx={{
                              display: "flex",
                              textAlign: "center",
                              alignItems: "center",
                            }}
                          >
                            <Upload size={40} />
                            <Text size="xl" inline>
                              {t("orderTermsAndConditionsModal.uploadFile")}
                            </Text>
                          </Box>
                        )
                      )}
                    </Group>
                  </>
                );
              }}
            </Dropzone>
            {uploadedFile && (
              <Button
                sx={{ position: "absolute", top: "5rem", left: "1rem" }}
                color={"red"}
                onClick={(e) => {
                  deleteFile();
                }}
                mt="md"
              >
                <Trash />
              </Button>
            )}
          </Box>
          <div className={classes.buttonContainer}>
            <Button
            loading={isSubmit}
              disabled={!uploadedFile||isSubmit}
              type="submit"
              className={classes.insertButton}
            >
              {t("modalCommon.saveButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default OrderTermsAndConditionsLocalizationModal;
