import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import CreateTeamForm from './CreateTeamForm';
import { CreateTeamRequest } from "../../types/apiTypes";

interface CreateTeamDialogProps {
  orgId: number,
  onSubmit: (orgId: number, data: CreateTeamRequest) => void;
  open: boolean;
  onClose: () => void;
}

const CreateTeamDialog: React.FC<CreateTeamDialogProps> = ({orgId, onSubmit, open, onClose}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create new Team</DialogTitle>
      <DialogContent>
        <CreateTeamForm orgId={orgId} onSubmit={onSubmit} onClose={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;
