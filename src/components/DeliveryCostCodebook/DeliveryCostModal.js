import { useForm, yupResolver } from "@mantine/form";
import {
  createStyles,
  Modal,
  Button,
  Select,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import countriesData from "../../allCountries.json";
import {
  fetchDeliveryCostData,
  insertNewDeliveryCostThunk,
  updateDeliveryCostThunk,
} from "../../store/slices/deliveryCost";
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
    zIndex: 2,
  },

  input: {
    height: "auto",
    paddingTop: 18,
  },

  numberInput: {
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
  modalTitle: {
    fontWeight: "bold",
  },
}));

const DeliveryCostModal = ({ opened, onClose, updateData, isUpdate }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const allCountries = countriesData.map((countryObj) => countryObj.code);
  const schema = Yup.object().shape({
    coverageFrom: Yup.number()
      .typeError(t("deliveryCostModal.numberValidation"))
      .min(0, t("deliveryCostModal.positiveNumberValidation"))
      .max(
        Yup.ref("coverageTo"),
        t("deliveryCostModal.coverageFromHigherThantCoverageTo")
      )
      .required(t("deliveryCostModal.numberValidation")),
    coverageTo: Yup.number()
      .typeError(t("deliveryCostModal.numberValidation"))
      .test(
        "coverageTo",
        t("deliveryCostModal.coverageToLowerThenCoverageFrom"),
        function (value) {
          return value > this.parent.coverageFrom ? true : false;
        }
      )
      .max(999999999999.99, t("deliveryCostModal.maxNumberValidation"))
      .required(),
    fixedAmnt: Yup.number()
      .typeError(t("deliveryCostModal.numberValidation"))
      .min(0, t("deliveryCostModal.positiveNumberValidation"))
      .max(999999999999.99, t("deliveryCostModal.maxNumberValidation"))
      .required(t("deliveryCostModal.numberValidation")),
    totalAmntCoeff: Yup.number()
      .typeError(t("deliveryCostModal.numberValidation"))
      .min(0, t("deliveryCostModal.positiveNumberValidation"))
      .max(999999999999.99, t("deliveryCostModal.maxNumberValidation"))
      .required(t("deliveryCostModal.numberValidation")),
  });
  const form = useForm({
    initialValues: {
      deliveryCountry: null,
      coverageFrom: "",
      coverageTo: "",
      coverageCurr: "EUR",
      fixedAmnt: "",
      totalAmntCoeff: "",
    },
    schema: yupResolver(schema),
  });
  const submitForm = async (data) => {
    if (isUpdate) {
      await dispatch(updateDeliveryCostThunk({ id: updateData.id, data: data }))
        .unwrap()
        .then(() => {
          showNotification({
            message: t("deliveryCostModal.insertSuccessfull"),
            color: "green",
          });

          form.reset();
          onClose();
        })
        .catch((e) => {
          showNotification({
            message: t("deliveryCostModal.insertFailed"),
            color: "red",
          });
          form.setFieldError("coverageFrom", "Interval already exists");
          form.setFieldError("coverageTo", "Interval already exists");
        });
    } else {
      await dispatch(insertNewDeliveryCostThunk(data))
        .unwrap()
        .then(() => {
          showNotification({
            message: t("deliveryCostModal.insertSuccessfull"),
            color: "green",
          });

          form.reset();
          onClose();
        })
        .catch((e) => {
          showNotification({
            message: t("deliveryCostModal.insertFailed"),
            color: "red",
          });
          form.setFieldError("coverageFrom", "Interval already exists");
          form.setFieldError("coverageTo", "Interval already exists");
        });
    }
    await dispatch(fetchDeliveryCostData());
  };

  useEffect(() => {
    form.clearErrors();
    if (isUpdate) {
      form.setValues({
        deliveryCountry: updateData.deliveryCountry,
        coverageFrom: updateData.coverageFrom,
        coverageTo: updateData.coverageTo,
        coverageCurr: updateData.coverageCurr,
        fixedAmnt: updateData.fixedAmnt,
        totalAmntCoeff: updateData.totalAmntCoeff,
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
        title={t("deliveryCostModal.modalTitle")}
        classNames={{ title: classes.modalTitle }}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <NumberInput
            label={t("deliveryCostModal.coverageFrom")}
            placeholder={t("deliveryCostModal.coverageFromPlaceholder")}
            classNames={classes}
            precision={2}
            min={0}
            {...form.getInputProps("coverageFrom")}
          />
          <NumberInput
            label={t("deliveryCostModal.coverageTo")}
            placeholder={t("deliveryCostModal.coverageToPlaceholder")}
            classNames={classes}
            precision={2}
            min={0}
            {...form.getInputProps("coverageTo")}
          />
          <TextInput
            disabled
            label={t("deliveryCostModal.coverageCurr")}
            placeholder={t("deliveryCostModal.coverageCurrPlaceholder")}
            classNames={classes}
            {...form.getInputProps("coverageCurr")}
          />
          <NumberInput
            label={t("deliveryCostModal.fixedAmnt")}
            placeholder={t("deliveryCostModal.fixedAmntPlaceholder")}
            classNames={classes}
            precision={2}
            min={0}
            {...form.getInputProps("fixedAmnt")}
          />
          <NumberInput
            label={t("deliveryCostModal.totalAmntCoeff")}
            placeholder={t("deliveryCostModal.totalAmntCoeffPlaceholder")}
            classNames={classes}
            precision={2}
            min={0}
            {...form.getInputProps("totalAmntCoeff")}
          />
          <Select
            //disabled={isUpdate}
            data={allCountries}
            label={t("deliveryCostModal.deliveryCountry")}
            placeholder={t("deliveryCostModal.deliveryCountryPlaceholder")}
            classNames={classes}
            searchable
            {...form.getInputProps("deliveryCountry", { type: "select" })}
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
export default DeliveryCostModal;
