import React from 'react';
import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import UpdateSeasonForm from './UpdateSeasonForm';
import {SeasonResponse, UpdateSeasonRequest} from "../../types/apiTypes";

interface UpdateSeasonDialogProps {
  orgId: number;
  season: SeasonResponse;
  onUpdate: (orgId: number, data: UpdateSeasonRequest) => void;
  open: boolean;
  onClose: () => void;
}

const UpdateSeasonDialog: React.FC<UpdateSeasonDialogProps> = ({
                                                                 orgId,
                                                                 season,
                                                                 onUpdate,
                                                                 open,
                                                                 onClose
                                                               }) => {

  const handleUpdate = (orgId: number, data: UpdateSeasonRequest) => {
    onUpdate(orgId, data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Season</DialogTitle>
      <DialogContent>
        <UpdateSeasonForm
          orgId={orgId}
          onSubmit={handleUpdate}
          onClose={onClose}
          season={season}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSeasonDialog;
