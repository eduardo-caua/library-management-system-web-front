import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { IBook, BooksService } from '../../shared/services/api/books/BooksService';
import { ReportsService } from '../../shared/services/api/reports/ReportsService';
import { ListsComponent } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { BaseLayout } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';

export const BooksList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

  const search = useMemo(() => {
    return searchParams.get('search') || '';
  }, [searchParams]);
  
  const selectOption = useMemo(() => {
    return searchParams.get('selectOption') || '';
  }, [searchParams]);

  const page = useMemo(() => {
    return Number(searchParams.get('page') || '1');
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      BooksService.getAll(page, search, selectOption)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            console.log(result);

            setCount(result.count);
            setRows(result.rows);
          }
        });
    });
  }, [search, selectOption, page]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to proceed?')) {
      BooksService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]);
            alert('Book successfully deleted!');
          }
        });
    }
  };

  return (
    <BaseLayout
      title='Books'
      toolbar={
        <ListsComponent
          showSearchInput
          showSearchSelect
          showDownloadButton={count !== 0 }
          searchText={search}
          selectOption={selectOption}
          options={[Environment.AVAILABLE,Environment.CHECKED_OUT,Environment.DELAYED]}
          newButtonLabel='New'
          onNewButtonClick={() => navigate('/books/new')}
          onDownloadButtonClick={() => {
            window.location.href = ReportsService.downloadBooksReport(search, selectOption);
          }}
          onSearchTextChange={text => setSearchParams({ search: text, selectOption, page: '1' }, { replace: true })}
          onSelectChange={option => setSearchParams({ search, selectOption: option, page: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={200}>Title</TableCell>
              <TableCell width={600}>Description</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell width={110}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.author}</TableCell>
                <TableCell>{row.isbn}</TableCell>
                <TableCell>{row.status === Environment.CHECKED_OUT && row.dueDate != null && new Date(row.dueDate+'T00:00:00').setHours(0,0,0,0) < new Date().setHours(0,0,0,0) ? Environment.DELAYED : row.status }</TableCell>
                <TableCell>{row.dueDate ? row.dueDate : '-'}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => navigate(`/books/${row.id}/tracking`)}>
                    <Icon>manage_search</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`/books/${row.id}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
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
                    onChange={(_, newPage) => setSearchParams({ search, selectOption, page: newPage.toString() }, { replace: true })}
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
