import { createStyles } from "@mantine/core";
import UserAdminstrationAccountsTable from "./UserAdministrationAccountsTable";

const useStyles = createStyles((theme) => ({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
}));

const UserAdminstrationAccounts = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <div>
        <UserAdminstrationAccountsTable />
      </div>
    </div>
  );
};

export default UserAdminstrationAccounts;
