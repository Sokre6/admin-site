import { useForm, yupResolver } from "@mantine/form";
import { createStyles, Modal, Button, TextInput, Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { showNotification } from "@mantine/notifications";
import { parseLanguageNames } from "../common/parseLanguageNames";
import { useParams } from "react-router-dom";
import {
  fetchCountriesByIdThunk,
  updateCountries,
} from "../../store/slices/countries";

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

const CountriesLocalizationModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const params = useParams();

  const tableLocalizationData = useSelector(
    (state) => state?.countries?.tableDataById
  );

  const languageData = useSelector((state) => state.language.tableData);

  const languagesCode = languageData.map((item) => item?.code);

  const filterCountryLocale = tableLocalizationData.countryNames.map(
    (item) => item.locale
  );
  const filteredLanguages = languagesCode.filter(
    (code) => !filterCountryLocale.includes(code)
  );

  const { opened, onClose, updateData, isUpdate, modalData } = props;

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("countryModal.whitespaceValidation"))
      .strict(true)
      .required(t("countryModal.required"))
      .min(1, t("countryModal.nameValidation"))
      .max(255, t("countryModal.stringLenghtValidation")),
    locale: Yup.string().test(
      "len",
      t("countryModal.localeValidationLength"),
      (val) => val.length >= 2 && val.length <= 3
    ),
  });

  const form = useForm({
    initialValues: {
      locale: "",
      name: "",
    },

    schema: yupResolver(schema),
  });

  const prepareUpdateObject = (data) => {
    const object = {
      countryCode: tableLocalizationData.countryCode,
      applicability: {
        countryOfOrigin: tableLocalizationData?.applicability?.countryOfOrigin,
        countryOfDelivery:
          tableLocalizationData?.applicability?.countryOfDelivery,
      },
      activity: tableLocalizationData?.activity,
      countryNames: data,
    };

    return object;
  };

  const submitForm = async (data) => {
    let updateObject = [];

    if (isUpdate) {
      let updatedData = tableLocalizationData.countryNames.filter(
        (item) => item.locale !== data.locale
      );

      updatedData = [...updatedData, data];
      updateObject = prepareUpdateObject(updatedData);

      await dispatch(
        updateCountries({
          countryCode: modalData.countryCode,

          data: updateObject,
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("countryModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("countryModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      let createdData = modalData.countryNames.filter(
        (item) => item.locale !== data.locale
      );

      createdData = [...createdData, data];
      updateObject = prepareUpdateObject(createdData);
      await dispatch(
        updateCountries({
          countryCode: tableLocalizationData.countryCode,

          data: updateObject,
        })
      )
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("countryModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("countryModal.insertFailed"),
            color: "red",
          });
        });
    }
    dispatch(fetchCountriesByIdThunk(params.code));
  };

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        locale: updateData.locale,
        name: updateData.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        }}
        title={t("countryModal.countryModalLocale")}
        sx={() => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("countriesTable.name")}
            placeholder={t("countriesTable.name")}
            classNames={classes}
            {...form.getInputProps("name")}
          />

          <Select
            disabled={isUpdate}
            data={filteredLanguages}
            label={t("countriesTable.locale")}
            placeholder={t("countriesTable.locale")}
            classNames={classes}
            searchable
            {...form.getInputProps("locale", { type: "select" })}
          />
          <div className={classes.buttonContainer}>
            <Button type="submit" className={classes.insertButton}>
              {t("modalCommon.saveButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CountriesLocalizationModal;
