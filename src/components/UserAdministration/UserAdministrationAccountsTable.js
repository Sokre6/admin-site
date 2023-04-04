import React, {useState, useEffect} from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Button,
  Badge,
  Pagination,
  Select,
} from '@mantine/core';
import {Search, Plus, Trash, Pencil, Mail} from 'tabler-icons-react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchUserAccountAdministrationDataThunk,
  fetchUserAccountAdministrationPagedDataThunk,
  resendUserAccountMailThunk,
} from '../../store/slices/userAccountAdministration';
import UserAdministrationAccountsModal from './UserAdministrationAccountsModal';
import {fetchRolesDataThunk} from '../../store/slices/roles';
import {showNotification} from '@mantine/notifications';
import DeleteUserAccountsBanner from './DeleteUserAccountsBanner';
import TableCell from '../common/TableCell';
import {createSelector} from '@reduxjs/toolkit';

const useStyles = createStyles(theme => ({
  th: {
    padding: '0 !important',
  },
  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    cursor: 'default',
  },
  deleteIcon: {
    color:
      theme.colorScheme === 'dark' ? theme.colors.red[5] : theme.colors.red[5],
    marginLeft: theme.spacing.xl,
  },
  worldIcon: {
    marginLeft: theme.spacing.xl,
  },
  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
  scrollArea: {
    height: '85vh',
  },
  searchAndButtonContainter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
  },
  insertButton: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.colorDarkGray,
    '&:hover': {
      backgroundColor: theme.colors.colorBlack,
    },
  },
  buttonColumn: {
    width: '300px !important',
  },
  buttonContainer: {
    display: 'flex',
    width: '280px',
    paddingRight: '16px',
    flexWrap: 'wrap',
    '@media (max-width: 1150px)': {
      flexDirection: 'column',
    },
  },
  tableIconsButton: {
    padding: '0px',
    '&:hover': {
      backgroundColor: theme.colors.colorGray,
    },
  },
  tableIconsLogo: {
    color: theme.colors.colorDarkGray,
    '&:hover': {
      color: theme.colors.colorBlack,
    },
  },
  tableIconsTrash: {
    color: theme.colors.colorRed,
    '&:hover': {
      color: theme.colors.colorRed,
    },
  },
  searchInput: {
    width: '25vw',
    marginBottom: '0px !important',
  },
  searchInputMargin: {
    marginBottom: '0px',
  },
  thead: {
    borderBottom: `1px solid #dee2e6`,
  },
}));

const UserAdminstrationAccountsTable = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {classes} = useStyles();

  const allTableData = useSelector(
    state => state.userAccountAdministration.allTableData,
  );

  const tableData = useSelector(
    state => state.userAccountAdministration.tableData,
  );

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(null);

  const [showUserAdminAccountModal, setShowUserAdminAccountModal] =
    useState(false);
  const [userAdminAccountModalData, setUserAdminAccountModalData] =
    useState(null);
  const [
    showDeleteUserAdminAccountBanner,
    setShowDeleteUserAdminAccountModalBanner,
  ] = useState(false);
  const [deleteUserAdminAccountData, setDeleteUserAdminAccountBannerData] =
    useState(false);

  const openUserAdminAccountModal = data => {
    setUserAdminAccountModalData(data);
    setShowUserAdminAccountModal(true);
  };

  const closeUserAdminAccountModal = () => {
    setUserAdminAccountModalData(null);
    setShowUserAdminAccountModal(false);
  };

  const showDeleteBanner = data => {
    setShowDeleteUserAdminAccountModalBanner(true);
    setDeleteUserAdminAccountBannerData(data);
  };
  const closeDeleteBanner = () => {
    setShowDeleteUserAdminAccountModalBanner(false);
  };

  const handleSearchChange = event => {
    const {value} = event.currentTarget;
    setSearch(value);
  };

  const [paginationProps, setPaginationProps] = useState({
    activePage: 0,
    pageSize: '10',
  });

  const totalPagesSelector = createSelector(
    state => state.userAccountAdministration.totalCount,
    totalCount => {
      return Math.ceil(totalCount / paginationProps.pageSize);
    },
  );

  const totalPages = useSelector(state => totalPagesSelector(state));

  const searchTableData = () => {
    if (search !== '') {
      let filteredData = allTableData.filter(
        item =>
          item.firstName.toLowerCase().includes(search.toLowerCase()) ||
          item.lastName.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          (item.enabled ? 'ENABLED' : 'DISABLED')
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          item.roles.toString().toLowerCase().includes(search.toLowerCase()),
      );
      return filteredData;
    } else {
      return tableData;
    }
  };

  const prepareTableData = data => {
    if (data.length === 0) {
      return [];
    } else {
      return searchTableData();
    }
  };

  const Th = ({children, reversed, sorted, onSort}) => {
    const {classes} = useStyles();
    return (
      <th className={classes.th}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="left">
            <Text weight={500} size="sm">
              {children}
            </Text>
            <Center className={classes.icon}>
              <></>
            </Center>
          </Group>
        </UnstyledButton>
      </th>
    );
  };

  const checkRoleBadge = role => {
    switch (role) {
      case 'CODEBOOK_ADMIN':
        return (
          <Badge key={role} color="teal" size="sm">
            {role}
          </Badge>
        );

      case 'USER_ADMIN':
        return (
          <Badge key={role} color="violet" size="sm">
            {role}
          </Badge>
        );
      case 'FAQ_ADMIN':
        return (
          <Badge key={role} color="orange" size="sm">
            {role}
          </Badge>
        );

      default:
        return (
          <Badge key={role} size="sm">
            {' '}
            {role}
          </Badge>
        );
    }
  };

  const resendMail = async row => {
    await dispatch(resendUserAccountMailThunk({id: row.id}))
      .unwrap()
      .then(() => {
        showNotification({
          message: t(`userModal.mailSentSuccessfully`, {email: row.email}),
          color: 'green',
        });
      })
      .catch(e => {
        showNotification({
          message: t(`userModal.mailSentFailed`, {email: row.email}),
          color: 'red',
        });
      })
      .finally(() => setLoading(null));
  };

  const rows = prepareTableData(tableData).map((row, i) => (
    <tr key={i}>
      {TableCell(row.firstName)}
      {TableCell(row.lastName)}
      {TableCell(row.email)}
      {TableCell(row.enabled ? 'Enabled' : 'Disabled')}
      <td>
        <Group position="apart">
          {row.roles.map(role => checkRoleBadge(role))}
        </Group>
      </td>

      <td className={classes.buttonColumn}>
        <Group position="right" className={classes.buttonContainer}>
          <Button
            className={classes.tableIconsButton}
            variant="subtle"
            loading={loading === row.id}
            onClick={() => {
              setLoading(row.id);
              resendMail(row);
            }}
            disabled={row.enabled === false}>
            <Mail
              className={row.enabled === false ? '' : classes.tableIconsLogo}
            />
          </Button>
          <Button
            className={classes.tableIconsButton}
            variant="subtle"
            onClick={() => {
              openUserAdminAccountModal(row);
            }}>
            <Pencil className={classes.tableIconsLogo} />
          </Button>

          <Button
            className={classes.tableIconsButton}
            variant="subtle"
            onClick={() => showDeleteBanner(row)}>
            <Trash className={classes.tableIconsTrash} />
          </Button>
        </Group>
      </td>
    </tr>
  ));

  useEffect(() => {
    dispatch(fetchUserAccountAdministrationDataThunk());
    dispatch(fetchRolesDataThunk());
  }, []);

  useEffect(() => {
    dispatch(
      fetchUserAccountAdministrationPagedDataThunk({
        first: paginationProps.pageSize * paginationProps.activePage,
        max: paginationProps.pageSize,
      }),
    );
  }, [paginationProps]);
  return (
    <>
      <ScrollArea className={classes.scrollArea}>
        <div className={classes.searchAndButtonContainter}>
          <TextInput
            className={classes.searchInput}
            placeholder={t('table.search')}
            mb="md"
            icon={<Search size={14} />}
            value={search}
            onChange={handleSearchChange}
          />
          <Button
            className={classes.insertButton}
            onClick={() => openUserAdminAccountModal()}>
            <Plus size={18} />
          </Button>
        </div>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{tableLayout: 'fixed', minWidth: 700}}>
          <thead className={classes.thead}>
            <tr>
              <Th>{t('user.firstName')}</Th>
              <Th>{t('user.lastName')}</Th>
              <Th>{t('user.email')}</Th>
              <Th>{t('user.enabled')}</Th>
              <Th>{t('user.roles')}</Th>
              <th className={classes.buttonColumn}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 && rows !== [] ? (
              rows
            ) : (
              <tr>
                <td colSpan={5}>
                  <Text weight={500} align="center">
                    {t('table.nothingFound')}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      <Group style={{bottom: 5, position: 'absolute', right: 5}}>
        <Pagination
          page={paginationProps.activePage + 1}
          onChange={page =>
            setPaginationProps(prev => ({...prev, activePage: page - 1}))
          }
          total={totalPages}
          color={'dark'}
        />
        <Select
          styles={{
            root: {
              width: 65,
            },
          }}
          data={['10', '25', '50']}
          placeholder={t('posts.mediaGallery.pageSize')}
          value={paginationProps.pageSize}
          onChange={value =>
            setPaginationProps(prev => ({
              ...prev,
              activePage: 0,
              pageSize: value,
            }))
          }
        />
      </Group>
      <UserAdministrationAccountsModal
        show={showUserAdminAccountModal}
        data={userAdminAccountModalData}
        onClose={closeUserAdminAccountModal}
      />

      <DeleteUserAccountsBanner
        show={showDeleteUserAdminAccountBanner}
        data={deleteUserAdminAccountData}
        onClose={closeDeleteBanner}
      />
    </>
  );
};

export default UserAdminstrationAccountsTable;
