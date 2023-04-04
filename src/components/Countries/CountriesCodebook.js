import { createStyles } from "@mantine/core";
import React from "react";
import CountriesTable from "./CountriesTable";

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

const CountriesCodebook = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <div>
        <CountriesTable/>
      </div>
    </div>
  );
};
export default CountriesCodebook;
