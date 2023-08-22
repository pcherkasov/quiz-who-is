import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {CreateTeamRequest, TeamResponse, UpdateTeamRequest} from "../types/apiTypes";
import {createTeam, deleteTeam, getTeam, getTeams, updateTeam} from "../services/api";
import React, {useState} from 'react';
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import CreateTeamDialog from "../components/teams/CreateTeamDialog";
import UpdateTeamDialog from "../components/teams/UpdateTeamDialog";

const TeamsPage: React.FC = () => {
  const {orgId} = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [teamEditOpen, setTeamEditOpen] = useState(false);
  const [teamCreateOpen, setTeamCreateOpen] = useState(false);

  const queryClient = useQueryClient();
  const fetchTeams = async () => {
    return getTeams(currentPage, 7, Number(orgId));
  }

  const {
    data: teams,
    isLoading: teamLoading,
    isError: teamError
  } = useQuery(['teams', currentPage, orgId], fetchTeams);

  const {
    data: selectedTeam,
    isLoading: selectedTeamLoading,
    isError: selectedTeamError
  } = useQuery(['team', selectedTeamId, orgId], () => getTeam(Number(orgId), Number(selectedTeamId)),{
    enabled: !!selectedTeamId,
  });
  const handlePrevPage = () => {
    setCurrentPage(old => Math.max(0, old - 1));
  };
  const handleNextPage = () => {
    if (teams && teams.totalPages - 1 > currentPage) {
      setCurrentPage(old => old + 1);

    }
  };
  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>, orgId: number, teamId: number) => {
    event.stopPropagation();
    setSelectedTeamId(teamId);
    setSelectedOrgId(orgId);

    setTeamEditOpen(true);

  };

  const teamCreateMutation = useMutation(
    ({orgId, data}: {
      orgId: number,
      data: CreateTeamRequest
    }) => createTeam(orgId, data), {
      onSuccess: () => {
        queryClient.invalidateQueries('teams');
      },
    });

  const teamUpdateMutation = useMutation(
    ({orgId, data}: {
      orgId: number,
      data: UpdateTeamRequest
    }) => updateTeam(orgId, data), {
      onSuccess: () => {
        queryClient.invalidateQueries('teams');
      },
    });

  const teamDeleteMutation = useMutation(
    ({orgId, teamId}: {
      orgId: number,
      teamId: number
    }) => deleteTeam(orgId, teamId), {
      onSuccess: () => {
        setSelectedTeamId(null);
        queryClient.invalidateQueries('teams');
      },
    });
  const handleCreate = async (orgId: number, data: CreateTeamRequest) => {
    try {
      await teamCreateMutation.mutateAsync({orgId, data});
      setTeamCreateOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdate = async (orgId: number, data: UpdateTeamRequest) => {
    try {
      await teamUpdateMutation.mutateAsync({orgId, data});
      setTeamEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>, orgId: number, teamId: number) => {
    event.stopPropagation();
    try {
      await teamDeleteMutation.mutateAsync({orgId, teamId});
    } catch (error) {
      console.error(error);
    }

  };
  const handleClick = (teamId: number) => {
    navigate(`/organisations/${orgId}/teams/${teamId}`);
  };

  if (teamLoading || selectedTeamLoading) {
    return <div>Loading...</div>;
  }

  if (teamError || selectedTeamError) {
    return <div>Error occurred</div>;
  }

  return (
    <div>
      <Typography variant="h2" gutterBottom>Teams</Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setTeamCreateOpen(true)}
        sx={{marginTop: '2em', marginBottom: '3em'}}
      >
        Add Team
      </Button>
      <TableContainer component={Paper} sx={{maxWidth: 1200}}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{backgroundColor: 'rgba(183,183,183,0.29)', fontWeight: 'bold'}}>Name</TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Description</TableCell>
              <TableCell style={{
                backgroundColor: '#f2f2f2',
                fontWeight: 'bold',
                borderLeftColor: 'gray',
                borderLeftStyle: 'solid'
              }}></TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Admin Area</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              teams?.content.map((team: TeamResponse) => (
                <TableRow key={team.id}
                          sx={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            '&:hover': {
                              boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.2)",
                            }
                          }}
                          onClick={() => handleClick(team.id)}
                >
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.description}</TableCell>
                  <TableCell sx={{borderLeftColor: 'gray', borderLeftStyle: 'solid'}}>
                    <Button variant="contained" color="info"
                            onClick={(event) => handleEdit(event, Number(orgId), team.id)}>Edit</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="error"
                            onClick={(event) => handleDelete(event, Number(orgId), team.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="left" spacing={2} marginTop='2em'>
        {!teams?.first && <Button onClick={handlePrevPage}>Previous page</Button>}
        {!teams?.last && <Button onClick={handleNextPage}>Next page</Button>}
      </Stack>
      <CreateTeamDialog
        orgId={Number(orgId)}
        onSubmit={handleCreate}
        open={teamCreateOpen}
        onClose={() => setTeamCreateOpen(false)}
      />
      <UpdateTeamDialog
        orgId={Number(orgId)}
        team={selectedTeam!}
        onUpdate={handleUpdate}
        open={teamEditOpen}
        onClose={() => setTeamEditOpen(false)}
      />
    </div>
  );
};

export default TeamsPage;
