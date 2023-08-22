import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import CreateOrganisationForm from './CreateOrganisationForm';
import { CreateOrganisationRequest } from '../../types/apiTypes';

interface CreateOrganisationDialogProps {
  onSubmit: (data: CreateOrganisationRequest) => void;
  open: boolean;
  onClose: () => void;
}

const CreateOrganisationDialog: React.FC<CreateOrganisationDialogProps> = ({ onSubmit, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Organisation</DialogTitle>
      <DialogContent>
        <CreateOrganisationForm onSubmit={onSubmit} onClose={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganisationDialog;
