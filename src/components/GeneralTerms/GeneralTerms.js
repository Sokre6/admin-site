import { createStyles } from "@mantine/core";
import GeneralTermsTable from "./GeneralTermsTable";



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

const GeneralTerms=()=>{
    const { classes } = useStyles();
    return (
      <div className={classes.mainContainer}>
        <div>
         <GeneralTermsTable/>
        </div>
      </div>
    );
  };

export default GeneralTerms;