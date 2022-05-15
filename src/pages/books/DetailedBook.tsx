import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { BooksService } from '../../shared/services/api/books/BooksService';
import { VTextField, VSelectField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
import { DetailsComponent } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { BaseLayout } from '../../shared/layouts';

interface IFormData {
  title: string;
  author: string;
  isbn: string;
  description: string;
  status: string;
  dueDate?: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  title: yup.string().required().min(3),
  author: yup.string().required().min(3),
  isbn: yup.string().required().min(3),
  description: yup.string().required().min(3),
  status: yup.string().required().min(9).max(11),
  dueDate: yup.string().optional(),
});

export const DetailedBook: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = 'new' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (id !== 'new') {
      setIsLoading(true);

      BooksService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/books');
          } else {
            setTitle(result.title);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        status: '',
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'new') {
          BooksService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/books');
                } else {
                  navigate(`/books/${result}`);
                }
              }
            });
        } else {
          BooksService
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/books');
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

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to proceed?')) {
      BooksService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Book successfully deleted!');
            navigate('/books');
          }
        });
    }
  };

  return (
    <BaseLayout
      title={id === 'new' ? 'New book' : title}
      toolbar={
        <DetailsComponent
          newButtonLabel='New'
          showSaveAndCloseButton
          showNewButton={id !== 'new'}
          showDeleteButton={id !== 'new'}

          onSaveButtonClick={save}
          onSaveAndCloseButtonClick={saveAndClose}
          onBackButtonClick={() => navigate('/books')}
          onDeleteButtonClick={() => handleDelete(Number(id))}
          onNewButtonClick={() => navigate('/books/new')}
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
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='title'
                  label='Title'
                  disabled={isLoading}
                  onChange={e => setTitle(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='author'
                  label='Author'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='isbn'
                  label='ISBN'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='description'
                  label='Description'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VSelectField
                  name='status'
                  label='Status'
                  id='status-select'
                  disabled={isLoading}
                  options={[Environment.AVAILABLE,Environment.CHECKED_OUT]}
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </VForm>
    </BaseLayout>
  );
};
