import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

import { BooksService } from '../../shared/services/api/books/BooksService';
import { CustomersService } from '../../shared/services/api/customers/CustomersService';
import { ListsComponent } from '../../shared/components';
import { BaseLayout } from '../../shared/layouts';
import { height } from '@mui/system';

export const Dashboard = () => {
  const [isLoadingCidades, setIsLoadingCidades] = useState(true);
  const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
  const [countCidades, setCountCidades] = useState(0);
  const [countPessoas, setCountPessoas] = useState(0);

  useEffect(() => {
    setIsLoadingCidades(true);
    setIsLoadingPessoas(true);

    BooksService.getAll(1)
      .then((result) => {
        setIsLoadingCidades(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setCountCidades(result.count);
        }
      });
    CustomersService.getAll(1)
      .then((result) => {
        setIsLoadingPessoas(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setCountPessoas(result.count);
        }
      });
  }, []);

  return (
    <BaseLayout
      title='Home'
      toolbar={<ListsComponent mostrarBotaoNovo={false} />}
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
                    {!isLoadingCidades && (
                      <Typography variant='h1'>
                        {countCidades}
                      </Typography>
                    )}
                    {isLoadingCidades && (
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
                        {!isLoadingCidades && (
                          <Typography variant='h3'>
                            {countCidades}
                          </Typography>
                        )}
                        {isLoadingCidades && (
                          <Typography variant='h6'>
                            Loading...
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs>
                      <Typography variant='subtitle1' align='center'>
                        Checked out
                      </Typography>

                      <Box padding={3} display='flex' justifyContent='center' alignItems='center'>
                        {!isLoadingCidades && (
                          <Typography variant='h3'>
                            {countCidades}
                          </Typography>
                        )}
                        {isLoadingCidades && (
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
                        {!isLoadingCidades && (
                          <Typography variant='h3'>
                            {countCidades}
                          </Typography>
                        )}
                        {isLoadingCidades && (
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
                    {!isLoadingPessoas && (
                      <Typography variant='h1'>
                        {countPessoas}
                      </Typography>
                    )}
                    {isLoadingPessoas && (
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
