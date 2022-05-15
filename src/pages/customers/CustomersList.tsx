import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ICustomersList, CustomersService, } from '../../shared/services/api/customers/CustomersService';
import { ListsComponent } from '../../shared/components';
import { BaseLayout } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';
import { Environment } from '../../shared/environment';


export const CustomersList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<ICustomersList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);


  const search = useMemo(() => {
    return searchParams.get('search') || '';
  }, [searchParams]);

  const page = useMemo(() => {
    return Number(searchParams.get('page') || '1');
  }, [searchParams]);


  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      CustomersService.getAll(page, search)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            setCount(result.count);
            setRows(result.rows);
          }
        });
    });
  }, [search, page]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to proceed?')) {
      CustomersService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]);
            alert('Customer successfully deleted!');
          }
        });
    }
  };


  return (
    <BaseLayout
      title='Customers'
      toolbar={
        <ListsComponent
          searchPlaceholder={Environment.SEARCH_PLACEHOLDER_BY_NAME}
          showSearchInput
          searchText={search}
          newButtonLabel='New'
          onNewButtonClick={() => navigate('/customers/new')}
          onSearchTextChange={text => setSearchParams({ search: text, page: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell width={100}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`/customers/${row.id}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          {count === 0 && !isLoading && (
            <caption>{Environment.EMPTY_LIST_MESSAGE}</caption>
          )}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            )}
            {(count > 0 && count > Environment.PAGE_SIZE) && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={page}
                    count={Math.ceil(count / Environment.PAGE_SIZE)}
                    onChange={(_, newPage) => setSearchParams({ search, page: newPage.toString() }, { replace: true })}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </BaseLayout>
  );
};
