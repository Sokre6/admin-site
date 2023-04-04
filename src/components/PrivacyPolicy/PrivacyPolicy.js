import { createStyles } from "@mantine/core";
import PrivacyPolicyTable from "./PrivacyPolicyTable";

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

const PrivacyPolicy = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <div>
        <PrivacyPolicyTable />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
