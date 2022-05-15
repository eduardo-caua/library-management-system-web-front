import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { CustomersService } from '../../shared/services/api/customers/CustomersService';
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
import { DetailsComponent } from '../../shared/components';
import { BaseLayout } from '../../shared/layouts';

interface IFormData {
  name: string;
  email: string;
  phone: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  name: yup.string().required().min(3),
  email: yup.string().email().required(),
  phone: yup.string().required().min(3),
});

export const DetailedCustomer: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = 'new' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (id !== 'new') {
      setIsLoading(true);

      CustomersService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/customers');
          } else {
            setName(result.name);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        email: '',
        name: '',
        phone: '',
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {

    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'new') {
          CustomersService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/customers');
                } else {
                  navigate(`/customers/${result}`);
                }
              }
            });
        } else {
          CustomersService
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/customers');
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
      CustomersService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Customer successfully deleted!');
            navigate('/customers');
          }
        });
    }
  };


  return (
    <BaseLayout
      title={id === 'new' ? 'New customer' : name}
      toolbar={
        <DetailsComponent
          newButtonLabel='New'
          showSaveAndCloseButton
          showNewButton={false}
          showDeleteButton={id !== 'new'}

          onSaveButtonClick={save}
          onSaveAndCloseButtonClick={saveAndClose}
          onBackButtonClick={() => navigate('/customers')}
          onDeleteButtonClick={() => handleDelete(Number(id))}
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
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='name'
                  disabled={isLoading}
                  label='Name'
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='email'
                  label='Email'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='phone'
                  label='Phone'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </VForm>
    </BaseLayout>
  );
};
