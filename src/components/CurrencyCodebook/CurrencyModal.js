import { useForm, yupResolver } from "@mantine/form";
import { createStyles, Modal, Button, TextInput, Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import { currencies } from "./currencies";
import {
  fetchCurrencyByCodeThunk,
  fetchCurrencyDataThunk,
  insertNewCurrencyThunk,
  updateCurrencyThunk,
} from "../../store/slices/currency";

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

const CurrencyModal = ({ opened, onClose, updateData, isUpdate }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const locale = useSelector((state) => state.settings.language);
  const tableData = useSelector((state) => state.currency.tableData);
  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("currencyModal.whitespaceValidation"))
      .strict(true)
      .required(t("currencyModal.nameValidation"))
      .min(1, t("currencyModal.nameValidation"))
      .max(255, t("currencyModal.stringLenghtValidation")),
    code: Yup.string().test(
      "len",
      t("currencyModal.codeValidation"),
      (val) => val.length === 3
    ),
  });
  const form = useForm({
    initialValues: {
      name: "",
      code: "",
    },
    schema: yupResolver(schema),
  });

  const parseCurrencies = (currencies) => {
    var currencyArray = Array.from(
      new Set(
        currencies
          .filter((item) => {
            if (
              item.AlphabeticCode === null ||
              item.AlphabeticCode === undefined ||
              item.WithdrawalDate !== null
            ) {
              return false;
            }
            return true;
          })
          .map(({ AlphabeticCode }) => {
            return AlphabeticCode;
          })
      )
    );
    var tableCurrencies = tableData.map(({ code }) => {
      return code;
    });
    return currencyArray.filter((item) => !tableCurrencies.includes(item));
  };
  const prepareDataForUpdate = (data, responseData) => {
    var updateData = responseData.names.filter((item) => item.locale !== "en");
    updateData = [...updateData, { locale: "en", name: data.name }];
    var object = {
      code: data.code,
      names: updateData,
    };
    return object;
  };

  const submitForm = async (data) => {
    var responseData = [];
    if (isUpdate) {
      await dispatch(fetchCurrencyByCodeThunk(data.code))
        .unwrap()
        .then((response) => {
          responseData = response;
        })
        .catch((e) => {
          showNotification({
            message: t("languageModal.updateFailed"),
            color: "red",
          });
        });
      var updateData = prepareDataForUpdate(data, responseData);
      await dispatch(updateCurrencyThunk(updateData))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("currencyModal.updateSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("currencyModal.updateFailed"),
            color: "red",
          });
        });
    } else {
      await dispatch(insertNewCurrencyThunk({ locale, data }))
        .unwrap()
        .then(() => {
          form.reset();
          onClose();
          showNotification({
            message: t("currencyModal.insertSuccessfull"),
            color: "green",
          });
        })
        .catch((e) => {
          showNotification({
            message: t("currencyModal.insertFailed"),
            color: "red",
          });
        });
    }
    await dispatch(fetchCurrencyDataThunk());
  };

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        name: updateData.name,
        code: updateData.code,
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
        title={t("currencyModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("currencyModal.nameInputTitle")}
            placeholder={t("currencyModal.nameInputPlaceholder")}
            classNames={classes}
            {...form.getInputProps("name")}
          />

          <Select
            disabled={isUpdate}
            style={{ marginTop: 20, zIndex: 2 }}
            data={parseCurrencies(currencies)}
            label={t("currencyModal.codeInputTitle")}
            placeholder={t("currencyModal.codeInputPlaceholder")}
            classNames={classes}
            searchable
            {...form.getInputProps("code", { type: "select" })}
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

export default CurrencyModal;
