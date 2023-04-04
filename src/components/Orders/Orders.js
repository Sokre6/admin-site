import { createStyles } from "@mantine/core";
import OrdersTable from "./OrdersTable";

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



const Orders=()=>{
    const { classes } = useStyles();
    return (
      <div className={classes.mainContainer}>
        <div>
         <OrdersTable/>
        </div>
      </div>
    );
}


export default Orders