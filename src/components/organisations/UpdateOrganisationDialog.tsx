import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import UpdateOrganisationForm from './UpdateOrganisationForm';
import {OrganisationInfoResponse, UpdateOrganisationRequest} from '../../types/apiTypes';

interface UpdateOrganisationDialogProps {
  organisation: OrganisationInfoResponse;
  onUpdate: (data: UpdateOrganisationRequest) => void;
  open: boolean;
  onClose: () => void;
}

const UpdateOrganisationDialog: React.FC<UpdateOrganisationDialogProps> = ({organisation, onUpdate, open, onClose}) => {
  const handleUpdate = (data: UpdateOrganisationRequest) => {
    onUpdate(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Organisation</DialogTitle>
      <DialogContent>
        <UpdateOrganisationForm onSubmit={handleUpdate}
                                organisation={organisation}
                                onClose={onClose}
        />
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateOrganisationDialog;
