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
  Pagination,
  Select,
} from '@mantine/core';
import {Search} from 'tabler-icons-react';
import {createSelector} from '@reduxjs/toolkit';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchMobileUserAccountAdministrationDataThunk,
  fetchMobileUserAccountAdministrationPagedDataThunk,
} from '../../store/slices/mobileUserAccountAdministration';
import TableCell from '../common/TableCell';

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

const UserAdminMobileAccountsTable = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {classes} = useStyles();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const allTableData = useSelector(
    state => state.mobileAccountAdministration?.allTableData,
  );

  const tableData = useSelector(
    state => state.mobileAccountAdministration?.tableData,
  );

  const handleSearchChange = event => {
    const {value} = event.currentTarget;
    setSearch(value);
  };

  const [paginationProps, setPaginationProps] = useState({
    activePage: 0,
    pageSize: '10',
  });

  const totalPagesSelector = createSelector(
    state => state.mobileAccountAdministration.totalCount,
    totalCount => {
      return Math.ceil(totalCount / paginationProps.pageSize);
    },
  );

  const totalPages = useSelector(state => totalPagesSelector(state));

  const setSorting = field => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const searchTableData = () => {
    if (search !== '') {
      let filteredData = allTableData.filter(
        item =>
          item.firstName.toLowerCase().includes(search.toLowerCase()) ||
          item.lastName.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()),
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

  const rows = prepareTableData(tableData).map((row, i) => (
    <tr key={i}>
      {TableCell(row.firstName)}
      {TableCell(row.lastName)}
      {TableCell(row.email)}
    </tr>
  ));

  useEffect(() => {
    dispatch(fetchMobileUserAccountAdministrationDataThunk());
  }, []);

  useEffect(() => {
    dispatch(
      fetchMobileUserAccountAdministrationPagedDataThunk({
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
        </div>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{tableLayout: 'fixed', minWidth: 700}}>
          <thead className={classes.thead}>
            <tr>
              <Th
                className={classes.buttonColumn}
                sorted={sortBy === 'firstName'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('firstName')}>
                {t('user.firstName')}
              </Th>
              <Th
                className={classes.buttonColumn}
                sorted={sortBy === 'lastName'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('lastName')}>
                {t('user.lastName')}
              </Th>
              <Th
                className={classes.buttonColumn}
                sorted={sortBy === 'email'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('email')}>
                {t('user.email')}
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 && rows !== [] ? (
              rows
            ) : (
              <tr>
                <td colSpan={3}>
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
    </>
  );
};

export default UserAdminMobileAccountsTable;
