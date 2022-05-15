import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

import { BooksService } from '../../shared/services/api/books/BooksService';
import { CustomersService } from '../../shared/services/api/customers/CustomersService';
import { ReportsService } from '../../shared/services/api/reports/ReportsService';
import { ListsComponent } from '../../shared/components';
import { BaseLayout } from '../../shared/layouts';

export const Dashboard = () => {
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isLoadingBooksMetrics, setIsLoadingBooksMetrics] = useState(true);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [countBooks, setCountBooks] = useState(0);
  const [countBooksAvailable, setCountBooksAvailable] = useState(0);
  const [countBooksCheckedOut, setCountBooksCheckedOut] = useState(0);
  const [countBooksDelayed, setCountBooksDelayed] = useState(0);
  const [countCustomers, setCountCustomers] = useState(0);

  useEffect(() => {
    setIsLoadingBooks(true);
    setIsLoadingBooksMetrics(true);
    setIsLoadingCustomers(true);

    BooksService.getAll(1)
      .then((result) => {
        setIsLoadingBooks(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setCountBooks(result.count);
        }
      });
    CustomersService.getAll(1)
      .then((result) => {
        setIsLoadingCustomers(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setCountCustomers(result.count);
        }
      });
    ReportsService.getBooksMetrics()
      .then((result) => {
        setIsLoadingBooksMetrics(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setCountBooksAvailable(result.available);
          setCountBooksCheckedOut(result.checkedout);
          setCountBooksDelayed(result.delayed);
        }
      });
  }, []);

  return (
    <BaseLayout
      title='Home'
      toolbar={<ListsComponent showNewButton={false} />}
    >
      <Box width='100%' display='flex'>
        <Grid container margin={2}>
          <Grid item container spacing={2}>

            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant='h5' align='center' marginTop={3}>
                    Books
                  </Typography>

                  <Box padding={3} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingBooks && (
                      <Typography variant='h1'>
                        {countBooks}
                      </Typography>
                    )}
                    {isLoadingBooks && (
                      <Typography variant='h6'>
                        Loading...
                      </Typography>
                    )}
                  </Box>

                  <Grid item container>
                    <Grid item xs>
                      <Typography variant='subtitle1' align='center'>
                        Available
                      </Typography>

                      <Box padding={3} display='flex' justifyContent='center' alignItems='center'>
                        {!isLoadingBooksMetrics && (
                          <Typography variant='h3'>
                            {countBooksAvailable}
                          </Typography>
                        )}
                        {isLoadingBooksMetrics && (
                          <Typography variant='h6'>
                            Loading...
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs>
                      <Typography variant='subtitle1' align='center'>
                        Checked Out
                      </Typography>

                      <Box padding={3} display='flex' justifyContent='center' alignItems='center'>
                        {!isLoadingBooksMetrics && (
                          <Typography variant='h3'>
                            {countBooksCheckedOut}
                          </Typography>
                        )}
                        {isLoadingBooksMetrics && (
                          <Typography variant='h6'>
                            Loading...
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs>
                      <Typography variant='subtitle1' align='center'>
                        Delayed
                      </Typography>

                      <Box padding={3} display='flex' justifyContent='center' alignItems='center'>
                        {!isLoadingBooksMetrics && (
                          <Typography variant='h3'>
                            {countBooksDelayed}
                          </Typography>
                        )}
                        {isLoadingBooksMetrics && (
                          <Typography variant='h6'>
                            Loading...
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card style={{height:'100%'}}>
                <CardContent>
                  <Typography variant='h5' align='center' marginTop={3}>
                    Customers
                  </Typography>

                  <Box padding={3} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingCustomers && (
                      <Typography variant='h1'>
                        {countCustomers}
                      </Typography>
                    )}
                    {isLoadingCustomers && (
                      <Typography variant='h6'>
                        Loading...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Grid>
      </Box>
    </BaseLayout>
  );
};
