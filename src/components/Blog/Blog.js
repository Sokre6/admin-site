import { createStyles } from "@mantine/core";
import BlogTable from "./BlogTable";

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
  

const Blog =()=>{

    const { classes } = useStyles();

    return (
        <div className={classes.mainContainer}>
          <div>
            <BlogTable/>
          </div>
        </div>
      );
}


export default Blog