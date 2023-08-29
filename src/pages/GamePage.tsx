import {useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "react-query";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DownloadIcon from '@mui/icons-material/Download';
import {createRound, deleteRound, downloadGameResultsAsExcel, getGame} from "../services/api";
import {CreateRoundRequest, GameResultsResponse} from "../types/apiTypes";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import React, {useState} from "react";
import CreateRoundDialog from "../components/rounds/CreateRoundDialog";

const GamePage: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    gameId,
    orgId,
    seasonId
  }
    = useParams<{
    gameId: string,
    orgId: string,
    seasonId: string
  }>();

  const [hoveredColumnIndex, setHoveredColumnIndex] = useState<number | null>(null);
  const [roundCreateOpen, setRoundCreateOpen] = useState(false);

  const {data: game, isLoading, isError}
    = useQuery<GameResultsResponse, Error>(
    ['game', orgId, seasonId, gameId],
    () => getGame(Number(orgId), Number(seasonId), Number(gameId))
  );

  const roundCreateMutation = useMutation(
    ({orgId, seasonId, gameId, data}: {
      seasonId: number,
      orgId: number,
      gameId: number,
      data: CreateRoundRequest
    }) => createRound(orgId, seasonId, gameId, data), {
      onSuccess: () => {
        queryClient.invalidateQueries(['game', orgId, seasonId, gameId]);
      },
    });

  const roundDeleteMutation = useMutation(
    ({orgId, seasonId, gameId, roundId}: {
      orgId: number,
      seasonId: number,
      gameId: number,
      roundId: number
    }) => deleteRound(orgId, seasonId, gameId, roundId), {
      onSuccess: () => {
        queryClient.invalidateQueries('game');
      }
    }
  );

  const handleCreateRound = async (orgId: number, seasonId: number, gameId: number, data: CreateRoundRequest) => {
    try {
      await roundCreateMutation.mutateAsync({orgId, seasonId, gameId, data});
      setRoundCreateOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRound = async (
    orgId: number,
    seasonId: number,
    gameId: number,
    roundId: number
  ) => {
    try {
      await roundDeleteMutation.mutateAsync({orgId, seasonId, gameId, roundId});
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (<div>Loading...</div>);
  }

  if (isError || !game) {
    return (<div>Error fetching game.</div>);

  }

  return (
    <div>
      {game.teams
        && game.teams.length > 0
        && game.teams[0].roundResults
        && Object.keys(game.teams[0].roundResults).length > 0
        && <Button
              startIcon={<DownloadIcon/>}
              variant="contained"
              color="primary"
              onClick={() => downloadGameResultsAsExcel(Number(orgId), Number(seasonId), Number(gameId))}
          >
              Export to Excel
          </Button>}
      <Typography variant="h2" gutterBottom>{game.name}</Typography>
      <Grid container spacing={0} direction="row">
        <Grid item xs={10}>
          <Typography variant="subtitle1" gutterBottom>{game.description}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            startIcon={<AddIcon/>}
            color="secondary"
            variant="contained"
            onClick={(event) => {
              event.stopPropagation();
              setRoundCreateOpen(true);
            }}
          >
            Add new Round
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Place</TableCell>
              <TableCell>Team Name</TableCell>
              {game.teams
                && game.teams.length > 0
                && Object
                  .values(game.teams[0].roundResults)
                  .map((round) => (
                    <TableCell
                      key={round.roundId}
                      onMouseEnter={() => setHoveredColumnIndex(round.roundId)}
                      onMouseLeave={() => setHoveredColumnIndex(null)}
                      sx={{
                        cursor: "pointer",
                        minWidth: '105px',
                        transition: "all 0.2s ease",
                        boxShadow: hoveredColumnIndex === round.roundId
                          ? "0px 0px 10px 1px rgba(0, 0, 0, 0.2)"
                          : undefined

                      }}
                    >
                      <Grid container spacing={0} direction="row" alignItems="center">
                        <Grid item xs={8}>
                          {round.roundName}
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            <EditIcon/>
                          </IconButton>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            color="error"
                            aria-label="upload picture"
                            component="span"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteRound(Number(orgId), Number(seasonId), Number(gameId), round.roundId);
                            }}
                          >
                            <DeleteForeverIcon/>
                          </IconButton>
                        </Grid>
                      </Grid>
                    </TableCell>
                  ))}
              <TableCell>Total Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {game.teams
              && game.teams.length > 0
              && game.teams.map((team) => (
                <TableRow
                  key={team.teamId}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    '&:hover': {
                      boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.2)",
                    }
                  }}
                >
                  <TableCell>{team.place}</TableCell>
                  <TableCell>{team.teamName}</TableCell>
                  {Object.values(team.roundResults).map((result) => (
                    <TableCell
                      key={result.roundId}
                      onMouseEnter={() => setHoveredColumnIndex(result.roundId)}
                      onMouseLeave={() => setHoveredColumnIndex(null)}
                      sx={{
                        borderStyle: "solid",
                        borderColor: "grey",
                        borderWidth: "1px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        backgroundColor: hoveredColumnIndex === result.roundId
                          ? "rgba(134,121,121,0.2)"
                          : undefined,
                        '&:hover': {
                          boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.2)",
                        }
                      }}
                    >
                      {result.roundPointsSum}</TableCell>
                  ))}
                  <TableCell>{team.gamePointsSum}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateRoundDialog
        orgId={Number(orgId)}
        seasonId={Number(seasonId)}
        gameId={Number(gameId)}
        onSubmit={handleCreateRound}
        open={roundCreateOpen}
        onClose={() => setRoundCreateOpen(false)}
      />
    </div>
  );
};

export default GamePage;
