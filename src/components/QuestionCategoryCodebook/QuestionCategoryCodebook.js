import { createStyles } from "@mantine/core";
import React from "react";
import QuestionCategoryTable from "./QuestionCategoryTable";

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

const QuestionCategoryCodebook = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <QuestionCategoryTable />
    </div>
  );
};

export default QuestionCategoryCodebook;
