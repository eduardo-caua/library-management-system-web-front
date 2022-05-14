import { useEffect, useMemo, useState } from 'react';
import { IconButton, Icon, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';

import { ITracking, TrackingService, } from '../../shared/services/api/tracking/TrackingService';
import { ListsComponent } from '../../shared/components';
import { BaseLayout } from '../../shared/layouts';
import { Environment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';

export const TrackingList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookId } = useParams<'bookId'>();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<ITracking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      TrackingService.getAll(Number(bookId), pagina)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            console.log(result);

            setTitle(result.data.book.title);
            setStatus(result.data.book.status);
            setTotalCount(result.totalCount);
            setRows(result.data.tracking);
          }
        });
    });
  }, [pagina]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to proceed?')) {
      TrackingService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]);
            alert('Tracking successfully deleted!');
          }
        });
    }
  };

  return (
    <BaseLayout
      title={'Tracking for '+title}
      toolbar={
        <ListsComponent
          mostrarInputBusca={false}
          textoBotaoNovo={status === 'IN' ? 'Check Out' : 'Return'}
          aoClicarEmNovo={() => navigate(`/books/${bookId}/tracking/new`)}
          aoMudarTextoDeBusca={() => setSearchParams({pagina: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Operation</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell width={110}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.createdAt.split('T')[0]}</TableCell>
                <TableCell>{row.action}</TableCell>
                <TableCell>{row.customer.name}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => navigate(`/books/${bookId}/tracking/${row.id}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          {totalCount === 0 && !isLoading && (
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
            {(totalCount > 0 && totalCount > Environment.PAGE_SIZE) && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={pagina}
                    count={Math.ceil(totalCount / Environment.PAGE_SIZE)}
                    onChange={(_, newPage) => setSearchParams({pagina: newPage.toString() }, { replace: true })}
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
