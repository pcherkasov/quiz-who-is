import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import CreateRoundForm from './CreateRoundForm';
import {CreateRoundRequest} from "../../types/apiTypes";
import React from "react";

interface CreateRoundDialogProps {
  orgId: number,
  seasonId: number,
  gameId: number,
  onSubmit: (orgId: number, seasonId:number, gameId: number, data: CreateRoundRequest) => void;
  open: boolean;
  onClose: () => void;
}

const CreateRoundDialog: React.FC<CreateRoundDialogProps> = ({orgId, seasonId, gameId, onSubmit, open, onClose}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create new Round</DialogTitle>
      <DialogContent>
        <CreateRoundForm
          orgId={orgId}
          seasonId={seasonId}
          gameId={gameId}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoundDialog;
