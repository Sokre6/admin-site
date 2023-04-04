import { createStyles } from "@mantine/core";
import OrderTermsAndConditionsTable from "./OrderTermsAndConditionsTable";

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


const OrderTermsAndConditions=()=>{
    const { classes } = useStyles();
    return (
      <div className={classes.mainContainer}>
        <div>
          <OrderTermsAndConditionsTable/>
        </div>
      </div>
    );
  };


export default OrderTermsAndConditions;