import { createStyles } from "@mantine/core";
import OfficeTable from "./OfficeTable";

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

const OfficeCodebook = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <div>
        <OfficeTable />
      </div>
    </div>
  );
};

export default OfficeCodebook;
