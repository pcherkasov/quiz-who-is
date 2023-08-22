import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import CreateSeasonForm from './CreateSeasonForm';
import { CreateSeasonRequest } from "../../types/apiTypes";

interface CreateSeasonDialogProps {
  orgId: number,
  onSubmit: (orgId: number, data: CreateSeasonRequest) => void;
  open: boolean;
  onClose: () => void;
}

const CreateSeasonDialog: React.FC<CreateSeasonDialogProps> = ({orgId, onSubmit, open, onClose}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create new Season</DialogTitle>
      <DialogContent>
        <CreateSeasonForm orgId={orgId} onSubmit={onSubmit} onClose={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSeasonDialog;
