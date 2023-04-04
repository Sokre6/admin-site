import { createStyles, Overlay } from "@mantine/core";
import { useState } from "react";
import LanguageTable from "../LanguageCodebook/LanguageTable";
import GoldFinesessModal from "./GoldFinenessModal";
import GoldFinenessTable from "./GoldFinenessTable";

const useStyles = createStyles((theme) => ({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
  goldFinenessSelectContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: `${theme.spacing.md}px`,
  },
}));

const GoldFinenessCodebook = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.mainContainer}>
      <div>
        <GoldFinenessTable />
      </div>
    </div>
  );
};

export default GoldFinenessCodebook;
