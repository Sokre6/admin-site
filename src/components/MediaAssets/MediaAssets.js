import { createStyles } from "@mantine/core";
import MediaAssetsTable from "./MediaAssetsTable";

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

const MediaAssets=()=>{
    const { classes } = useStyles();

    return (
        <div className={classes.mainContainer}>
          <div>
           <MediaAssetsTable/>
          </div>
        </div>
      );
}

export default MediaAssets;