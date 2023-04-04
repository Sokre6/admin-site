import React from "react";
import { createStyles, TextInput } from "@mantine/core";
import { Search } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  searchInput: {
    width: "25vw",
    marginBottom: "0px !important",
  },
}));

function SearchBar({ search, handleSearchChange }) {
  const { classes } = useStyles();

  return (
    <TextInput
      placeholder="Search by any field"
      mb="md"
      icon={<Search size={14} />}
      value={search}
      onChange={handleSearchChange}
      className={classes.searchInput}
    />
  );
}

export default SearchBar;
