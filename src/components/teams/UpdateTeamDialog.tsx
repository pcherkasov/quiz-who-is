import React from 'react';
import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import UpdateTeamForm from './UpdateTeamForm';
import {TeamResponse, UpdateTeamRequest} from "../../types/apiTypes";

interface UpdateTeamDialogProps {
  orgId: number;
  team: TeamResponse;
  onUpdate: (orgId: number, data: UpdateTeamRequest) => void;
  open: boolean;
  onClose: () => void;
}

const UpdateTeamDialog: React.FC<UpdateTeamDialogProps> = ({
                                                                 orgId,
                                                                 team,
                                                                 onUpdate,
                                                                 open,
                                                                 onClose
                                                               }) => {

  const handleUpdate = (orgId: number, data: UpdateTeamRequest) => {
    onUpdate(orgId, data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Team</DialogTitle>
      <DialogContent>
        <UpdateTeamForm
          orgId={orgId}
          onSubmit={handleUpdate}
          onClose={onClose}
          team={team}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTeamDialog;
