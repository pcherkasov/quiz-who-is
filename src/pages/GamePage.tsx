import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getGame } from "../services/api";
import { GameResultsResponse } from "../types/apiTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from "@mui/material";

const GamePage: React.FC = () => {
  const { gameId, orgId, seasonId } = useParams<{ gameId: string, orgId: string, seasonId: string }>();
  const { data: game, isLoading, isError } = useQuery<GameResultsResponse, Error>(['game', orgId, seasonId, gameId], () => getGame(Number(orgId), Number(seasonId), Number(gameId)));

  if (isLoading) {
    return (<div>Loading...</div>);
  }

  if (isError || !game) {
    return (<div>Error fetching game.</div>);
  }

  return (
    <div>
      <Typography variant="h2" gutterBottom>{game.name}</Typography>
      <Typography variant="subtitle1" gutterBottom>{game.description}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Place</TableCell>
              <TableCell>Team Name</TableCell>
              {Object.values(game.teams[0].roundResults).map((round, index) => (
                <TableCell key={index}>{round.roundName}</TableCell>
              ))}
              <TableCell>Total Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {game.teams.map((team) => (
              <TableRow key={team.teamId}>
                <TableCell>{team.place}</TableCell>
                <TableCell>{team.teamName}</TableCell>
                {Object.values(team.roundResults).map((result) => (
                  <TableCell key={result.roundId}>{result.roundPointsSum}</TableCell>
                ))}
                <TableCell>{team.gamePointsSum}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GamePage;
