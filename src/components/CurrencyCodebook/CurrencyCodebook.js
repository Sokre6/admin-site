import { createStyles } from "@mantine/core";
import React from "react";
import CurrencyTable from "./CurrencyTable";

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

const CurrencyCodebook = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <div>
        <CurrencyTable />
      </div>
    </div>
  );
};
export default CurrencyCodebook;
