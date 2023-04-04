import { createStyles } from "@mantine/core";
import UserAdminMobileAccountsTable from "./UserAdminMobileAccountsTable";

const useStyles = createStyles((theme) => ({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
}));

const UserAdminMobileAccounts = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <div>
        <UserAdminMobileAccountsTable />
      </div>
    </div>
  );
};

export default UserAdminMobileAccounts;
