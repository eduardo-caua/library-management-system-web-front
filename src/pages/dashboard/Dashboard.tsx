import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

import { BooksService } from '../../shared/services/api/books/BooksService';
import { CustomersService } from '../../shared/services/api/customers/CustomersService';
import { ListsComponent } from '../../shared/components';
import { BaseLayout } from '../../shared/layouts';


export const Dashboard = () => {
  const [isLoadingCidades, setIsLoadingCidades] = useState(true);
  const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
  const [totalCountCidades, setTotalCountCidades] = useState(0);
  const [totalCountPessoas, setTotalCountPessoas] = useState(0);

  useEffect(() => {
    setIsLoadingCidades(true);
    setIsLoadingPessoas(true);

    BooksService.getAll(1)
      .then((result) => {
        setIsLoadingCidades(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountCidades(result.totalCount);
        }
      });
    CustomersService.getAll(1)
      .then((result) => {
        setIsLoadingPessoas(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountPessoas(result.totalCount);
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
                  <Typography variant='h5' align='center'>
                    Customers
                  </Typography>

                  <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingPessoas && (
                      <Typography variant='h1'>
                        {totalCountPessoas}
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
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>

              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Books
                  </Typography>

                  <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingCidades && (
                      <Typography variant='h1'>
                        {totalCountCidades}
                      </Typography>
                    )}
                    {isLoadingCidades && (
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
