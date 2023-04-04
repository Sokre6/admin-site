import { useForm, yupResolver } from "@mantine/form";
import {
  createStyles,
  Modal,
  Button,
  TextInput,
  Switch,
  Group,
  Text,
  Select,
  Space,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import {
  createCountryThunk,
  fetchCountriesByIdThunk,
  fetchCountriesDataThunk,
  updateCountries,
} from "../../store/slices/countries";
import countriesDataLocal from "../../allCountries.json";
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

  switch: {
    color: theme.colors.colorBlack,
    "& *": {
      cursor: "pointer",
    },
  },

  insertButton: {
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
  title: {
    lineHeight: 1,
  },
}));

const CountriesModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const locale = useSelector((state) => state.settings.language);

  const tableData = useSelector((state) => state?.countries.tableData);

  const tableDataCountryCodes = tableData.map((item) => item.countryCode);

  const localCountriesData = countriesDataLocal.map((item) => item?.code);

  const filteredCountries = localCountriesData?.filter(
    (code) => !tableDataCountryCodes.includes(code)
  );

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim(t("countryModal.whitespaceValidation"))
      .strict(true)
      .required(t("countryModal.required"))
      .min(1, t("countryModal.nameValidation"))
      .max(255, t("countryModal.stringLenghtValidation")),
    code: Yup.string().min(2, t("countryModal.codeValidation")),
  });

  const form = useForm({
    initialValues: {
      code: "",
      name: "",
      countryOfOrigin: false,
      countryOfDelivery: false,
      activity: true,
    },
    schema: yupResolver(schema),
  });

  const submitForm = async (data) => {
    let updateItem = [];

    if (props?.data) {
      await dispatch(fetchCountriesByIdThunk(props?.data?.countryCode))
        .unwrap()
        .then((response) => {
          updateItem = response;
        });

      let updateArrayObject = updateItem?.countryNames.filter(
        (item) => item.locale !== "en"
      );
      updateArrayObject = [
        ...updateArrayObject,
        { locale: "en", name: data.name },
      ];

      const objectToUpdate = {
        countryCode: props.data.countryCode,
        countryNames: updateArrayObject,
        applicability: {
          countryOfOrigin: data.countryOfOrigin,
          countryOfDelivery: data.countryOfDelivery,
        },
        activity: data.activity ? "ACTIVE" : "INACTIVE",
      };
      await dispatch(
        updateCountries({
          countryCode: data?.code,
          data: objectToUpdate,
        })
      )
        .unwrap()
        .then(() => {
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
      await dispatch(
        createCountryThunk({ countryCode: data?.code, locale, data })
      )
        .unwrap()
        .then(() => {
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
    form.reset();
    props?.onClose();
    dispatch(fetchCountriesDataThunk());
  };

  useEffect(() => {
    form.clearErrors();

    if (props.data) {
      form.setValues({
        code: props.data.countryCode,

        name: props.data.name,
        countryOfOrigin: props.data.countryOfOrigin === "YES" ? true : false,
        countryOfDelivery:
          props.data.countryOfDelivery === "YES" ? true : false,
        activity: props.data.activity === "ACTIVE" ? true : false,
      });
    }
  }, [props]);
  return (
    <Modal
      closeOnClickOutside={false}
      centered
      opened={props.show}
      onClose={() => {
        form.reset();
        props.onClose();
      }}
      sx={() => ({
        ".mantine-Modal-title": {
          fontWeight: "bold",
        },
      })}
      title={t("countryModal.modalTitle")}
    >
      <form onSubmit={form.onSubmit(submitForm)}>
        <TextInput
          label={t("countryModal.nameInputLabel")}
          placeholder={t("countryModal.nameInputPlaceholder")}
          classNames={classes}
          {...form.getInputProps("name")}
        />

        <Select
          data={props.data ? tableDataCountryCodes : filteredCountries}
          disabled={props.data}
          placeholder={t("countryModal.countryCodeSelectPlaceholder")}
          label={t("countryModal.countryCodeSelectLabel")}
          classNames={classes}
          searchable
          {...form.getInputProps("code")}
        />

        <Group
          position="apart"
          style={{
            marginTop: 20,
            zIndex: 2,
            paddingLeft: "12px",
          }}
          className={classes.item}
          noWrap
          spacing="xl"
        >
          <div>
            <Text>{t("countryModal.countryOfOrigin")}</Text>
            <Switch
              sx={(theme) => ({
                width: "100px",
                ".mantine-1mx6z95:checked": {
                  background: theme.colors.colorBlack,
                  borderColor: theme.colors.colorBlack,
                },
                ".mantine-1mx6z95:checked::before": {
                  background: theme.colors.colorLightGray,
                  borderColor: theme.colors.colorLightGray,
                },
                ".mantine-1mx6z95::before": {
                  background: theme.colors.colorGray,
                  borderColor: theme.colors.colorGray,
                },
              })}
              className={classes.switch}
              size="lg"
              {...form.getInputProps("countryOfOrigin", { type: "checkbox" })}
            />
          </div>
          <div style={{}}>
            <Text>{t("countryModal.countryOfDelivery")}</Text>
            <Switch
              sx={(theme) => ({
                width: "100px",
                ".mantine-1mx6z95:checked": {
                  background: theme.colors.colorBlack,
                  borderColor: theme.colors.colorBlack,
                },
                ".mantine-1mx6z95:checked::before": {
                  background: theme.colors.colorLightGray,
                  borderColor: theme.colors.colorLightGray,
                },
                ".mantine-1mx6z95::before": {
                  background: theme.colors.colorGray,
                  borderColor: theme.colors.colorGray,
                },
              })}
              className={classes.switch}
              size="lg"
              {...form.getInputProps("countryOfDelivery", { type: "checkbox" })}
            />
          </div>
          <div>
            <Text>{t("countryModal.activity")}</Text>
            <Space h="xl" />
            <Switch
              sx={(theme) => ({
                width: "100px",
                ".mantine-1mx6z95:checked": {
                  background: theme.colors.colorBlack,
                  borderColor: theme.colors.colorBlack,
                },
                ".mantine-1mx6z95:checked::before": {
                  background: theme.colors.colorLightGray,
                  borderColor: theme.colors.colorLightGray,
                },
                ".mantine-1mx6z95::before": {
                  background: theme.colors.colorGray,
                  borderColor: theme.colors.colorGray,
                },
              })}
              className={classes.switch}
              size="lg"
              {...form.getInputProps("activity", { type: "checkbox" })}
            />
          </div>
        </Group>
        <div className={classes.buttonContainer}>
          <Group position="right">
            <Button type="submit" className={classes.insertButton}>
              {t("modalCommon.saveButton")}
            </Button>
          </Group>
        </div>
      </form>
    </Modal>
  );
};

export default CountriesModal;
