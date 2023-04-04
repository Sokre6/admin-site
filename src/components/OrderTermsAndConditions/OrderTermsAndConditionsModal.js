import { useTranslation } from "react-i18next";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";
import {
  Button,
  createStyles,
  Modal,
  TextInput,
  Group,
  Text,
  Box,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";
import { DatePicker } from "@mantine/dates";
import axios from "../../http/axios";
import {
  createLegalDocumentsByTypeThunk,
  fetchLegalDocumentsByTypeIdThunk,
  fetchLegalDocumentsByTypeThunk,
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
    marginTop: 20,
  },

  input: {
    height: "auto",
    paddingTop: 18,
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
}));

const OrderTermsAndConditionsModal = (props) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { opened, onClose, isUpdate, updateData, ORDER_TERMS_AND_CONDITIONS } =
    props;
  const locale = useSelector((state) => state.settings.language);
  const fileId = useSelector(
    (state) =>
      state?.legalDocumentsByType?.legalDocumentsByTypeId?.descriptions?.find(
        (file) => file
      )?.fileId
  );

  const tableData = useSelector(
    (state) => state?.legalDocumentsByType?.tableData
  );

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("orderTermsAndConditionsModal.whitespaceValidation"))
      .strict(true)
      .required(t("orderTermsAndConditionsModal.required"))
      .min(1, t("orderTermsAndConditionsModal.nameValidation"))
      .max(255, t("orderTermsAndConditionsModal.nameLength")),
    validFrom: Yup.date()
      .typeError(t("orderTermsAndConditionsModal.invalidDate"))
      .test(
        "isFreeTermPeriod",
        t("orderTermsAndConditionsModal.isFreeTermPeriod"),
        (value) => {
          const isEdit = updateData?.id;
          const data = isEdit
            ? tableData?.filter((item) => item.id !== updateData?.id)
            : tableData;

          const date = data?.find((item) => {
            return (
              new Date(value) >= new Date(item?.validFrom) &&
              new Date(value) <= new Date(item?.validTo)
            );
          });

          return date ? false : true;
        }
      ),
    validTo: Yup.date()
      .typeError(t("orderTermsAndConditionsModal.invalidDate"))
      .test(
        "isFreeTermPeriod",
        t("orderTermsAndConditionsModal.isFreeTermPeriod"),
        function (value) {
          const { validFrom } = this.parent;
          const isEdit = updateData?.id;

          const data = isEdit
            ? tableData?.filter((item) => item.id !== updateData?.id)
            : tableData;

          const checkAvailabiltyDate = data.find(
            (item) =>
              new Date(item.validFrom).getTime() >= validFrom.getTime() &&
              new Date(item.validTo).getTime() <= new Date(value).getTime()
          );

          return checkAvailabiltyDate ? false : true;
        }
      )
      .test(
        "isFreeTermPeriod",
        t("orderTermsAndConditionsModal.isFreeTermPeriod"),
        function (value) {
          const isEdit = updateData?.id;
          const data = isEdit
            ? tableData?.filter((item) => item.id !== updateData?.id)
            : tableData;

          const date = data?.find((item) => {
            return (
              new Date(value) >= new Date(item?.validFrom) &&
              new Date(value) <= new Date(item?.validTo)
            );
          });

          return date ? false : true;
        }
      )
      .test(
        "isGreaterThan",
        t("orderTermsAndConditionsModal.isGreaterThan"),
        function (value) {
          const { validFrom } = this.parent;
          return value.getTime() > validFrom.getTime();
        }
      ),
  });

  const form = useForm({
    initialValues: {
      name: "",
      type: ORDER_TERMS_AND_CONDITIONS,
      validFrom: "",
      validTo: "",
    },
    schema: yupResolver(schema),
  });

  const submitForm = async (data) => {
    let updateItem = [];

    if (isUpdate) {
      setIsSubmit(true)
      await dispatch(fetchLegalDocumentsByTypeIdThunk(updateData.id))
        .unwrap()
        .then((response) => {
          updateItem = response;
          
        })
        .catch((e) => {
          showNotification({
            message: t("orderTermsAndConditionsModal.updateFailed"),
            color: "red",
          });
        });

      let updateArrayObject = updateItem.descriptions.filter(
        (item) => item.locale !== "en"
      );
      updateArrayObject = [
        ...updateArrayObject,
        { locale: "en", name: data.name, fileId: uploadedFile.id },
      ];

      const objectToUpdate = {
        validFrom: data.validFrom,
        validTo: data.validTo,
        contents: updateArrayObject,
      };
      await dispatch(
        updateLegalDocumentsByTypeThunk({
          id: updateData.id,
          data: objectToUpdate,
        })
      )
        .unwrap()
        .then((response) => {
          showNotification({
            message: t("orderTermsAndConditionsModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("orderTermsAndConditionsModal.updateFailed"),
            color: "red",
          });
        });
        setIsSubmit(false)
    } else {
      setIsSubmit(true)
      await dispatch(
        createLegalDocumentsByTypeThunk({
          locale,
          data,
          fileId: uploadedFile.id,
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("orderTermsAndConditionsModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("orderTermsAndConditionsModal.insertFailed"),
            color: "red",
          });
        });
        setIsSubmit(false)
    }
    await dispatch(fetchLegalDocumentsByTypeThunk(ORDER_TERMS_AND_CONDITIONS));

    onClose();
  };

  const uploadFile = async (files) => {
    if (files.length > 1) {
      showNotification({
        message: t("orderTermsAndConditionsModal.fileLengthError"),
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
      setIsLoading(false);
    }
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
    form.reset();
    if (isUpdate) {
      form.setValues({
        name: updateData.name,
        type: updateData.type,
        validFrom: new Date(updateData.validFrom),
        validTo: new Date(updateData.validTo),
      });
      fetchFile(fileId);
      setUploadedFile(null);
    }
  }, [updateData, isUpdate]);

  return (
    <>
      <Modal
        closeOnClickOutside={false}
        centered
        opened={opened}
        onClose={() => {
          onClose();
          setUploadedFile(null);
          form.reset();
        }}
        title={t("orderTermsAndConditionsModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("orderTermsAndConditionsModal.nameInputTitle")}
            placeholder={t("orderTermsAndConditionsModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("name")}
          />
          <TextInput
            readOnly
            label={t("orderTermsAndConditionsModal.typeTitle")}
            placeholder={t("orderTermsAndConditionsModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("type")}
          />
          <DatePicker
            minDate={new Date()}
            classNames={classes}
            inputFormat="DD.MM.YYYY"
            label={t("orderTermsAndConditionsModal.dateFromTitle")}
            {...form.getInputProps("validFrom")}
          />

          <DatePicker
            minDate={new Date()}
            classNames={classes}
            inputFormat="DD.MM.YYYY"
            label={t("orderTermsAndConditionsModal.dateToTitle")}
            disabled={form.getInputProps("validFrom").value === ""}
            {...form.getInputProps("validTo")}
          />
          <Box sx={{ position: "relative" }}>
            <Dropzone
              style={{ marginTop: 20, minHeight: uploadedFile ? 150 : 90 }}
              loading={isLoading}
              disabled={isLoading}
              maxSize={1000000}
              onDrop={uploadFile}
              onReject={(file) => {
                if (
                  file[0].errors?.find((err) => err).code ===
                  "file-invalid-type"
                ) {
                  return showNotification({
                    message: t("orderTermsAndConditionsModal.fileTypeError"),
                    color: "red",
                  });
                } else {
                  showNotification({
                    message: t("orderTermsAndConditionsModal.fileSizeError"),
                    color: "red",
                  });
                }
              }}
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
              className={classes.insertButton}
              type="submit"
            >
              {t("modalCommon.saveButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default OrderTermsAndConditionsModal;
