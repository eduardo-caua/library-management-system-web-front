import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { BooksService } from '../../shared/services/api/books/BooksService';
import { TrackingService } from '../../shared/services/api/tracking/TrackingService';
import { AutoCompleteCustomer } from './components/AutoCompleteCustomer';
import { VTextField, VSelectField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
import { DetailsComponent } from '../../shared/components';
import { BaseLayout } from '../../shared/layouts';
import { minHeight } from '@mui/system';

interface IFormData {
  customerId: number;
  dueDate?: Date;
  action: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  bookId: yup.number().required().min(1),
  customerId: yup.number().required().min(1),
  action: yup.string().required().min(2).max(3),
  dueDate: yup.date().optional(),
});

export const DetailedTracking: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { bookId } = useParams<'bookId'>();
  const { id = 'new' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setIsLoading(true);

    if (id !== 'new') {
      TrackingService
        .getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate(`/books/${bookId}/tracking`);
          } else {
            setTitle(result.action === 'OUT' ? 'Check Out' : 'Return');
            result.dueDate = result.book?.dueDate;
            formRef.current?.setData(result);
          }
        });
    } else {
      BooksService
        .getById(Number(bookId))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate(`/books/${bookId}/tracking`);
          } else {
            setTitle(result.status === 'IN' ? 'Check Out' : 'Return');

            formRef.current?.setData({
              bookId: bookId,
              customerId: '',
              dueDate: result.dueDate ? result.dueDate : new Date().toISOString().split('T')[0],
              action: result.status === 'IN' ? 'OUT' : 'IN',
            });
          }
        });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id == 'new') {
          TrackingService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate(`/books/${bookId}/tracking`);
                } else {
                  navigate(`/books/${bookId}/tracking/${result}`);
                }
              }
            });
        } else {
          TrackingService
            .updateById({ id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate(`/books/${bookId}/tracking`);
                }
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};
        errors.inner.forEach(error => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      });
  };

  return (
    <BaseLayout
      title={title}
      toolbar={
        <DetailsComponent
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={false}
          mostrarBotaoApagar={false}

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate(`/books/${bookId}/tracking`)}
          aoClicarEmNovo={() => navigate(`/books/${bookId}/tracking/new`)}
        />
      }
    >
      <VForm ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">

          <Grid container direction="column" padding={2} spacing={2}>

            {isLoading && (
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>
            )}

            <Grid item>
              <Typography variant='h6'>Geral</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2} hidden>
                <VTextField
                  fullWidth
                  name='bookId'
                  label='BookId'
                  disabled={true}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2} hidden={title === 'Return' ? true : false}>
                <VTextField
                  fullWidth
                  name='dueDate'
                  label='Due Date'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <AutoCompleteCustomer isExternalLoading={isLoading} />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VSelectField
                  name='action'
                  label='Action'
                  id='action-select'
                  disabled={true}
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </VForm>
    </BaseLayout>
  );
};
