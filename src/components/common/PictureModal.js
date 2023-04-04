import { createStyles, Image, Modal } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  pictureCointainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "cente",
  },
  modalRoot: {
    backroundColor: "transparent",
  },
}));
const PictureModal = ({ opened, onClose, imageUrl, name }) => {
  const { classes } = useStyles();
  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        withCloseButton={false}
        classNames={{ root: classes.modalRoot }}
      >
        <div className={classes.pictureCointainer}>
          <Image
            onClick={() => {
              onClose();
            }}
            radius="md"
            key={name}
            src={imageUrl}
            imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
          />
        </div>
      </Modal>
    </>
  );
};

export default PictureModal;
