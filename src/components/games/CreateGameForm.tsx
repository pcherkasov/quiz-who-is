import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {Autocomplete, Button, Grid, Stack, TextField} from "@mui/material";
import {TeamResponse} from "../../types/apiTypes";
import {getTeams} from "../../services/api";

interface CreateGameFormProps {
  orgId: number;
  seasonId: number;
  onSubmit: (orgId: number, seasonId: number, data: any) => void;
  onClose: () => void;
}

interface FormData {
  name: string;
  description?: string;
  roundsNumber: number;
  teamIds: number[];
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({orgId, seasonId, onSubmit, onClose}) => {
  const {register, handleSubmit, setValue} = useForm<FormData>();
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  useEffect(() => {
    getTeams(0, 1000, orgId) // Получаем команды, здесь 1 - это номер страницы, если у вас больше команд, вам понадобится нечто более сложное для пагинации
      .then(data => setTeams(data.content)) // сохраняем полученные команды в состоянии
      .catch(error => console.error(error)); // обрабатываем возможные ошибки
  }, [orgId]);
  const handleTeamsChange = (_: any, value: any[]) => {
    setValue('teamIds', value.map(team => team.id)); // сохраняем ID выбранных команд в "teamIds"
  };
  return (
    <form onSubmit={handleSubmit(data => onSubmit(orgId, seasonId, data))}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <TextField
            {...register('name', { required: true })}
            id="name"
            variant="outlined"
            label="Game Name"
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
        <Grid item>
          <TextField
            {...register('roundsNumber')}
            id="roundsNumber"
            variant="outlined"
            label="Rounds Number"
            multiline
            size="medium"
            fullWidth={true}
          />
        </Grid>
        <Grid item>
          <Autocomplete
            multiple
            id="teams"
            options={teams}
            getOptionLabel={(option) => option.name}
            onChange={handleTeamsChange}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Teams" placeholder="Teams"/>
            )}
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
export default CreateGameForm;
