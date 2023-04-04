import { createStyles } from "@mantine/core";
import PostsTable from "./PostsTable";

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

const Posts = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.mainContainer}>
      <div>
        <PostsTable />
      </div>
    </div>
  );
};

export default Posts;
