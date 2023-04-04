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



const AboutUsModal=(props)=>{

    const { classes } = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { opened, onClose, isUpdate, updateData, ABOUT_US } = props;
    const locale = useSelector((state) => state.settings.language);
  
    const tableData = useSelector(
      (state) => state?.legalDocumentsByType?.tableData
    );

    const schema = Yup.object().shape({
      name: Yup.string()
        .trim(t("aboutUsModal.whitespaceValidation"))
        .strict(true)
        .required(t("aboutUsModal.required"))
        .min(1, t("aboutUsModal.nameValidation"))
        .max(255, t("aboutUsModal.nameLength")),
      validFrom: Yup.date()
        .typeError(t("aboutUsModal.invalidDate"))
        .test(
          "isFreeTermPeriod",
          t("aboutUsModal.isFreeTermPeriod"),
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
        .typeError(t("aboutUsModal.invalidDate"))
        .test(
          "isFreeTermPeriod",
          t("aboutUsModal.isFreeTermPeriod"),
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
          t("aboutUsModal.isFreeTermPeriod"),
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
          t("aboutUsModal.isGreaterThan"),
          function (value) {
            const { validFrom } = this.parent;
            return value.getTime() > validFrom.getTime();
          }
        ),
      content: Yup.string()
        .trim(t("aboutUsModal.contentWhitespaceValidation"))
        .strict(true)
        .required(t("aboutUsModal.required"))
        .min(1, t("aboutUsModal.contentValidation"))
        .max(255, t("aboutUsModal.contentLength")),
    });

    const form = useForm({
        initialValues: {
          name: "",
          type: ABOUT_US,
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
                message: t("aboutUsModal.updateFailed"),
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
                message: t("aboutUsModal.updateSuccessfull"),
                color: "green",
              });
            })
            .catch((e) => {
              showNotification({
                message: t("aboutUsModal.updateFailed"),
                color: "red",
              });
            });
        } 
        await dispatch(fetchLegalDocumentsByTypeThunk(ABOUT_US));
    
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
            title={t("aboutUsModal.modalTitle")}
            sx={(theme) => ({
              ".mantine-Modal-title": {
                fontWeight: "bold",
              },
            })}
          >
            <form onSubmit={form.onSubmit(submitForm)}>
              <TextInput
                label={t("aboutUsModal.nameInputTitle")}
                placeholder={t("aboutUsModal.nameInputPlaceholder")}
                classNames={classes}
                {...form.getInputProps("name")}
              />
              <TextInput
                readOnly
                label={t("aboutUsModal.typeTitle")}
                placeholder={t("aboutUsModal.nameInputPlaceholder")}
                classNames={classes}
                {...form.getInputProps("type")}
              />
              <DatePicker
                minDate={new Date()}
                classNames={classes}
                inputFormat="DD.MM.YYYY"
                label={t("aboutUsModal.dateFromTitle")}
                {...form.getInputProps("validFrom")}
              />
    
              <DatePicker
                minDate={new Date()}
                classNames={classes}
                inputFormat="DD.MM.YYYY"
                label={t("aboutUsModal.dateToTitle")}
                disabled={form.getInputProps("validFrom").value === ""}
                {...form.getInputProps("validTo")}
              />
              <Textarea
                autosize
                minRows={2}
                label={t("aboutUsModal.contentTitle")}
                placeholder={t("aboutUsModal.contentInputPlaceholder")}
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


export default AboutUsModal;