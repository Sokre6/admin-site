import { Loader } from "@mantine/core";
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  spinnerContainer: {
    position: "fixed",
    top: "50%",
    left: "50%",
  },
}));
const PageRefreshLoader = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.spinnerContainer}>
      <Loader color="dark" size="xl" />
    </div>
  );
};

export default PageRefreshLoader;
