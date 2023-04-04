import { createStyles } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useDispatch } from "react-redux";
import { fetchPostsThunk, patchPostsThunk } from "../../../store/slices/posts";
import * as Yup from "yup";
import { yupResolver,useForm  } from "@mantine/form";


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

const PublishModal = (props) => {
  const { open, onClose, modalData } = props;
  const { t } = useTranslation();
  const { classes } = useStyles();

  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    publishedAt:Yup.date().required().typeError(t("posts.validations.date")),
    time:Yup.date().required().typeError(t("posts.validations.time")),
  
 });

  const form = useForm({
    initialValues: {
      publishedAt: new Date(),
      time: new Date(),
    },
    schema: yupResolver(schema),
  });

  const submitForm = async (data) => {
    const mergedDateTime = new Date(data?.publishedAt.getTime());

    mergedDateTime.setHours(data.time.getHours());
    mergedDateTime.setMinutes(data.time.getMinutes());
    mergedDateTime.setSeconds(data.time.getSeconds());
    mergedDateTime.setMilliseconds(data?.time.getMilliseconds());

    await dispatch(
      patchPostsThunk({
        id: modalData?.id,
        publishedAt: mergedDateTime,
        type: "publish",
      })
    );

    await dispatch(
      fetchPostsThunk()
    );

    onClose();
  };
  return (
    <>
    
      <Modal
        closeOnClickOutside={false}
        centered
        opened={open}
        onClose={() => {
          form.reset();

          onClose();
        }}
        title={t("posts.postTable.modalTitle")}
        sx={() => ({
          ".mantine-Modal-title": {
            fontWeight: "bold",
          },
        })}
      > 
        <form onSubmit={form.onSubmit(submitForm)}>
          <DatePicker
            classNames={classes}
            inputFormat="DD.MM.YYYY"
            
            label={t("posts.postTable.publishedAt")}
            {...form.getInputProps("publishedAt")}
          />
          <TimeInput
            classNames={classes}
            clearable
            label={t("posts.postTable.time")}
            {...form.getInputProps("time")}
          />

          <div className={classes.buttonContainer}>
            <Button type="submit" className={classes.insertButton}>
              {t("posts.postTable.publishButton")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PublishModal;
