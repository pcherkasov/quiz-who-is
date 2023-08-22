import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import CreateGameForm from './CreateGameForm';
import {CreateGameRequest} from "../../types/apiTypes";

interface CreateGameDialogProps {
  orgId: number,
  seasonId: number,
  onSubmit: (orgId: number, seasonId:number, data: CreateGameRequest) => void;
  open: boolean;
  onClose: () => void;
}

const CreateGameDialog: React.FC<CreateGameDialogProps> = ({orgId, seasonId, onSubmit, open, onClose}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create new Game</DialogTitle>
      <DialogContent>
        <CreateGameForm orgId={orgId} seasonId={seasonId} onSubmit={onSubmit} onClose={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameDialog;
