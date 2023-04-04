import { useState } from "react";
import { createStyles, Image, Button, Text, Stack } from "@mantine/core";
import { Trash } from "tabler-icons-react";

import ProductPictureModal from "./ProductPictureModal";
const useStyles = createStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    border: "1px",
    borderColor: theme.colors.colorGray,
    borderStyle: "solid",
    borderRadius: "10px",
    width: "30%",
    height: "100%",
    marginLeft: "3px",
    marginBottom: "10px",
  },
  imageSection: {
    width: "100%",
    height: "60%",
    paddingTop: "10px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    overflow: "hidden",
    paddingRight: "10px",
    paddingLeft: "10px",
  },
  imgSize: {
    borderRadius: "30px",
  },
  titleSection: {
    width: "70%",
    height: "20%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    textAlign: "center",
    fontSize: "12px",
  },
  footerSection: {
    height: "8%",
    marginTop: "10px",
    width: "80%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  descriptionFont: {
    fontSize: "14px",
  },
  tableIconsButton: {
    padding: "0px",
    "&:hover": {
      backgroundColor: theme.colors.colorGray,
    },
  },
  tableIconsTrash: {
    color: theme.colors.colorBlack,
    "&:hover": {
      color: theme.colors.colorBlack,
    },
  },
}));

const ProductPictureCard = ({ image, name, onDelete }) => {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Stack
        sx={(theme) => ({
          padding: 8,
          border: `1px solid ${theme.colors.gray[2]}`,
          borderRadius: theme.radius.md,
        })}
      >
        <Image
          onClick={() => {
            setOpened(true);
          }}
          radius="md"
          key={name.id}
          src={!!image.file ? URL.createObjectURL(image.file) : image.url}
          height={100}
          width={120}
          fit="cover"
          sx={{ cursor: "zoom-in" }}
          imageProps={{ onLoad: () => image.url }}
        />

        <Text size="sm" sx={{ width: "15ch" }}>
          {"Name: " + name?.id}
        </Text>
        <Button
          variant="subtle"
          className={classes.tableIconsButton}
          onClick={() => {
            onDelete(name?.id);
          }}
        >
          <Trash className={classes.tableIconsTrash} />
        </Button>
      </Stack>
      <ProductPictureModal
        opened={opened}
        image={image}
        name={name.id}
        onClose={() => setOpened(false)}
      />
    </>
  );
};

export default ProductPictureCard;
