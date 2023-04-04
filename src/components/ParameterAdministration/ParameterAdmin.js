import { createStyles } from "@mantine/core";
import ParameterAdminTable from "./ParameterAdminTable";


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

const ParameterAdmin=()=>{
    const { classes } = useStyles();
    return (
      <div className={classes.mainContainer}>
        <div>
          <ParameterAdminTable />
        </div>
      </div>
    );
  };



export default ParameterAdmin;