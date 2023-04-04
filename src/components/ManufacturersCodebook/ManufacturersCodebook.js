import { createStyles } from "@mantine/core";
import ManufacturersTable from "./ManufacturersTable";

const useStyles = createStyles((theme) => ({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
  manufacturersSelectContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: `${theme.spacing.md}px`,
  },
}));

const ManufacturersCodebook = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <div>
        <ManufacturersTable />
      </div>
    </div>
  );
};

export default ManufacturersCodebook;
