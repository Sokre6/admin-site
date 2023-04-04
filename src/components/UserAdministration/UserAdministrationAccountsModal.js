import { useTranslation } from "react-i18next";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";
import {
  Button,
  Group,
  createStyles,
  Modal,
  Switch,
  Text,
  TextInput,
  MultiSelect,
  Box,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  createUserAccountAdministrationDataThunk,
  fetchUserAccountAdministrationDataThunk,
  updateUserAccountAdministrationDataThunk,
} from "../../store/slices/userAccountAdministration";

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
  /*  item: {
    "& + &": {
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },
  }, */
}));

const UserAdministrationAccountsModal = (props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const tableData = useSelector(
    (state) => state.userAccountAdministration.tableData
  );
  const rolesData = useSelector((state) => state.roles.data);

  const isNewUserAdministrationAccount = () => !(props.data && props.data.id);

  const schema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, t("userModal.nameValidation"))
      .max(256, t("userModal.lengthValidationName"))
      .trim(t("userModal.nameWhitespaceValidation"))
      .strict(true),
    lastName: Yup.string()
      .min(2, t("userModal.lastNameValidation"))
      .max(256, t("userModal.lengthValidationLastName"))
      .trim(t("userModal.nameWhitespaceValidation"))
      .strict(true),
    email: Yup.string()
      .email(t("userModal.invalidEmail"))
      .required(t("userModal.emailValidation"))
      .max(256, t("userModal.lengthValidationMail"))
      .trim(t("userModal.emailWhitespaceValidation"))
      .strict(true)
      .test("isUnique", t("userModal.isUnique"), (value) => {
        const isEdit = props.data?.id;

        const data = isEdit
          ? tableData?.filter((item) => item.id !== props.data?.id)
          : tableData;

        const alreadyExists = data.find(
          ({ email }) =>
            email.toString().toLowerCase() === value.toString().toLowerCase()
        );

        return !alreadyExists;
      }),
    roles: Yup.array().min(1, t("userModal.rolesValidation")),
  });

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      enabled: true,
      roles: [],
    },
    schema: yupResolver(schema),
  });

  const createUserAccountAdministration = async (data) => {
    await dispatch(createUserAccountAdministrationDataThunk(data))
      .unwrap()
      .then(() => {
        showNotification({
          message: t("userModal.insertSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("userModal.insertFailed"),
          color: "red",
        });
      });
    dispatch(fetchUserAccountAdministrationDataThunk());
  };
  const updateUserAccountAdministration = async (data) => {
    await dispatch(
      updateUserAccountAdministrationDataThunk({ id: props?.data?.id, data })
    )
      .unwrap()
      .then(() => {
        showNotification({
          message: t("userModal.updateSuccessfull"),
          color: "green",
        });
      })
      .catch((e) => {
        showNotification({
          message: t("userModal.updateFailed"),
          color: "red",
        });
      });
    dispatch(fetchUserAccountAdministrationDataThunk());
  };

  const submitForm = (data) => {
     isNewUserAdministrationAccount()
      ? createUserAccountAdministration(data)
      : updateUserAccountAdministration(data);
    form.reset();
    props.onClose();
  };

  const parseRoles = (possibleRoles, allRoles) =>{
    return allRoles.filter(role => possibleRoles.includes(role))
  }
  
  useEffect(() => {
    form.reset();
    if (props.data) {
      form.setValues({
        firstName: props?.data?.firstName,
        lastName: props?.data?.lastName,
        email: props?.data?.email,
        enabled: props?.data?.enabled ? true : false,
        roles: parseRoles(rolesData,props.data.roles)
      });
    }
  }, [props]);

  return (
    <>
      <Modal
      closeOnClickOutside={false}
        centered
        opened={props.show}
        onClose={() => props.onClose()}
        title={t("userModal.modalTitle")}
        sx={(theme) => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      >
        <form onSubmit={form.onSubmit(submitForm)}>
          <TextInput
            label={t("userModal.firstName")}
            placeholder={t("userModal.firstNamePlaceholder")}
            classNames={classes}
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label={t("userModal.lastName")}
            placeholder={t("userModal.lastNamePlaceholder")}
            classNames={classes}
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label={t("userModal.email")}
            placeholder={t("userModal.emailPlaceholder")}
            classNames={classes}
            disabled={props?.data?.enabled === false}
            {...form.getInputProps("email")}
          />

          <MultiSelect
            key={rolesData.id}
            data={rolesData}
            searchable
            styles={(theme) => ({
              root: { position: "relative" },
              input: {
                height: "auto",
                paddingTop: 18,
              },
              label: {
                pointerEvents: "none",
                fontSize: theme.fontSizes.xs,
                paddingLeft: theme.spacing.sm / 2,
                zIndex: 1,
              },
            })}
            label={
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  paddingLeft: theme.spacing.sm / 2,
                  top: 28,
                  zIndex: 99,
                })}
              >
                {t("userModal.roles")}
              </Box>
            }
            placeholder={t("userModal.rolesPlaceholder")}
            {...form.getInputProps("roles")}
          />

          <Group
            position="apart"
            style={{
              marginTop: 20,
              zIndex: 2,
              paddingLeft: "12px",
            }}
            noWrap
            spacing="xl"
          >
            <div>
              <Text>{t("userModal.activityTitle")}</Text>
              <Text size="xs" color="dimmed">
                {t("userModal.activityText")}
              </Text>
            </div>
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
              {...form.getInputProps("enabled", { type: "checkbox" })}
            />
          </Group>

          <div className={classes.buttonContainer}>
            <Button className={classes.insertButton} type="submit">
              {isNewUserAdministrationAccount()
                ? t("userModal.insertButton")
                : t("userModal.updateButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UserAdministrationAccountsModal;
