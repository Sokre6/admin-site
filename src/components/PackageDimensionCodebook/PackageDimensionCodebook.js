import { createStyles } from "@mantine/core";
import PackageDimensionTable from "./PackageDimensionTable";


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

const PackageDimensionCodebook = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <div>
        <PackageDimensionTable/>
      </div>
    </div>
  );
};

export default PackageDimensionCodebook;