import { createStyles } from "@mantine/core";
import React from "react";
import QuestionsTable from "./QuestionsTable";

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

const QuestionsCodebook = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <QuestionsTable />
    </div>
  );
};
export default QuestionsCodebook;
