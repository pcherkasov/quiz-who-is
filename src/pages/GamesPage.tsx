import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "react-query";
import React, {useState} from 'react';
import {createGame, deleteGame, getGame, getGames, updateGame, updateGameStatus,} from "../services/api";
import {CreateGameRequest, GameResponse, UpdateGameInfoRequest, UpdateGameStatusRequest} from "../types/apiTypes";
import {
  Button, MenuItem,
  Paper, Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import CreateGameDialog from "../components/games/CreateGameDialog";
import UpdateGameDialog from "../components/games/UpdateGameDialog";

const GamesPage: React.FC = () => {
  const navigate = useNavigate();
  const {orgId} = useParams<{ orgId: string }>();
  const {seasonId} = useParams<{ seasonId: string }>();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameResponse | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [gameEditOpen, setGameEditOpen] = useState(false);
  const [gameCreateOpen, setGameCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const fetchGames = async () => {
    return getGames(currentPage, Number(orgId), Number(seasonId));
  }

  const {
    data: games,
    isLoading: gameLoading,
    isError: gameError
  } = useQuery(['games', currentPage, orgId, seasonId], fetchGames);

  const gameStatusMutation = useMutation(
    ({id, status}: UpdateGameStatusRequest) => updateGameStatus(Number(orgId), Number(seasonId), {id, status}),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["games", currentPage, orgId, seasonId]);
      },
    }
  );

  const gameCreateMutation = useMutation(
    ({seasonId, orgId, data}: {
      seasonId: number,
      orgId: number,
      data: CreateGameRequest
    }) => createGame(orgId, seasonId, data), {
      onSuccess: () => {
        queryClient.invalidateQueries('games');
      },
    });

  const gameUpdateMutation = useMutation(
    ({orgId, seasonId, data}: {
      seasonId: number,
      orgId: number,
      data: UpdateGameInfoRequest
    }) => updateGame(orgId, seasonId, data), {
      onSuccess: () => {
        queryClient.invalidateQueries('games');
      },
    });

  const gameDeleteMutation = useMutation(
    ({orgId, seasonId, gameId}: {
      orgId: number,
      seasonId: number,
      gameId: number
    }) => deleteGame(orgId, seasonId, gameId), {
      onSuccess: () => {
        setSelectedGameId(null);
        queryClient.invalidateQueries('games');
      },
    });

  const handlePrevPage = () => {
    setCurrentPage(old => Math.max(0, old - 1));
  };
  const handleNextPage = () => {
    if (games && games.totalPages - 1 > currentPage) {
      setCurrentPage(old => old + 1);
    }
  };

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>, orgId: number, seasonId: number, gameId: number, game: GameResponse) => {
    event.stopPropagation();
    setSelectedGameId(gameId);
    setSelectedGame(game);
    setSelectedSeasonId(seasonId);
    setSelectedOrgId(orgId);
    setGameEditOpen(true);
  };

  const handleCreate = async (orgId: number, seasonId: number, data: CreateGameRequest) => {
    try {
      await gameCreateMutation.mutateAsync({orgId, seasonId, data});
      setGameCreateOpen(false);
    } catch (error: any) {
      window.alert(error.response.data.message);
      console.error(error);
    }
  };
  const handleUpdate = async (orgId: number, seasonId: number, data: UpdateGameInfoRequest) => {
    try {
      await gameUpdateMutation.mutateAsync({orgId, seasonId, data});
      setGameEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>, orgId: number, seasonId: number, gameId: number) => {
    event.stopPropagation();
    try {
      await gameDeleteMutation.mutateAsync({orgId, seasonId, gameId});
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (gameId: number) => {
    navigate(`/organisations/${orgId}/seasons/${seasonId}/games/${gameId}`);
  };

  return (
    <div>
      <Typography variant="h2" gutterBottom>Games</Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setGameCreateOpen(true)}
        sx={{marginTop: '2em', marginBottom: '3em'}}
      >
        Add Game
      </Button>
      <TableContainer component={Paper} sx={{maxWidth: 1200}}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{backgroundColor: 'rgba(183,183,183,0.29)', fontWeight: 'bold'}}>Game Name</TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Teams Quantity</TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Start Date</TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Finish Date</TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Status</TableCell>
              <TableCell style={{backgroundColor: '#f2f2f2', fontWeight: 'bold'}}>Description</TableCell>
              <TableCell
                align='center'
                colSpan={2}
                style={{
                  backgroundColor: '#f2f2f2',
                  fontWeight: 'bold',
                  borderLeftColor: 'gray',
                  borderLeftStyle: 'solid'
                }}>Admin Area</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              games?.content.map((game: GameResponse) => (
                <TableRow key={game.id}
                          sx={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            '&:hover': {
                              boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.2)",
                            }
                          }}
                          onClick={() => handleClick(game.id)}
                >
                  <TableCell>{game.name}</TableCell>
                  <TableCell>{game.teams.length}</TableCell>
                  <TableCell>{game.startedAt ? game.startedAt : 'Not Started'}</TableCell>
                  <TableCell>{game.finishedAt ? game.finishedAt : 'Not Finished'}</TableCell>
                  <TableCell>
                    <Select
                      value={game.status}
                      onChange={(event) => {
                        event.stopPropagation();
                        const status = event.target.value as string;
                        gameStatusMutation.mutate({id: game.id, status})
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <MenuItem value={"PENDING"}>Pending</MenuItem>
                      <MenuItem value={"STARTED"}>Started</MenuItem>
                      <MenuItem value={"FINISHED"}>Finished</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>{game.description}</TableCell>
                  <TableCell sx={{borderLeftColor: 'gray', borderLeftStyle: 'solid'}}>
                    <Button variant="contained" color="info"
                            onClick={(event) => handleEdit(event, Number(orgId), Number(seasonId), game.id, game)}>Edit</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="error"
                            onClick={(event) => handleDelete(event, Number(orgId), Number(seasonId), game.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="left" spacing={2} marginTop='2em'>
        {!games?.first && <Button onClick={handlePrevPage}>Previous page</Button>}
        {!games?.last && <Button onClick={handleNextPage}>Next page</Button>}
      </Stack>
      <CreateGameDialog
        orgId={Number(orgId)}
        seasonId={Number(seasonId)}
        onSubmit={handleCreate}
        open={gameCreateOpen}
        onClose={() => setGameCreateOpen(false)}
      />
      <UpdateGameDialog
        orgId={Number(orgId)}
        seasonId={Number(seasonId)}
        game={selectedGame!}
        onUpdate={handleUpdate}
        open={gameEditOpen}
        onClose={() => setGameEditOpen(false)}
      />
    </div>
  );
};

export default GamesPage;
