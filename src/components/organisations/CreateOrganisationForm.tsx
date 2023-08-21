import React from 'react';
import { useForm } from 'react-hook-form';
import { Stack, Grid, TextField, Button } from '@mui/material';

interface CreateOrganisationFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

interface FormData {
  name: string;
  description?: string;
}

const CreateOrganisationForm: React.FC<CreateOrganisationFormProps> = ({ onSubmit, onClose }) => {
  const {register, handleSubmit} = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <TextField
            {...register('name', { required: true })}
            id="name"
            variant="outlined"
            label="Organization Name"
            size="medium"
            fullWidth={true}
            InputLabelProps={{
              style: { paddingTop: '2px' },
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            {...register('description')}
            id="description"
            variant="outlined"
            label="Description"
            multiline
            size="medium"
            fullWidth={true}
          />
        </Grid>
        <Stack direction="row" justifyContent="left" spacing={2} marginTop='2em'>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Grid>
    </form>
  );
};

export default CreateOrganisationForm;
