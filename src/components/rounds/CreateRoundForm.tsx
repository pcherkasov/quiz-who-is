import {TextField, Button, Grid, Select, MenuItem} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { CreateRoundRequest } from '../../types/apiTypes';
import React, {useState} from "react";

interface CreateRoundFormProps {
  orgId: number;
  seasonId: number;
  gameId: number;
  onSubmit: (orgId: number, seasonId: number, gameId: number, data: CreateRoundRequest) => void;
  onClose: () => void;
}

const CreateRoundForm: React.FC<CreateRoundFormProps> = ({ orgId, seasonId, gameId, onSubmit, onClose }) => {
  const { register, handleSubmit, setValue, getValues} = useForm<CreateRoundRequest>();
  const [questionsNumber, setQuestionsNumber] = useState<number>(0);
  const [type, setType] = useState<string>("CLASSIC");
  const changeQuestionNumber = (newNumber: number) => {
    setQuestionsNumber(newNumber);
    setValue('questionsNumber', newNumber);
  }

  const changeRoundType = (newType: string) => {
    setType(newType);
    setValue('type', newType);
  }

  return (
    <form onSubmit={handleSubmit(data => onSubmit(orgId, seasonId, gameId, data))}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <TextField
            {...register('name', { required: true })}
            variant="outlined"
            label="Round Name"
            size="medium"
            fullWidth={true}
          />
        </Grid>
        <Grid item>
          <TextField
            {...register('description')}
            variant="outlined"
            label="Description"
            multiline
            size="medium"
            fullWidth={true}
          />
        </Grid>
        <Grid item>
          <Select
            fullWidth={true}
            value={type}
            onChange={(event) => {
              event.stopPropagation();
              const newType = event.target.value as string;
              changeRoundType(newType);
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <MenuItem value={"CLASSIC"}>Classic</MenuItem>
            <MenuItem value={"BLITZ"}>Blitz</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <TextField
            {...register('questionsNumber', { required: true })}
            variant="outlined"
            label="Questions Number"
            type="number"
            size="medium"
            fullWidth={true}
            defaultValue={questionsNumber}
            onChange={event => changeQuestionNumber(Number(event.target.value))}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateRoundForm;
