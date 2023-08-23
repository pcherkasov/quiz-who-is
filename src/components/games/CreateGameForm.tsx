import React, {useEffect, useState} from 'react';
import {Controller, useForm} from "react-hook-form";
import { Button, Chip, Grid, Stack, TextField} from "@mui/material";
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
  const {register, handleSubmit, control} = useForm<FormData>();
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  useEffect(() => {
    getTeams(0, 1000, orgId)
      .then(data => setTeams(data.content))
      .catch(error => console.error(error));
  }, [orgId]);

  const handleTeamClick = (teamId: number) => {
    if (!selectedTeams.includes(teamId)) {
      setSelectedTeams([...selectedTeams, teamId]);
    } else {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
    }
  };
  return (
    <form onSubmit={handleSubmit(data => {
      data.teamIds = selectedTeams;
      onSubmit(orgId, seasonId, data);
    })}>
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
          {teams.map(team => (
            <Chip
              label={team.name}
              clickable
              color={selectedTeams.includes(team.id) ? "primary" : "default"}
              onClick={() => handleTeamClick(team.id)}
              style={{ margin: 4 }}
            />
          ))}
        </Grid>
        <Controller
          control={control}
          name="teamIds"
          defaultValue={selectedTeams}
          render={({ field }) => <></>}
        />
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
