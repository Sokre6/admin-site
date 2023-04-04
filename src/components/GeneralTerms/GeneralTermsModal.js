import { useTranslation } from "react-i18next";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";
import {
  Button,
  createStyles,
  Modal,
  Textarea,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useEffect } from "react";
import { DatePicker } from "@mantine/dates";

import {
  createLegalDocumentsByTypeThunk,
  fetchLegalDocumentsByTypeIdThunk,
  fetchLegalDocumentsByTypeThunk,
  updateLegalDocumentsByTypeThunk,
} from "../../store/slices/legalDocuments";

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
}));

const GeneralTermsModal = (props) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { opened, onClose, isUpdate, updateData, TERMS_AND_CONDITIONS } = props;
  const locale = useSelector((state) => state.settings.language);

  const tableData = useSelector(
    (state) => state?.legalDocumentsByType?.tableData
  );

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("generalTermsModal.whitespaceValidation"))
      .strict(true)
      .required(t("generalTermsModal.required"))
      .min(1, t("generalTermsModal.nameValidation"))
      .max(255, t("generalTermsModal.nameLength")),
    validFrom: Yup.date()
      .typeError(t("generalTermsModal.invalidDate"))
      .test(
        "isFreeTermPeriod",
        t("generalTermsModal.isFreeTermPeriod"),
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
      .typeError(t("generalTermsModal.invalidDate"))
      .test(
        "isFreeTermPeriod",
        t("generalTermsModal.isFreeTermPeriod"),
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
        t("generalTermsModal.isFreeTermPeriod"),
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
        t("generalTermsModal.isGreaterThan"),
        function (value) {
          const { validFrom } = this.parent;
          return value.getTime() > validFrom.getTime();
        }
      ),
    content: Yup.string()
      .trim(t("generalTermsModal.contentWhitespaceValidation"))
      .strict(true)
      .required(t("generalTermsModal.required"))
      .min(1, t("generalTermsModal.contentValidation"))
      .max(255, t("generalTermsModal.contentLength")),
  });

  const form = useForm({
    initialValues: {
      name: "",
      type: TERMS_AND_CONDITIONS,
      validFrom: "",
      validTo: "",
      content: "",
    },
    schema: yupResolver(schema),
  });

  const submitForm = async (data) => {
    let updateItem = [];

    if (isUpdate) {
      await dispatch(fetchLegalDocumentsByTypeIdThunk(updateData.id))
        .unwrap()
        .then((response) => {
          updateItem = response;
        })
        .catch((e) => {
          showNotification({
            message: t("deliveryMethodModal.updateFailed"),
            color: "red",
          });
        });

      let updateArrayObject = updateItem.descriptions.filter(
        (item) => item.locale !== "en"
      );
      updateArrayObject = [
        ...updateArrayObject,
        { locale: "en", name: data.name, content: data.content },
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
            message: t("generalTermsModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("generalTermsModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      await dispatch(createLegalDocumentsByTypeThunk({ locale, data }))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("generalTermsModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("generalTermsModal.insertFailed"),
            color: "red",
          });
        });
    }
    await dispatch(fetchLegalDocumentsByTypeThunk(TERMS_AND_CONDITIONS));

    onClose();
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
        content: updateData.content,
      });
    }
  }, [updateData]);

  return (
    <>
      <Modal
        closeOnClickOutside={false}
        centered
        opened={opened}
        onClose={() => {
          form.clearErrors();
          form.reset();
          onClose();
        }}
        title={t("generalTermsModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("generalTermsModal.nameInputTitle")}
            placeholder={t("generalTermsModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("name")}
          />
          <TextInput
            readOnly
            label={t("generalTermsModal.typeTitle")}
            placeholder={t("generalTermsModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("type")}
          />
          <DatePicker
            minDate={new Date()}
            classNames={classes}
            inputFormat="DD.MM.YYYY"
            label={t("generalTermsModal.dateFromTitle")}
            {...form.getInputProps("validFrom")}
          />

          <DatePicker
            minDate={new Date()}
            classNames={classes}
            inputFormat="DD.MM.YYYY"
            label={t("generalTermsModal.dateToTitle")}
            disabled={form.getInputProps("validFrom").value === ""}
            {...form.getInputProps("validTo")}
          />
          <Textarea
            autosize
            minRows={2}
            label={t("generalTermsModal.contentTitle")}
            placeholder={t("generalTermsModal.contentInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("content")}
          />
          <div className={classes.buttonContainer}>
            <Button className={classes.insertButton} type="submit">
              {t("modalCommon.saveButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default GeneralTermsModal;
