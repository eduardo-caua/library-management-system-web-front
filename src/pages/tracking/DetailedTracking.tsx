import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { BooksService } from '../../shared/services/api/books/BooksService';
import { TrackingService } from '../../shared/services/api/tracking/TrackingService';
import { AutoCompleteCustomer } from './components/AutoCompleteCustomer';
import { VTextField, VSelectField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
import { DetailsComponent } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { BaseLayout } from '../../shared/layouts';

interface IFormData {
  customerId: number;
  dueDate?: Date;
  action: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  bookId: yup.number().required().min(1),
  customerId: yup.number().required().min(1),
  action: yup.string().required().min(8).max(9),
  dueDate: yup.mixed().optional(),
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
            setTitle(result.action);
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
            const isAvailable = result.status === Environment.AVAILABLE ? true : false;

            setTitle(isAvailable ? Environment.CHECK_OUT : Environment.CHECK_IN);

            formRef.current?.setData({
              bookId: bookId,
              customerId: '',
              dueDate: result.dueDate ? result.dueDate : new Date().toISOString().split('T')[0],
              action: isAvailable ? Environment.CHECK_OUT : Environment.CHECK_IN,
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
        console.log(errors);
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
          showSaveAndCloseButton
          showNewButton={false}
          showDeleteButton={false}

          onSaveButtonClick={save}
          onSaveAndCloseButtonClick={saveAndClose}
          onBackButtonClick={() => navigate(`/books/${bookId}/tracking`)}
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
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2} hidden={title === Environment.CHECK_IN ? true : false}>
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
                  options={[Environment.CHECK_IN,Environment.CHECK_OUT]}
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </VForm>
    </BaseLayout>
  );
};
