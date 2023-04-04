import { createStyles } from "@mantine/core";
import React from "react";
import LanguageTable from "./LanguageTable";

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

const LanguageCodebook = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.mainContainer}>
      <div>
        <LanguageTable />
      </div>
    </div>
  );
};
export default LanguageCodebook;
