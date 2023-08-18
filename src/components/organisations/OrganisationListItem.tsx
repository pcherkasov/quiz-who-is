import React from 'react';
import { OrganisationInfoResponse } from '../../types/apiTypes';
import {Button, Card, CardContent, Stack, Typography} from "@mui/material";

interface OrganisationListItemProps {
  organisation: OrganisationInfoResponse;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const OrganisationListItem: React.FC<OrganisationListItemProps> = ({ organisation, onEdit, onDelete }) => {
  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5">{organisation.name}</Typography>
        <Typography variant="body2" color="text.secondary">{organisation.description}</Typography>
        <Stack direction="row" spacing={2} marginTop={2}>
          <Button variant="contained" color="primary" onClick={() => onEdit(organisation.id)}>Edit</Button>
          <Button variant="contained" color="error" onClick={() => onDelete(organisation.id)}>Delete</Button>
        </Stack>
      </CardContent>
    </Card>
  )
};

export default OrganisationListItem;
