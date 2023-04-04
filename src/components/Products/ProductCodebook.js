import React from "react";
import { createStyles } from "@mantine/core";
import ProductsTable from "./ProductsTable";

const useStyles = createStyles((theme) => ({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
  languageSelectContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: `${theme.spacing.md}px`,
  },
}));

const ProductCodebook = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <div>
        <ProductsTable />
      </div>
    </div>
  );
};

export default ProductCodebook;
