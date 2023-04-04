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
const ProductPictureModal = ({ opened, onClose, image, name }) => {
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
            src={!!image.file ? URL.createObjectURL(image.file) : image.url}
            imageProps={{
              onLoad: () =>
                !!image.file ? URL.createObjectURL(image.file) : image.url,
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default ProductPictureModal;
