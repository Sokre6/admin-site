import { createStyles } from "@mantine/core";
import AuthorTable from "./AuthorTable";

const useStyles = createStyles((theme) => ({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
}));

const Author = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.mainContainer}>
      <div>
        <AuthorTable />
      </div>
    </div>
  );
};

export default Author;
