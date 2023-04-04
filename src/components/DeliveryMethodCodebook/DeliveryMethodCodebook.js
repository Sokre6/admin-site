import { createStyles } from "@mantine/core";
import React from "react";
import DeliveryMethodTable from "./DeliveryMethodTable";

const useStyles = createStyles((theme) => ({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
  languageSelectContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: `${theme.spacing.md}px`,
  },
}));

const DeliveryMethodCodebook = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <div>
        <DeliveryMethodTable />
      </div>
    </div>
  );
};

export default DeliveryMethodCodebook;
