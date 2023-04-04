import { createStyles } from "@mantine/core";
import ProductCategoryTable from "./ProductCategoryTable";

const useStyles = createStyles((theme) => ({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
  goldFinenessSelectContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: `${theme.spacing.md}px`,
  },
}));

const ProductCategoryCodebook = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <div>
        <ProductCategoryTable/>
      </div>
    </div>
  );
};

export default ProductCategoryCodebook;
