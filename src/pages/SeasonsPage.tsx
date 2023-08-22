import {useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {CreateSeasonRequest, SeasonInfoResponse, UpdateSeasonRequest} from "../types/apiTypes";
import {createSeason, deleteSeason, getSeason, getSeasons, updateSeason} from "../services/api";
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
import CreateSeasonDialog from "../components/seasons/CreateSeasonDialog";
import UpdateSeasonDialog from "../components/seasons/UpdateSeasonDialog";

const SeasonsPage: React.FC = () => {
  const {orgId} = useParams<{ orgId: string }>();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [seasonEditOpen, setSeasonEditOpen] = useState(false);
  const [seasonCreateOpen, setSeasonCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const fetchSeasons = async () => {
    return getSeasons(currentPage, Number(orgId));
  }

  const {
    data: seasons,
    isLoading: seasonLoading,
    isError: seasonError
  } = useQuery(['seasons', currentPage, orgId], fetchSeasons);

  const {
    data: selectedSeason,
    isLoading: selectedSeasonLoading,
    isError: selectedSeasonError
  } = useQuery(['season', selectedSeasonId, orgId], () => getSeason(Number(orgId), Number(selectedSeasonId)),{
    enabled: !!selectedSeasonId,
  });

  const handlePrevPage = () => {
    setCurrentPage(old => Math.max(0, old - 1));
  };
  const handleNextPage = () => {
    if (seasons && seasons.totalPages - 1 > currentPage) {
      setCurrentPage(old => old + 1);
    }

  };
  const handleEdit = (orgId: number, seasonId: number) => {
    setSelectedSeasonId(seasonId);
    setSelectedOrgId(orgId);
    setSeasonEditOpen(true);

  };

  const seasonCreateMutation = useMutation(
    ({orgId, data}: {
      orgId: number,
      data: CreateSeasonRequest
    }) => createSeason(orgId, data), {
      onSuccess: () => {
        queryClient.invalidateQueries('seasons');
      },
    });

  const seasonUpdateMutation = useMutation(
    ({orgId, data}: {
      orgId: number,
      data: UpdateSeasonRequest
    }) => updateSeason(orgId, data), {
      onSuccess: () => {
        queryClient.invalidateQueries('seasons');
      },
    });

  const seasonDeleteMutation = useMutation(
    ({orgId, seasonId}: {
      orgId: number,
      seasonId: number
    }) => deleteSeason(orgId, seasonId), {
      onSuccess: () => {
        setSelectedSeasonId(null);
        queryClient.invalidateQueries('seasons');
      },
    });
  const handleCreate = async (orgId: number, data: CreateSeasonRequest) => {
    try {
      await seasonCreateMutation.mutateAsync({orgId, data});
      setSeasonCreateOpen(false);
    } catch (error) {
      console.error(error);
    }

  };
  const handleUpdate = async (orgId: number, data: UpdateSeasonRequest) => {
    try {
      await seasonUpdateMutation.mutateAsync({orgId, data});
      setSeasonEditOpen(false);
    } catch (error) {
      console.error(error);
    }

  };
  const handleDelete = async (orgId: number, seasonId: number) => {
    try {
      await seasonDeleteMutation.mutateAsync({orgId, seasonId});
    } catch (error) {
      console.error(error);
    }

  };

  if (seasonLoading || selectedSeasonLoading) {
    return <div>Loading...</div>;
  }

  if (seasonError || selectedSeasonError) {
    return <div>Error occurred</div>;
  }

  return (
    <div>
      <Typography variant="h2" gutterBottom>Seasons</Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setSeasonCreateOpen(true)}
        sx={{marginTop: '2em', marginBottom: '3em'}}
      >
        Add Season
      </Button>
      <TableContainer component={Paper} sx={{maxWidth: 1200}}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{backgroundColor: 'rgba(183,183,183,0.29)', fontWeight: 'bold'}}>Name</TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Description</TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Teams Quantity</TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Status</TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Started At</TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Finished At</TableCell>
              <TableCell style={{
                backgroundColor: '#f2f2f2',
                fontWeight: 'bold',
                borderLeftColor: 'gray',
                borderLeftStyle: 'solid'
              }}></TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              seasons?.content.map((season: SeasonInfoResponse) => (
                <TableRow key={season.id}
                          sx={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            '&:hover': {
                              boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.2)",
                            }
                          }}
                >
                  <TableCell>{season.name}</TableCell>
                  <TableCell>{season.description}</TableCell>
                  <TableCell>{season.teamsQuantity}</TableCell>
                  <TableCell>{season.status}</TableCell>
                  <TableCell>{season.startedAt ? season.startedAt : 'Not Started'}</TableCell>
                  <TableCell>{season.finishedAt ? season.finishedAt : "Not Finished"}</TableCell>
                  <TableCell sx={{borderLeftColor: 'gray', borderLeftStyle: 'solid'}}>
                    <Button variant="contained" color="info"
                            onClick={() => handleEdit(Number(orgId), season.id)}>Edit</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="error"
                            onClick={() => handleDelete(Number(orgId), season.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="left" spacing={2} marginTop='2em'>
        {!seasons?.first && <Button onClick={handlePrevPage}>Previous page</Button>}
        {!seasons?.last && <Button onClick={handleNextPage}>Next page</Button>}
      </Stack>
      <CreateSeasonDialog
        orgId={Number(orgId)}
        onSubmit={handleCreate}
        open={seasonCreateOpen}
        onClose={() => setSeasonCreateOpen(false)}
      />
      <UpdateSeasonDialog
        orgId={Number(orgId)}
        season={selectedSeason!}
        onUpdate={handleUpdate}
        open={seasonEditOpen}
        onClose={() => setSeasonEditOpen(false)}
      />
    </div>
  );
};

export default SeasonsPage;
