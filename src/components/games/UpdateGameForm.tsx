import React, {useEffect, useState} from "react";
import {GameResponse, TeamResponse} from "../../types/apiTypes";
import {Autocomplete, Button, Grid, Stack, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import {getTeams} from "../../services/api";

interface UpdateGameInfoFormProps {
  orgId: number;
  seasonId: number;
  onSubmit: (orgId: number, seasonId: number, date: any) => void;
  game: GameResponse;
  onClose: () => void;
}

interface FormData {
  id: number;
  name: string;
  description?: string;
  teamIds: number[];
}

const UpdateGameForm: React.FC<UpdateGameInfoFormProps> = ({
                                                             orgId,
                                                             seasonId,
                                                             onSubmit,
                                                             game,
                                                             onClose
                                                           }) => {
  const {register, handleSubmit, setValue} = useForm<FormData>({defaultValues: game});
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const handleTeamsChange = (_: any, value: any[]) => {
    setValue('teamIds', value.map(team => team.id));
  };

  useEffect(() => {
    getTeams(0, 1000, orgId)
      .then(data => setTeams(data.content))
      .catch(error => console.error(error));
  }, [orgId]);

  useEffect(() => {
    setValue('id', game.id);
    setValue('name', game.name);
    setValue('description', game.description);
    setValue('teamIds', game.teams.map(team => team.id));
  }, [game, setValue]);

  return (
    <form onSubmit={handleSubmit(data => onSubmit(orgId, seasonId, data))}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <TextField {...register('id')} type="hidden" />
          <TextField
            {...register('name', {required: true})}
            id="name"
            variant="outlined"
            label="Game Name"
            size="medium"
            fullWidth={true}
            InputLabelProps={{
              style: {paddingTop: '2px'},
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
          <Autocomplete
            multiple
            id="teams"
            options={teams}
            defaultValue={game.teams}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleTeamsChange}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Teams" placeholder="Teams"/>
            )}
          />
        </Grid>
        <Grid item>
        <Stack direction="row" justifyContent="left" spacing={2} marginTop='2em'>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
        </Grid>
      </Grid>
    </form>
  );
};
export default UpdateGameForm;
