import { useEffect, useMemo, useState } from 'react';
import { IconButton, Icon, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';

import { ITracking, TrackingService, } from '../../shared/services/api/tracking/TrackingService';
import { ListsComponent } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { BaseLayout } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';

export const TrackingList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookId } = useParams<'bookId'>();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<ITracking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
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

            setTitle(result.book.title);
            setStatus(result.book.status);
            setCount(result.count);
            setRows(result.rows);
          }
        });
    });
  }, [pagina]);

  return (
    <BaseLayout
      title={'Tracking for: '+title}
      toolbar={
        <ListsComponent
          mostrarInputBusca={false}
          textoBotaoNovo={status === Environment.AVAILABLE ? Environment.CHECK_OUT : Environment.CHECK_IN}
          aoClicarEmNovo={() => navigate(`/books/${bookId}/tracking/new`)}
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
                    page={pagina}
                    count={Math.ceil(count / Environment.PAGE_SIZE)}
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
