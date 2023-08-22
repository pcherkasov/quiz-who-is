import React from 'react';
import {Dialog, DialogContent, DialogTitle, Grid} from '@mui/material';
import UpdateGameForm from './UpdateGameForm';
import {GameResponse, UpdateGameInfoRequest} from "../../types/apiTypes";

interface UpdateGameDialogProps {
  orgId: number,
  seasonId: number,
  game: GameResponse,
  onUpdate: (orgId: number, seasonId: number, data: UpdateGameInfoRequest) => void;
  open: boolean;
  onClose: () => void;
}

const UpdateGameDialog: React.FC<UpdateGameDialogProps> = ({
                                                             orgId,
                                                             seasonId,
                                                             game,
                                                             onUpdate, open,
                                                             onClose
                                                           }) => {
  const handleUpdate = (
    orgId: number,
    seasonId: number,
    data: UpdateGameInfoRequest
  ) => {
    onUpdate(orgId, seasonId, data);
    onClose();
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Dialog open={open} onClose={onClose}>
        <Grid item>
        <DialogTitle>Edit Game</DialogTitle>
        </Grid>
        <Grid item>
        <DialogContent>
          <UpdateGameForm
            orgId={orgId}
            seasonId={seasonId}
            game={game}
            onSubmit={handleUpdate}
            onClose={onClose}/>
        </DialogContent>
        </Grid>
      </Dialog>
    </Grid>
  );
};

export default UpdateGameDialog;
